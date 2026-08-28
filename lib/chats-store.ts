import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { ChatThread } from "@/lib/types";

const dir = join(process.env.VERCEL ? "/tmp" : process.cwd(), ".data");
const file = join(dir, "chats.json");

function readThreads(): ChatThread[] {
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as ChatThread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeThreads(threads: ChatThread[]) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, JSON.stringify(threads.slice(0, 50)));
}

export function listThreads() {
  return readThreads();
}

export function getThread(id: string) {
  return readThreads().find((thread) => thread.id === id) ?? null;
}

export function saveThread(thread: ChatThread) {
  const threads = readThreads().filter((item) => item.id !== thread.id);
  threads.unshift(thread);
  writeThreads(threads);
}
