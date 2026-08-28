import { TEAM_PROJECTS } from "@/data/team";
import { corsJson, OPTIONS } from "@/lib/cors";
import { encryptEmail, maskEmail } from "@/lib/email-crypto";
import { listOverrides, upsertOverride } from "@/lib/notify-overrides";

export { OPTIONS };
export const runtime = "nodejs";

export async function GET() {
  const overrides = listOverrides();
  return corsJson({
    slots: TEAM_PROJECTS.map((project) => {
      const override = overrides.find((item) => item.projectId === project.id);
      return {
        projectId: project.id,
        title: project.title,
        owner: project.owner,
        maskedTo: override?.maskedTo ?? null,
      };
    }),
  });
}

export async function POST(request: Request) {
  let emails: string[] = [];
  try {
    const body = (await request.json()) as { emails?: string[] };
    emails = Array.isArray(body.emails) ? body.emails : [];
  } catch {
    return corsJson({ error: "Invalid JSON" }, { status: 400 });
  }

  const filled = emails.map((item) => item.trim()).filter((item) => item.includes("@"));
  if (filled.length !== 3) {
    return corsJson({ error: "Need exactly three emails" }, { status: 400 });
  }

  TEAM_PROJECTS.forEach((project, index) => {
    const email = filled[index];
    upsertOverride({
      projectId: project.id,
      emailCipher: encryptEmail(email),
      maskedTo: maskEmail(email),
    });
  });

  return GET();
}
