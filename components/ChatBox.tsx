"use client";

import { useEffect, useState } from "react";
import type { ChatThread } from "@/lib/types";

export function ChatBox({
  threadId,
  from,
}: {
  threadId: string;
  from: "judge" | "owner";
}) {
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch(`/api/chat?id=${encodeURIComponent(threadId)}`, {
        cache: "no-store",
      });
      const data = (await res.json()) as { thread?: ChatThread | null };
      if (!cancelled) setThread(data.thread ?? null);
    }
    load();
    const timer = window.setInterval(load, 1200);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [threadId]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: threadId, from, text }),
    });
    const data = (await res.json()) as { thread?: ChatThread };
    if (data.thread) setThread(data.thread);
    setText("");
  }

  if (!thread) {
    return <p className="text-sm text-stone-400">Connecting…</p>;
  }

  if (!thread.accepted && from === "judge") {
    return (
      <p className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-stone-200">
        Waiting for {thread.owner} to accept on Pings…
      </p>
    );
  }

  if (!thread.accepted && from === "owner") {
    return (
      <p className="text-sm text-stone-400">Accept the request to open chat.</p>
    );
  }

  return (
    <div>
      <div className="max-h-48 space-y-2 overflow-y-auto rounded-2xl bg-black/30 p-3">
        {thread.messages.map((message) => (
          <p
            key={message.id}
            className={`text-sm leading-6 ${
              message.from === from ? "text-rose-100" : "text-stone-300"
            }`}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              {message.from === "judge" ? "Judge" : thread.owner}
            </span>
            <br />
            {message.text}
          </p>
        ))}
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-stone-50 outline-none"
          placeholder="Type a message"
        />
        <button
          type="submit"
          className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
}
