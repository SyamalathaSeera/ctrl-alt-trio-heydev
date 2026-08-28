import { randomUUID } from "crypto";
import { getThread, listThreads, saveThread } from "@/lib/chats-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (id) {
    return Response.json({ thread: getThread(id) });
  }
  return Response.json({ threads: listThreads() });
}

export async function POST(request: Request) {
  let id = "";
  let action = "";
  let from: "judge" | "owner" = "judge";
  let text = "";

  try {
    const body = (await request.json()) as {
      id?: string;
      action?: string;
      from?: "judge" | "owner";
      text?: string;
    };
    id = body.id?.trim() ?? "";
    action = body.action?.trim() ?? "";
    from = body.from === "owner" ? "owner" : "judge";
    text = body.text?.trim() ?? "";
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const thread = getThread(id);
  if (!thread) {
    return Response.json({ error: "No thread" }, { status: 404 });
  }

  if (action === "accept") {
    thread.accepted = true;
    saveThread(thread);
    return Response.json({ thread });
  }

  if (!text) {
    return Response.json({ error: "Empty message" }, { status: 400 });
  }

  thread.messages.push({
    id: randomUUID(),
    from,
    text,
    at: new Date().toISOString(),
  });
  saveThread(thread);
  return Response.json({ thread });
}
