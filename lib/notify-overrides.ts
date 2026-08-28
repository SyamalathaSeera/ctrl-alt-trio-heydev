import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

export type NotifyOverride = {
  projectId: string;
  emailCipher: string;
  maskedTo: string;
};

const dir = join(process.env.VERCEL ? "/tmp" : process.cwd(), ".data");
const file = join(dir, "notify-overrides.json");

function readOverrides(): NotifyOverride[] {
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as NotifyOverride[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeOverrides(overrides: NotifyOverride[]) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, JSON.stringify(overrides.slice(0, 3)));
}

export function listOverrides() {
  return readOverrides();
}

export function getOverride(projectId: string) {
  return readOverrides().find((item) => item.projectId === projectId);
}

export function upsertOverride(override: NotifyOverride) {
  const next = readOverrides().filter((item) => item.projectId !== override.projectId);
  next.unshift(override);
  writeOverrides(next);
}

export function removeOverride(projectId: string) {
  writeOverrides(readOverrides().filter((item) => item.projectId !== projectId));
}
