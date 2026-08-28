"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChatBox } from "@/components/ChatBox";
import { TEAM_PROJECTS, memberBySlug } from "@/data/team";
import { apiUrl } from "@/lib/api";
import type { InboxPing } from "@/lib/types";

export function DemoInbox({ slug }: { slug: string }) {
  const member = memberBySlug(slug);
  const [pings, setPings] = useState<InboxPing[]>([]);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [inboxRes, chatRes] = await Promise.all([
          fetch(apiUrl(`/api/inbox?member=${encodeURIComponent(slug)}`), {
            cache: "no-store",
          }),
          fetch(apiUrl("/api/chat"), { cache: "no-store" }),
        ]);
        if (!inboxRes.ok) {
          if (!cancelled) setPings([]);
          return;
        }
        const data = (await inboxRes.json()) as { pings?: InboxPing[] };
        const chats = chatRes.ok
          ? ((await chatRes.json()) as {
              threads?: { id: string; accepted?: boolean; projectId?: string }[];
            })
          : { threads: [] };
        if (!cancelled) {
          setPings(data.pings ?? []);
          setAccepted(
            Object.fromEntries(
              (chats.threads ?? [])
                .filter(
                  (thread) =>
                    thread.accepted && thread.projectId === member?.projectId,
                )
                .map((thread) => [thread.id, true]),
            ),
          );
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError("Can't reach the ping server. Keep the laptop tunnel on.");
        }
      }
    }

    load();
    const timer = window.setInterval(load, 1500);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [slug, member?.projectId]);

  async function accept(threadId: string) {
    await fetch(apiUrl("/api/chat"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: threadId, action: "accept" }),
    });
    setAccepted((prev) => ({ ...prev, [threadId]: true }));
  }

  if (!member) return null;
  const project = TEAM_PROJECTS.find((item) => item.id === member.projectId);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-300">
        HeyDev
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-4xl italic text-stone-50">
        {project?.title ?? "Pings"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-stone-300">
        Incoming collab requests for this project.
      </p>
      <div className="mt-4 flex gap-2">
        <Link
          href="/"
          className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-stone-100"
        >
          Deck
        </Link>
        <Link
          href="/inbox"
          className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-stone-100"
        >
          All projects
        </Link>
      </div>

      {error ? <p className="mt-6 text-sm text-rose-300">{error}</p> : null}

      {pings.length === 0 ? (
        <p className="mt-10 rounded-[28px] border border-dashed border-white/15 px-5 py-10 text-center text-sm text-stone-400">
          No requests yet. A right swipe on this card lands here.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {pings.map((ping) => (
            <li
              key={ping.id}
              className="rounded-[24px] border border-rose-400/20 bg-[#16111a] p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-300">
                New request
              </p>
              <p className="mt-2 text-lg font-semibold text-stone-50">
                {ping.projectTitle}
              </p>
              <p className="text-sm text-stone-400">{ping.icebreaker}</p>
              {accepted[ping.id] ? (
                <div className="mt-4">
                  <ChatBox threadId={ping.id} from="owner" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => accept(ping.id)}
                  className="mt-4 w-full rounded-full bg-rose-500 py-2.5 text-sm font-semibold text-white"
                >
                  Accept and chat
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
