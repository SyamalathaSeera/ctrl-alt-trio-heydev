"use client";

import { useState } from "react";
import { SKILLS } from "@/data/projects";
import type { Project, ProjectTag } from "@/lib/types";

const TAGS: { id: ProjectTag; label: string }[] = [
  { id: "hackathon", label: "Hackathon" },
  { id: "oss", label: "Open source" },
  { id: "side-project", label: "Side project" },
];

export function PostProjectForm({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (project: Project) => void;
}) {
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [problem, setProblem] = useState("");
  const [have, setHave] = useState<string[]>([]);
  const [need, setNeed] = useState<string[]>([]);
  const [tag, setTag] = useState<ProjectTag>("hackathon");
  const [error, setError] = useState("");

  function toggle(list: string[], setList: (next: string[]) => void, skill: string) {
    setList(
      list.includes(skill) ? list.filter((item) => item !== skill) : [...list, skill],
    );
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim() || !owner.trim() || !problem.trim()) {
      setError("Title, your name, and the problem are required.");
      return;
    }
    if (!need.length) {
      setError("Pick at least one skill you need.");
      return;
    }
    onCreate({
      id: `posted-${Date.now()}`,
      title: title.trim(),
      owner: owner.trim(),
      ownerRole: "Posted on HeyDev",
      problem: problem.trim(),
      theyHave: have,
      theyNeed: need,
      tags: [tag],
      city: "This device",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <form
        onSubmit={submit}
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-[28px] border border-white/10 bg-[#141016] p-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-50">
            Post a project
          </h2>
          <button type="button" onClick={onClose} className="text-sm text-stone-400">
            Close
          </button>
        </div>
        <p className="mt-1 text-sm text-stone-400">
          Lands on your deck first. Saved on this browser only.
        </p>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-stone-500">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-stone-50 outline-none focus:border-rose-400/60"
            placeholder="The thing you want to ship"
          />
        </label>
        <label className="mt-3 block text-xs font-semibold uppercase tracking-wider text-stone-500">
          Your name
          <input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-stone-50 outline-none focus:border-rose-400/60"
            placeholder="First name is enough"
          />
        </label>
        <label className="mt-3 block text-xs font-semibold uppercase tracking-wider text-stone-500">
          The problem
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-stone-50 outline-none focus:border-rose-400/60"
            placeholder="What exists today, and what you want instead"
          />
        </label>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
          You have
        </p>
        <ChipPick
          selected={have}
          onToggle={(skill) => toggle(have, setHave, skill)}
        />
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
          You need
        </p>
        <ChipPick
          selected={need}
          onToggle={(skill) => toggle(need, setNeed, skill)}
        />

        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
          Kind
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TAGS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTag(item.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                tag === item.id
                  ? "bg-rose-500 text-white"
                  : "bg-white/8 text-stone-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-rose-500 py-3 text-sm font-semibold text-white"
        >
          Add to deck
        </button>
      </form>
    </div>
  );
}

function ChipPick({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (skill: string) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {SKILLS.map((skill) => {
        const on = selected.includes(skill);
        return (
          <button
            key={skill}
            type="button"
            onClick={() => onToggle(skill)}
            className={`rounded-full px-2.5 py-1 text-xs ${
              on ? "bg-rose-500 text-white" : "bg-white/8 text-stone-300"
            }`}
          >
            {skill}
          </button>
        );
      })}
    </div>
  );
}
