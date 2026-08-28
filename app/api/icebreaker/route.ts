import { templateIcebreaker } from "@/lib/match";
import type { Project } from "@/lib/types";

export const runtime = "nodejs";

type Body = {
  skills?: string[];
  project?: Project;
};

export async function POST(request: Request) {
  let skills: string[] = [];
  let project: Project | null = null;

  try {
    const body = (await request.json()) as Body;
    skills = Array.isArray(body.skills) ? body.skills : [];
    project = body.project ?? null;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!project?.title || !project.owner) {
    return Response.json({ error: "Missing project" }, { status: 400 });
  }

  const fallback = templateIcebreaker(skills, project);
  const key = process.env.GEMINI_API_KEY?.trim();

  if (!key) {
    return Response.json({ icebreaker: fallback, source: "template" });
  }

  const prompt = [
    "Write one first message from a developer who wants to collaborate on a project.",
    "Rules: max 2 sentences. No quotation marks. No markdown. No hashtags.",
    "Be specific about the skill-to-need fit. Warm and direct.",
    `Sender skills: ${skills.join(", ") || "generalist"}`,
    `Project: ${project.title}`,
    `Owner: ${project.owner} (${project.ownerRole})`,
    `Problem: ${project.problem}`,
    `They have: ${project.theyHave.join(", ")}`,
    `They need: ${project.theyNeed.join(", ")}`,
  ].join("\n");

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 160,
          },
        }),
      },
    );

    if (!res.ok) {
      return Response.json({ icebreaker: fallback, source: "template" });
    }

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join(" ")
      .trim()
      .replace(/^["']|["']$/g, "");

    if (!text) {
      return Response.json({ icebreaker: fallback, source: "template" });
    }

    return Response.json({ icebreaker: text, source: "gemini" });
  } catch {
    return Response.json({ icebreaker: fallback, source: "template" });
  }
}
