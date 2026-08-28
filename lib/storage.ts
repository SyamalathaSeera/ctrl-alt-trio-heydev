import { DEFAULT_SKILLS } from "@/data/projects";
import type { MatchRecord, Project } from "@/lib/types";

const SKILLS_KEY = "heydev:skills";
const MATCHES_KEY = "heydev:matches";
const POSTED_KEY = "heydev:posted";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadSkills(): string[] {
  const skills = readJson<string[]>(SKILLS_KEY, DEFAULT_SKILLS);
  return Array.isArray(skills) && skills.length ? skills : DEFAULT_SKILLS;
}

export function saveSkills(skills: string[]) {
  window.localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
}

export function loadMatches(): MatchRecord[] {
  const matches = readJson<MatchRecord[]>(MATCHES_KEY, []);
  return Array.isArray(matches) ? matches : [];
}

export function saveMatches(matches: MatchRecord[]) {
  window.localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
}

export function loadPosted(): Project[] {
  const posted = readJson<Project[]>(POSTED_KEY, []);
  return Array.isArray(posted) ? posted : [];
}

export function savePosted(posted: Project[]) {
  window.localStorage.setItem(POSTED_KEY, JSON.stringify(posted));
}
