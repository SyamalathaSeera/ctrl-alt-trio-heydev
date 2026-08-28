import type { Project, ProjectTag } from "@/lib/types";

const TAG_LABEL: Record<ProjectTag, string> = {
  hackathon: "Hackathon",
  oss: "Open source",
  "side-project": "Side project",
};

export function ProjectCard({
  project,
  stamp,
}: {
  project: Project;
  stamp?: "ship" | "skip" | null;
}) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#16111a] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(255,77,109,0.28),_transparent_62%)]" />

      {stamp === "ship" ? (
        <div className="pointer-events-none absolute left-5 top-8 rotate-[-14deg] rounded-md border-4 border-rose-400 px-3 py-1 text-2xl font-black tracking-widest text-rose-400">
          SHIP
        </div>
      ) : null}
      {stamp === "skip" ? (
        <div className="pointer-events-none absolute right-5 top-8 rotate-[12deg] rounded-md border-4 border-stone-400 px-3 py-1 text-2xl font-black tracking-widest text-stone-400">
          SKIP
        </div>
      ) : null}

      <div className="relative flex items-start justify-between gap-3 px-5 pt-5">
        <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-200">
          {TAG_LABEL[project.tags[0]]}
        </span>
        <span className="text-xs text-stone-400">{project.city}</span>
      </div>

      <div className="relative flex flex-1 flex-col px-5 pb-5 pt-4">
        <h2 className="font-[family-name:var(--font-display)] text-[1.85rem] leading-[1.1] text-stone-50 sm:text-4xl">
          {project.title}
        </h2>
        <p className="mt-2 text-sm text-stone-400">
          {project.owner} · {project.ownerRole}
        </p>
        <p className="mt-4 text-[15px] leading-6 text-stone-200">
          {project.problem}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
          <ChipColumn label="They have" items={project.theyHave} tone="have" />
          <ChipColumn label="They need" items={project.theyNeed} tone="need" />
        </div>
      </div>
    </article>
  );
}

function ChipColumn({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "have" | "need";
}) {
  const cls =
    tone === "need"
      ? "border-rose-400/35 bg-rose-500/10 text-rose-100"
      : "border-white/10 bg-white/6 text-stone-200";

  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-full border px-2.5 py-1 text-xs ${cls}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
