// Reads site content from Notion at build time.
//
// Needs NOTION_TOKEN (an internal integration secret with access to the
// "ifeanyiemmanueljoseph.com" page in Notion). Without it, the site uses the
// local content in src/content, so it always builds.
//
// The Notion conventions (Cipher heading, ◇ notes, ⬛ callouts, one-line
// fields) are explained on the hub page in Notion.

import type { Block, Entry, EntryType, RoomSlug, Status } from "@/lib/types";

export const NOTION_DATABASES = {
  entries: process.env.NOTION_ENTRIES_DB ?? "29cbb652546540a6a5dd941573f0083a",
  now: process.env.NOTION_NOW_DB ?? "8a80491c42c8429192cc4769479dd4b9",
  story: process.env.NOTION_STORY_DB ?? "b6b971d6bc40464c9842fc94f4d05c46",
};

const API = process.env.NOTION_API_BASE ?? "https://api.notion.com/v1"; // override only for tests
const VERSION = "2022-06-28";

export function notionEnabled() {
  return Boolean(process.env.NOTION_TOKEN);
}

/* ------------------------------------------------------------------
   HTTP
------------------------------------------------------------------- */
async function call<T>(path: string, body?: unknown, attempt = 0): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if ((res.status === 429 || res.status >= 500) && attempt < 4) {
    const wait = Number(res.headers.get("retry-after") ?? 1) * 1000 * (attempt + 1);
    await new Promise((r) => setTimeout(r, wait));
    return call<T>(path, body, attempt + 1);
  }
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Notion ${res.status} on ${path}: ${detail.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

type List<T> = { results: T[]; has_more: boolean; next_cursor: string | null };

async function queryAll(databaseId: string, body: Record<string, unknown> = {}): Promise<NotionPage[]> {
  const out: NotionPage[] = [];
  let cursor: string | null = null;
  do {
    const page: List<NotionPage> = await call<List<NotionPage>>(`/databases/${databaseId}/query`, {
      ...body,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    out.push(...page.results);
    cursor = page.has_more ? page.next_cursor : null;
  } while (cursor);
  return out;
}

async function blocksOf(pageId: string): Promise<NotionBlock[]> {
  const out: NotionBlock[] = [];
  let cursor: string | null = null;
  do {
    const q: string = `?page_size=100${cursor ? `&start_cursor=${cursor}` : ""}`;
    const page: List<NotionBlock> = await call<List<NotionBlock>>(`/blocks/${pageId}/children${q}`);
    out.push(...page.results);
    cursor = page.has_more ? page.next_cursor : null;
  } while (cursor);
  return out;
}

/* ------------------------------------------------------------------
   Notion shapes (only what we read)
------------------------------------------------------------------- */
type RichText = { plain_text: string };
type Prop =
  | { type: "title"; title: RichText[] }
  | { type: "rich_text"; rich_text: RichText[] }
  | { type: "select"; select: { name: string } | null }
  | { type: "multi_select"; multi_select: { name: string }[] }
  | { type: "checkbox"; checkbox: boolean }
  | { type: "date"; date: { start: string } | null }
  | { type: "number"; number: number | null }
  | { type: "relation"; relation: { id: string }[] }
  | { type: string; [k: string]: unknown };

export type NotionPage = { id: string; properties: Record<string, Prop> };
export type NotionBlock = { id: string; type: string; [k: string]: unknown };

const plain = (rt?: RichText[]) => (rt ?? []).map((r) => r.plain_text).join("");

function text(p?: Prop): string {
  if (!p) return "";
  if (p.type === "title") return plain((p as { title: RichText[] }).title).trim();
  if (p.type === "rich_text") return plain((p as { rich_text: RichText[] }).rich_text).trim();
  return "";
}
const select = (p?: Prop) => (p?.type === "select" ? ((p as { select: { name: string } | null }).select?.name ?? "") : "");
const multi = (p?: Prop) => (p?.type === "multi_select" ? (p as { multi_select: { name: string }[] }).multi_select.map((o) => o.name) : []);
const checkbox = (p?: Prop) => (p?.type === "checkbox" ? Boolean((p as { checkbox: boolean }).checkbox) : false);
const date = (p?: Prop) => (p?.type === "date" ? ((p as { date: { start: string } | null }).date?.start?.slice(0, 10) ?? "") : "");
const num = (p?: Prop) => (p?.type === "number" ? ((p as { number: number | null }).number ?? 0) : 0);
const relation = (p?: Prop) => (p?.type === "relation" ? (p as { relation: { id: string }[] }).relation.map((r) => r.id) : []);

const lines = (s: string) =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/** "Label: text" → { a: "Label", b: "text" } splitting on the first separator. */
function pairs(s: string, sep: string) {
  return lines(s).map((l) => {
    const i = l.indexOf(sep);
    return i === -1 ? { a: "", b: l } : { a: l.slice(0, i).trim(), b: l.slice(i + sep.length).trim() };
  });
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/* ------------------------------------------------------------------
   Blocks → our Block[]
------------------------------------------------------------------- */
function richOf(b: NotionBlock): string {
  const inner = b[b.type] as { rich_text?: RichText[] } | undefined;
  return plain(inner?.rich_text).trim();
}

const CIPHER_HEADING = /^◇?\s*the cipher\b/i;
// A marker object used only while converting; never rendered.
const DIVIDER: Block = { t: "p", text: "" };

export function convertBlocks(raw: NotionBlock[]): { body: Block[]; cipher: Block[] } {
  const body: Block[] = [];
  const cipher: Block[] = [];
  let target = body;
  let list: { kind: string; items: string[] } | null = null;

  const flush = () => {
    if (list) target.push({ t: "list", items: list.items });
    list = null;
  };

  for (const b of raw) {
    const t = richOf(b);
    const isHeading = b.type === "heading_1" || b.type === "heading_2" || b.type === "heading_3";

    if (isHeading && target === body && CIPHER_HEADING.test(t)) {
      flush();
      // Drop a divider that only separated the two readings.
      while (body.length && body[body.length - 1] === DIVIDER) body.pop();
      target = cipher;
      continue;
    }

    if (b.type === "bulleted_list_item" || b.type === "numbered_list_item") {
      if (list && list.kind !== b.type) flush();
      list ??= { kind: b.type, items: [] };
      if (t) list.items.push(t);
      continue;
    }
    flush();

    switch (b.type) {
      case "paragraph": {
        if (!t) break;
        const i = t.indexOf(" ◇ ");
        if (i !== -1 && target === body) target.push({ t: "p", text: t.slice(0, i).trim(), note: t.slice(i + 3).trim() });
        else target.push({ t: "p", text: t });
        break;
      }
      case "heading_1":
      case "heading_2":
      case "heading_3":
        if (t) target.push({ t: "h", text: t });
        break;
      case "quote":
        if (t) target.push({ t: "quote", text: t });
        break;
      case "code":
        if (t) target.push({ t: "code", text: t });
        break;
      case "callout": {
        const icon = (b.callout as { icon?: { type: string; emoji?: string } } | undefined)?.icon;
        if (icon?.type === "emoji" && icon.emoji === "⬛") target.push({ t: "redacted", text: t });
        else if (t) target.push({ t: "p", text: t });
        break;
      }
      case "toggle":
        if (t) target.push({ t: "p", text: t });
        break;
      case "divider":
        target.push(DIVIDER);
        break;
      default:
        // images, embeds, tables etc. are not supported yet: skipped quietly
        break;
    }
  }
  flush();
  return { body: body.filter((x) => x !== DIVIDER), cipher: cipher.filter((x) => x !== DIVIDER) };
}
/* ------------------------------------------------------------------
   Pages → our types
------------------------------------------------------------------- */
const ROOMS: RoomSlug[] = ["work", "lab", "failures", "writing", "films"];
const TYPES: EntryType[] = ["project", "experiment", "postmortem", "essay", "film", "paper", "life-event"];
const STATUSES: Status[] = ["seed", "growing", "finished", "abandoned", "running", "concluded", "production"];

export function mapEntry(page: NotionPage, blocks: NotionBlock[], catalogOf: (id: string) => string | undefined): Entry | null {
  const p = page.properties;
  const title = text(p["Title"]);
  const room = select(p["Room"]) as RoomSlug;
  const catalog = text(p["Catalog"]);
  if (!title || !catalog || !ROOMS.includes(room)) return null; // not enough to publish

  const type = (TYPES.includes(select(p["Type"]) as EntryType) ? select(p["Type"]) : room === "films" ? "film" : "essay") as EntryType;
  const status = (STATUSES.includes(select(p["Status"]) as Status) ? select(p["Status"]) : "seed") as Status;
  const { body, cipher } = convertBlocks(blocks);
  const ids = (name: string) => relation(p[name]).map(catalogOf).filter((c): c is string => Boolean(c));

  const e: Entry = {
    catalog,
    slug: text(p["Slug"]) || slugify(title),
    room,
    type,
    title,
    summary: text(p["Summary"]),
    date: date(p["Date"]) || new Date().toISOString().slice(0, 10),
    status,
    tags: multi(p["Tags"]),
    body,
    cipher,
  };
  const updated = date(p["Updated"]);
  if (updated) e.updated = updated;
  if (text(p["Hypothesis"])) e.hypothesis = text(p["Hypothesis"]);
  if (text(p["Result"])) e.result = text(p["Result"]);
  if (text(p["TL;DR"])) e.tldr = text(p["TL;DR"]);
  if (text(p["Log"])) e.log = pairs(text(p["Log"]), "|").map(({ a, b }) => ({ date: a, text: b }));
  if (text(p["Spec"])) e.spec = pairs(text(p["Spec"]), ":").map(({ a, b }) => ({ k: a, v: b }));
  if (text(p["Margin"])) e.margin = pairs(text(p["Margin"]), ":").map(({ a, b }) => ({ label: a || "Note", text: b }));
  if (text(p["Links"])) e.links = pairs(text(p["Links"]), "|").map(({ a, b }) => ({ label: a || b, href: b }));
  const related = ids("Related");
  if (related.length) e.related = related;
  const documents = ids("Documents");
  if (documents.length) e.documents = documents;
  const film = ids("Film")[0];
  if (film) e.film = film;

  if (type === "film") {
    const chapters = lines(text(p["Chapters"])).map((l) => {
      const [t, ...rest] = l.split(/\s+/);
      return { t, label: rest.join(" ") };
    });
    e.video = {
      youtubeId: text(p["YouTube ID"]) || undefined,
      duration: text(p["Duration"]) || undefined,
      chapters: chapters.length ? chapters : undefined,
      madeWith: text(p["Made with"]) || undefined,
    };
  }
  return e;
}

/* ------------------------------------------------------------------
   Public loaders
------------------------------------------------------------------- */
export async function fetchEntries(): Promise<Entry[]> {
  const pages = await queryAll(NOTION_DATABASES.entries, {
    filter: { property: "Published", checkbox: { equals: true } },
  });
  const catalogById = new Map(pages.map((pg) => [pg.id.replace(/-/g, ""), text(pg.properties["Catalog"])]));
  const catalogOf = (id: string) => catalogById.get(id.replace(/-/g, "")) || undefined;
  const out: Entry[] = [];
  for (const pg of pages) {
    const e = mapEntry(pg, await blocksOf(pg.id), catalogOf);
    if (e) out.push(e);
  }
  return out;
}

export type NowData = {
  updated: string;
  items: { label: string; text: string }[];
  cipher: string[];
  previous: { season: string; date: string; items: string[] }[];
};

export async function fetchNow(): Promise<NowData> {
  const rows = await queryAll(NOTION_DATABASES.now);
  const current = rows.filter((r) => checkbox(r.properties["Current"])).sort((a, b) => num(a.properties["Order"]) - num(b.properties["Order"]));
  const past = rows.filter((r) => !checkbox(r.properties["Current"]));
  const seasons = new Map<string, { date: string; items: string[] }>();
  for (const r of past) {
    const s = text(r.properties["Season"]) || "Earlier";
    const d = date(r.properties["Updated"]);
    const cur = seasons.get(s) ?? { date: d, items: [] };
    cur.items.push(text(r.properties["Text"]));
    if (d > cur.date) cur.date = d;
    seasons.set(s, cur);
  }
  return {
    updated: current.map((r) => date(r.properties["Updated"])).sort().pop() || new Date().toISOString().slice(0, 10),
    items: current.map((r) => ({ label: text(r.properties["Label"]), text: text(r.properties["Text"]) })),
    cipher: current.map((r) => text(r.properties["Cipher"]) || text(r.properties["Text"]).toLowerCase()),
    previous: [...seasons.entries()].map(([season, v]) => ({ season, ...v })).sort((a, b) => (a.date < b.date ? 1 : -1)),
  };
}

export type Chapter = { n: string; title: string; text?: string; href?: string };

export async function fetchStory(): Promise<Chapter[]> {
  const rows = await queryAll(NOTION_DATABASES.story);
  return rows
    .sort((a, b) => num(a.properties["Order"]) - num(b.properties["Order"]))
    .map((r) => ({
      n: text(r.properties["Chapter"]),
      title: text(r.properties["Title"]),
      text: text(r.properties["Text"]) || undefined,
      href: text(r.properties["Link"]) || undefined,
    }));
}
