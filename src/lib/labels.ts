import type { EntryType, Status } from "@/lib/types";

// Small display helpers with no content imports, safe for client components.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** 2026-10-29 → 29 Oct 2026 (timezone-safe: parsed from the string). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** 2026-10-29 → 29.10.2026 (The Cipher's format). */
export function formatDateCipher(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export const statusLabel: Record<Status, string> = {
  seed: "Seed",
  growing: "Growing",
  finished: "Finished",
  abandoned: "Abandoned",
  running: "Running",
  concluded: "Concluded",
  production: "In production",
};

export const typeLabel: Record<EntryType, string> = {
  project: "Project",
  experiment: "Lab",
  postmortem: "Failure",
  essay: "Essay",
  film: "Film",
  paper: "Paper",
  "life-event": "Life event",
};

export const liveStatuses: Status[] = ["running", "growing", "production"];

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
/** 9 → "nine" (falls back to digits above twelve). */
export function numberWord(n: number) {
  return WORDS[n] ?? String(n);
}

export function entryHref(e: { room: string; slug: string }) {
  return `/${e.room}/${e.slug}`;
}
