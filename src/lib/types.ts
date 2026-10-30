// The content model. Every piece of the archive is an Entry.
// Today entries live in src/content/entries.ts; later they come from Notion,
// mapped into exactly these shapes, so pages and components never change.

export type RoomSlug = "work" | "lab" | "failures" | "writing" | "films";

export type EntryType =
  | "project"
  | "experiment"
  | "postmortem"
  | "essay"
  | "film"
  | "paper"
  | "life-event";

export type Status =
  | "seed"
  | "growing"
  | "finished"
  | "abandoned"
  | "running"
  | "concluded"
  | "production"; // films still being made

/** A block of body text. Kept deliberately small so Notion blocks map onto it. */
export type Block =
  | { t: "p"; text: string; note?: string } // `note`: a Cipher note (◇) at the end of the paragraph
  | { t: "h"; text: string }
  | { t: "quote"; text: string }
  | { t: "list"; items: string[] }
  | { t: "code"; text: string }
  | { t: "redacted"; text: string; id?: string }; // decodes on click

export type Entry = {
  catalog: string; // IEJ-0001
  slug: string;
  room: RoomSlug;
  type: EntryType;
  title: string;
  summary: string;
  date: string; // ISO yyyy-mm-dd
  updated?: string;
  status: Status;
  tags: string[];
  body: Block[];
  /** The Cipher's reading of the same entry: terse, raw notes. */
  cipher: Block[];
  margin?: { label: string; text: string }[];
  spec?: { k: string; v: string }[]; // projects
  hypothesis?: string; // experiments
  log?: { date: string; text: string }[]; // experiments
  result?: string; // experiments
  tldr?: string; // postmortems
  links?: { label: string; href: string }[];
  related?: string[]; // catalog numbers

  /** Films only. */
  video?: {
    youtubeId?: string; // leave empty while the film is in production
    duration?: string; // "12:40"
    chapters?: { t: string; label: string }[];
    madeWith?: string;
  };
  /** Films: the entries this film documents (catalog numbers). */
  documents?: string[];
  /** Any entry: the film that documents it (catalog number). */
  film?: string;
};

export type Room = {
  code: string; // R-01
  slug: string; // url path segment
  name: string;
  cipherPath: string;
  description: string;
  cipherDescription: string;
  /** Short honest status shown on the tile, e.g. "Not yet written". */
  status: string;
  live: boolean; // camwood dot when something is happening
  open: boolean; // false = "opening later"
};
