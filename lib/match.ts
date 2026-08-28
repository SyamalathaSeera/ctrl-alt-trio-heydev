import type { Project } from "@/lib/types";

export function overlapSkills(skills: string[], needed: string[]) {
  const have = new Set(skills.map((s) => s.toLowerCase()));
  return needed.filter((need) => have.has(need.toLowerCase()));
}

export function isComplementaryMatch(skills: string[], project: Project) {
  return overlapSkills(skills, project.theyNeed).length > 0;
}

export function matchReason(skills: string[], project: Project) {
  const hit = overlapSkills(skills, project.theyNeed);
  if (hit.length === 0) {
    return `Not a complement — they still need ${project.theyNeed.join(", ")}.`;
  }
  const rest = project.theyHave.length
    ? ` They already cover ${project.theyHave.join(", ")}.`
    : "";
  return `They need ${hit.join(" + ")}. You bring it.${rest}`;
}

export function templateIcebreaker(skills: string[], project: Project) {
  const bring = skills.length ? skills.join(", ") : "time and taste";
  const need = project.theyNeed.join(", ");
  return `Hey ${project.owner} — I'm in on ${project.title}. I bring ${bring}, and you're looking for ${need}. Want to ship this together?`;
}
