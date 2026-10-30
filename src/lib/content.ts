import { entries as localEntries } from "@/content/entries";
import { now as localNow } from "@/content/now";
import { chapters as localChapters } from "@/content/story";
import { rooms as baseRooms } from "@/content/rooms";
import { fetchEntries, fetchNow, fetchStory, notionEnabled, type Chapter, type NowData } from "@/lib/notion";
import type { Block, Entry, Room, RoomSlug } from "@/lib/types";
import { formatDate } from "@/lib/labels";

// The single place pages read content from.
// With NOTION_TOKEN set, content comes from Notion at build time.
// Without it, the local files in src/content are used.

// During a build, Notion is read once and reused across every page.
// In `npm run dev`, it is re-read after a few seconds, so refreshing the
// browser shows Notion edits without restarting. A failed read is never kept.
const DEV_REFRESH_MS = process.env.NODE_ENV === "development" ? 5_000 : Infinity;

function cached<T>(load: () => Promise<T>): () => Promise<T> {
  let promise: Promise<T> | null = null;
  let loadedAt = 0;
  return () => {
    if (!promise || Date.now() - loadedAt > DEV_REFRESH_MS) {
      loadedAt = Date.now();
      promise = load().catch((err) => {
        promise = null;
        throw err;
      });
    }
    return promise;
  };
}

function sortEntries(list: Entry[]) {
  return [...list].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.catalog.localeCompare(a.catalog)));
}

export function contentSource() {
  return notionEnabled() ? "notion" : "local";
}

export const getEntries: () => Promise<Entry[]> = cached(() =>
  (notionEnabled() ? fetchEntries() : Promise.resolve(localEntries)).then(sortEntries),
);

export async function getEntriesByRoom(room: RoomSlug) {
  return (await getEntries()).filter((e) => e.room === room);
}

export async function getEntry(room: string, slug: string) {
  return (await getEntries()).find((e) => e.room === room && e.slug === slug);
}

export async function getEntryByCatalog(catalog: string) {
  return (await getEntries()).find((e) => e.catalog === catalog);
}

export const getNow: () => Promise<NowData> = cached(() =>
  notionEnabled() ? fetchNow() : Promise.resolve(localNow),
);

export const getStory: () => Promise<Chapter[]> = cached(() =>
  notionEnabled() ? fetchStory() : Promise.resolve(localChapters),
);

/** Rooms with the parts that can be counted kept up to date automatically. */
export async function getRooms(): Promise<Room[]> {
  const [list, now] = await Promise.all([getEntries(), getNow()]);
  const files = (n: number) => `${n} ${n === 1 ? "file" : "files"}`;
  return baseRooms.map((r) => {
    if (r.slug === "now") return { ...r, status: `Updated ${formatDate(now.updated).replace(/ \d{4}$/, "")}` };
    if (r.slug === "archive") return { ...r, cipherDescription: files(list.length) };
    const inRoom = list.filter((e) => e.room === r.slug);
    if (["work", "lab", "failures", "writing", "films"].includes(r.slug)) {
      const running = inRoom.some((e) => e.status === "running" || e.status === "production");
      return {
        ...r,
        cipherDescription: inRoom.length ? `${files(inRoom.length)}${running ? " · running" : ""}` : r.cipherDescription,
        live: r.live || running,
      };
    }
    return r;
  });
}

export function readingMinutes(blocks: Block[]): number {
  const words = blocks
    .map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : ""))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** A slim, client-safe index of entries for search and the command line. */
export async function getSearchIndex() {
  return (await getEntries()).map((e) => ({
    catalog: e.catalog,
    title: e.title,
    room: e.room,
    slug: e.slug,
    type: e.type,
    status: e.status,
    date: e.date,
    tags: e.tags,
    summary: e.summary,
  }));
}
export type SearchItem = Awaited<ReturnType<typeof getSearchIndex>>[number];

export * from "@/lib/labels";
