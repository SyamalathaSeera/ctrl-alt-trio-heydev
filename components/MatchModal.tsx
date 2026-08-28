"use client";

import { useState } from "react";
import { ChatBox } from "@/components/ChatBox";
import type { MatchRecord } from "@/lib/types";

export function MatchModal({
  match,
  loading,
  onClose,
}: {
  match: MatchRecord;
  loading: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const threadId = match.notify?.threadId;

  async function copy() {
    try {
      await navigator.clipboard.writeText(match.icebreaker);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <div className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-[28px] border border-rose-400/25 bg-[#1a1218] p-6 shadow-[0_30px_80px_rgba(255,77,109,0.18)]">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-300">
          It&apos;s a match
        </p>
        <h2 className="mt-2 text-center font-[family-name:var(--font-display)] text-5xl italic text-stone-50">
          Hey, Dev.
        </h2>
        <p className="mt-3 text-center text-sm text-stone-300">
          You and {match.project.owner} on{" "}
          <span className="text-stone-50">{match.project.title}</span>
        </p>
        <p className="mt-4 rounded-2xl bg-white/5 px-4 py-3 text-sm leading-6 text-rose-100">
          {match.reason}
        </p>
        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
            {loading ? "Gemini is writing the first hey…" : "First message"}
            {!loading && match.source === "template" ? " · local fallback" : null}
          </p>
          <p className="mt-2 text-[15px] leading-6 text-stone-100">
            {match.icebreaker}
          </p>
        </div>
        {match.notify?.delivered ? (
          <p className="mt-4 text-sm leading-6 text-stone-300">
            Ping sent to {match.notify.maskedTo}. {match.project.owner} accepts
            on Pings, then you can chat.
          </p>
        ) : null}
        {threadId ? (
          <div className="mt-4">
            <ChatBox threadId={threadId} from="judge" />
          </div>
        ) : null}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={copy}
            className="flex-1 rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-stone-100"
          >
            {copied ? "Copied" : "Copy hey"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full bg-rose-500 px-4 py-3 text-sm font-semibold text-white"
          >
            Keep swiping
          </button>
        </div>
      </div>
    </div>
  );
}
