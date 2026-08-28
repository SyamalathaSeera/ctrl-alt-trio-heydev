"use client";

import { useEffect, useMemo, useState } from "react";
import { MatchInbox } from "@/components/MatchInbox";
import { MatchModal } from "@/components/MatchModal";
import { PostProjectForm } from "@/components/PostProjectForm";
import { SwipeDeck } from "@/components/SwipeDeck";
import { PROJECTS, SKILLS, DEFAULT_SKILLS } from "@/data/projects";
import { TEAM_PROJECTS } from "@/data/team";
import {
  isComplementaryMatch,
  matchReason,
  templateIcebreaker,
} from "@/lib/match";
import {
  loadMatches,
  loadPosted,
  loadSkills,
  saveMatches,
  savePosted,
  saveSkills,
} from "@/lib/storage";
import type { MatchRecord, Project, ProjectTag } from "@/lib/types";

type Filter = "all" | ProjectTag;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "hackathon", label: "Hackathon" },
  { id: "oss", label: "OSS" },
  { id: "side-project", label: "Side" },
];

export function HeyDevApp() {
  const [skills, setSkills] = useState<string[]>(DEFAULT_SKILLS);
  const [posted, setPosted] = useState<Project[]>([]);
  const [seen, setSeen] = useState<string[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [activeMatch, setActiveMatch] = useState<MatchRecord | null>(null);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [miss, setMiss] = useState<string | null>(null);
  const [showPost, setShowPost] = useState(false);
  const [showInbox, setShowInbox] = useState(false);

  useEffect(() => {
    setSkills(loadSkills());
    setPosted(loadPosted());
    setMatches(loadMatches());
  }, []);

  const deck = useMemo(() => {
    const all = [...TEAM_PROJECTS, ...posted, ...PROJECTS];
    return all.filter((project) => {
      if (seen.includes(project.id)) return false;
      if (filter === "all") return true;
      return project.tags.includes(filter);
    });
  }, [filter, posted, seen]);

  function toggleSkill(skill: string) {
    const next = skills.includes(skill)
      ? skills.filter((item) => item !== skill)
      : [...skills, skill];
    setSkills(next);
    saveSkills(next);
  }

  async function onSwipe(project: Project, dir: "left" | "right") {
    setSeen((prev) => [...prev, project.id]);
    setMiss(null);
    if (dir === "left") return;

    if (!isComplementaryMatch(skills, project)) {
      setMiss(matchReason(skills, project));
      window.setTimeout(() => setMiss(null), 2200);
      return;
    }

    const draft: MatchRecord = {
      project,
      reason: matchReason(skills, project),
      icebreaker: templateIcebreaker(skills, project),
      source: "template",
      at: new Date().toISOString(),
    };
    setActiveMatch(draft);
    setGeminiLoading(true);

    try {
      const res = await fetch("/api/icebreaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, project }),
      });
      const data = (await res.json()) as {
        icebreaker?: string;
        source?: "gemini" | "template";
      };
      const finalMatch: MatchRecord = {
        ...draft,
        icebreaker: data.icebreaker || draft.icebreaker,
        source: data.source === "gemini" ? "gemini" : "template",
      };
      try {
        const notifyRes = await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skills,
            project,
            icebreaker: finalMatch.icebreaker,
          }),
        });
        const notifyData = (await notifyRes.json()) as {
          delivered?: boolean;
          maskedTo?: string;
          threadId?: string;
        };
        if (notifyData.delivered) {
          finalMatch.notify = {
            delivered: true,
            maskedTo: notifyData.maskedTo || "••••",
            threadId: notifyData.threadId,
          };
        }
      } catch {
        /* inbox ping is best-effort so the match modal still shows */
      }
      setActiveMatch(finalMatch);
      const next = [finalMatch, ...matches];
      setMatches(next);
      saveMatches(next);
    } catch {
      try {
        const notifyRes = await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skills,
            project,
            icebreaker: draft.icebreaker,
          }),
        });
        const notifyData = (await notifyRes.json()) as {
          delivered?: boolean;
          maskedTo?: string;
          threadId?: string;
        };
        if (notifyData.delivered) {
          draft.notify = {
            delivered: true,
            maskedTo: notifyData.maskedTo || "••••",
            threadId: notifyData.threadId,
          };
          setActiveMatch({ ...draft });
        }
      } catch {
        /* still show the match */
      }
      const next = [draft, ...matches];
      setMatches(next);
      saveMatches(next);
    } finally {
      setGeminiLoading(false);
    }
  }

  function addProject(project: Project) {
    const next = [project, ...posted];
    setPosted(next);
    savePosted(next);
    setSeen((prev) => prev.filter((id) => id !== project.id));
    setShowPost(false);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pb-8 pt-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-300">
            Ctrl Alt Trio
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl italic text-stone-50">
            HeyDev
          </h1>
        </div>
        <div className="flex gap-2">
          <a
            href="/inbox"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-rose-400/40 px-3 py-2 text-xs font-semibold text-rose-100"
          >
            Pings
          </a>
          <button
            type="button"
            onClick={() => setShowInbox(true)}
            className="rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-stone-100"
          >
            Matches {matches.length}
          </button>
          <button
            type="button"
            onClick={() => setShowPost(true)}
            className="rounded-full bg-rose-500 px-3 py-2 text-xs font-semibold text-white"
          >
            Post
          </button>
        </div>
      </header>

      <section className="mt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
          I bring
        </p>
        <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SKILLS.map((skill) => {
            const on = skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  on ? "bg-rose-500 text-white" : "bg-white/8 text-stone-300"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-3 flex gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              filter === item.id
                ? "bg-white text-stone-950"
                : "bg-white/8 text-stone-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex-1">
        {deck.length ? (
          <SwipeDeck projects={deck} onSwipe={onSwipe} />
        ) : (
          <div className="flex h-[min(62dvh,520px)] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/15 px-6 text-center">
            <p className="font-[family-name:var(--font-display)] text-3xl text-stone-50">
              Deck&apos;s empty
            </p>
            <p className="mt-2 text-sm text-stone-400">
              Reset the seeded projects or post one of your own.
            </p>
            <button
              type="button"
              onClick={() => setSeen([])}
              className="mt-5 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Reset deck
            </button>
          </div>
        )}
      </div>

      {miss ? (
        <p className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-stone-200">
          {miss}
        </p>
      ) : (
        <p className="mt-3 text-center text-xs text-stone-500">
          Left skip · Right ship · Match only if you fill what they need
        </p>
      )}

      {deck.length ? (
        <div className="mt-4 flex justify-center gap-8">
          <button
            type="button"
            onClick={() => onSwipe(deck[0], "left")}
            className="h-16 w-16 rounded-full border border-white/15 text-lg font-black text-stone-300"
            aria-label="Skip"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={() => onSwipe(deck[0], "right")}
            className="h-16 w-16 rounded-full bg-rose-500 text-lg font-black text-white shadow-[0_8px_24px_rgba(244,63,94,0.45)]"
            aria-label="Ship this"
          >
            ✓
          </button>
        </div>
      ) : null}

      {activeMatch ? (
        <MatchModal
          match={activeMatch}
          loading={geminiLoading}
          onClose={() => setActiveMatch(null)}
        />
      ) : null}
      {showPost ? (
        <PostProjectForm onClose={() => setShowPost(false)} onCreate={addProject} />
      ) : null}
      {showInbox ? (
        <MatchInbox matches={matches} onClose={() => setShowInbox(false)} />
      ) : null}
    </div>
  );
}
