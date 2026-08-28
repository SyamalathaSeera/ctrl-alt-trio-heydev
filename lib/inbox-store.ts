import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { InboxPing } from "@/lib/types";

const dir = join(process.env.VERCEL ? "/tmp" : process.cwd(), ".data");
const file = join(dir, "inbox.json");

function readPings(): InboxPing[] {
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as InboxPing[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePings(pings: InboxPing[]) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, JSON.stringify(pings.slice(0, 50)));
}

export function recordPing(ping: InboxPing) {
  const pings = readPings();
  pings.unshift(ping);
  writePings(pings);
}

export function listPings(projectId?: string) {
  const pings = readPings();
  if (!projectId) return pings;
  return pings.filter((ping) => ping.projectId === projectId);
}
