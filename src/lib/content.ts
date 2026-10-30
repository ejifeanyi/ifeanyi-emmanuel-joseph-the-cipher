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

let entriesPromise: Promise<Entry[]> | null = null;
let nowPromise: Promise<NowData> | null = null;
let storyPromise: Promise<Chapter[]> | null = null;

function sortEntries(list: Entry[]) {
  return [...list].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.catalog.localeCompare(a.catalog)));
}

export function contentSource() {
  return notionEnabled() ? "notion" : "local";
}

export function getEntries(): Promise<Entry[]> {
  entriesPromise ??= (notionEnabled() ? fetchEntries() : Promise.resolve(localEntries)).then(sortEntries);
  return entriesPromise;
}

export async function getEntriesByRoom(room: RoomSlug) {
  return (await getEntries()).filter((e) => e.room === room);
}

export async function getEntry(room: string, slug: string) {
  return (await getEntries()).find((e) => e.room === room && e.slug === slug);
}

export async function getEntryByCatalog(catalog: string) {
  return (await getEntries()).find((e) => e.catalog === catalog);
}

export function getNow(): Promise<NowData> {
  nowPromise ??= notionEnabled() ? fetchNow() : Promise.resolve(localNow);
  return nowPromise;
}

export function getStory(): Promise<Chapter[]> {
  storyPromise ??= notionEnabled() ? fetchStory() : Promise.resolve(localChapters);
  return storyPromise;
}

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
