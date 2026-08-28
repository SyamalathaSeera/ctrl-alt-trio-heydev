import { randomUUID } from "crypto";
import { corsJson, OPTIONS } from "@/lib/cors";
import { getThread, listThreads, saveThread } from "@/lib/chats-store";

export { OPTIONS };
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (id) {
    return corsJson({ thread: getThread(id) });
  }
  return corsJson({ threads: listThreads() });
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
    return corsJson({ error: "Invalid JSON" }, { status: 400 });
  }

  const thread = getThread(id);
  if (!thread) {
    return corsJson({ error: "No thread" }, { status: 404 });
  }

  if (action === "accept") {
    thread.accepted = true;
    saveThread(thread);
    return corsJson({ thread });
  }

  if (!text) {
    return corsJson({ error: "Empty message" }, { status: 400 });
  }

  thread.messages.push({
    id: randomUUID(),
    from,
    text,
    at: new Date().toISOString(),
  });
  saveThread(thread);
  return corsJson({ thread });
}
