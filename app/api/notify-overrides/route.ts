import { PROJECTS } from "@/data/projects";
import { encryptEmail, maskEmail } from "@/lib/email-crypto";
import {
  listOverrides,
  removeOverride,
  upsertOverride,
} from "@/lib/notify-overrides";

export const runtime = "nodejs";

export async function GET() {
  const overrides = listOverrides().map((item) => {
    const project = PROJECTS.find((entry) => entry.id === item.projectId);
    return {
      projectId: item.projectId,
      projectTitle: project?.title ?? item.projectId,
      owner: project?.owner ?? "",
      maskedTo: item.maskedTo,
    };
  });

  return Response.json({
    overrides,
    projects: PROJECTS.map((project) => ({
      id: project.id,
      title: project.title,
      owner: project.owner,
    })),
  });
}

export async function POST(request: Request) {
  let projectId = "";
  let email = "";
  try {
    const body = (await request.json()) as { projectId?: string; email?: string };
    projectId = body.projectId?.trim() ?? "";
    email = body.email?.trim() ?? "";
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const project = PROJECTS.find((entry) => entry.id === projectId);
  if (!project) {
    return Response.json({ error: "Unknown project" }, { status: 400 });
  }
  if (!email.includes("@")) {
    return Response.json({ error: "Need a real email" }, { status: 400 });
  }
  if (listOverrides().length >= 3 && !listOverrides().some((item) => item.projectId === projectId)) {
    return Response.json({ error: "Three real emails max for the demo" }, { status: 400 });
  }

  upsertOverride({
    projectId,
    emailCipher: encryptEmail(email),
    maskedTo: maskEmail(email),
  });

  return Response.json({
    saved: true,
    projectId,
    maskedTo: maskEmail(email),
  });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const projectId = url.searchParams.get("projectId")?.trim() ?? "";
  if (!projectId) {
    return Response.json({ error: "Missing projectId" }, { status: 400 });
  }
  removeOverride(projectId);
  return Response.json({ removed: true });
}
