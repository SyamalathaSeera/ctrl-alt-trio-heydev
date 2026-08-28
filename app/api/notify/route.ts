import { memberByProjectId } from "@/data/team";
import { randomUUID } from "crypto";
import { decryptEmail, maskEmail } from "@/lib/email-crypto";
import { saveThread } from "@/lib/chats-store";
import { recordPing } from "@/lib/inbox-store";
import { getOverride } from "@/lib/notify-overrides";
import { sendMatchEmail } from "@/lib/send-email";
import type { Project } from "@/lib/types";

export const runtime = "nodejs";

type Body = {
  skills?: string[];
  icebreaker?: string;
  project?: Project;
};

export async function POST(request: Request) {
  let project: Project | null = null;
  let skills: string[] = [];
  let icebreaker = "";

  try {
    const body = (await request.json()) as Body;
    project = body.project ?? null;
    skills = Array.isArray(body.skills) ? body.skills : [];
    icebreaker = typeof body.icebreaker === "string" ? body.icebreaker : "";
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!project?.title) {
    return Response.json({ error: "Missing project" }, { status: 400 });
  }

  const override = getOverride(project.id);
  const emailCipher = override?.emailCipher || project.emailCipher;
  if (!emailCipher) {
    return Response.json({ error: "Missing encrypted destination" }, { status: 400 });
  }

  let to = "";
  let maskedTo = override?.maskedTo || "••••";
  try {
    to = decryptEmail(emailCipher);
    maskedTo = maskEmail(to);
  } catch {
    return Response.json(
      { error: "Could not decrypt destination", emailCipher },
      { status: 400 },
    );
  }

  const threadId = randomUUID();
  saveThread({
    id: threadId,
    projectId: project.id,
    projectTitle: project.title,
    owner: project.owner,
    accepted: false,
    messages: icebreaker
      ? [
          {
            id: randomUUID(),
            from: "judge",
            text: icebreaker,
            at: new Date().toISOString(),
          },
        ]
      : [],
  });

  recordPing({
    id: threadId,
    at: new Date().toISOString(),
    projectId: project.id,
    projectTitle: project.title,
    owner: project.owner,
    emailCipher,
    maskedTo,
    icebreaker,
    skills,
  });

  const member = memberByProjectId(project.id);
  const appUrl =
    process.env.PUBLIC_APP_URL?.trim() ||
    request.headers.get("origin") ||
    "http://localhost:3000";
  const pingPath = member ? `/inbox/${member.slug}` : "/inbox";
  const mailed = await sendMatchEmail({
    to,
    subject: `HeyDev: someone wants to ship ${project.title} with you`,
    text: [
      `A judge right-swiped ${project.title}.`,
      icebreaker ? `\nTheir hey:\n${icebreaker}\n` : "",
      `This ping is only on your page. Accept and chat: ${appUrl.replace(/\/$/, "")}${pingPath}`,
      "If this is the first HeyDev mail, confirm the FormSubmit activation email once (check spam), then later swipes will land in Gmail.",
    ].join("\n"),
  });

  return Response.json({
    delivered: true,
    emailed: mailed.sent,
    emailVia: mailed.via,
    maskedTo,
    emailCipher,
    threadId,
    algorithm: "AES-256-GCM",
    realOverride: Boolean(override),
  });
}
