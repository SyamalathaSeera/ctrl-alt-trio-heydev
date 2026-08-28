"use client";

import type { MatchRecord } from "@/lib/types";

export function MatchInbox({
  matches,
  onClose,
}: {
  matches: MatchRecord[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <div className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-[28px] border border-white/10 bg-[#141016] p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-50">
            Matches
          </h2>
          <button type="button" onClick={onClose} className="text-sm text-stone-400">
            Close
          </button>
        </div>
        {matches.length === 0 ? (
          <p className="mt-6 text-sm text-stone-400">
            No ships yet. Swipe right when your skills fill what they need.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {matches.map((match) => (
              <li
                key={`${match.project.id}-${match.at}`}
                className="rounded-2xl border border-white/10 bg-white/4 p-4"
              >
                <p className="text-sm font-semibold text-stone-50">
                  {match.project.title}
                </p>
                <p className="text-xs text-stone-400">{match.project.owner}</p>
                <p className="mt-2 text-sm leading-6 text-stone-200">
                  {match.icebreaker}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
