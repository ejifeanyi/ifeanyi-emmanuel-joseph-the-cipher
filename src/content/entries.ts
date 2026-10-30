import type { Entry } from "@/lib/types";

// The archive. Newest first is handled in src/lib/content.ts, so order here
// doesn't matter. These two are drafts written from the build of this site:
// rewrite them in your own words.

export const entries: Entry[] = [
  {
    catalog: "IEJ-0003",
    slug: "learning-to-make-films",
    room: "lab",
    type: "experiment",
    title: "Learning to make documentary films",
    summary:
      "I’m learning filmmaking so I can document my life, what I’m learning and what I’m building. Every film’s mistakes get logged here.",
    date: "2026-10-30",
    status: "running",
    tags: ["filmmaking", "documentary", "learning-in-public"],
    hypothesis:
      "If I film the work as it happens, the archive will feel alive, and I’ll learn to tell stories, not just build things.",
    log: [
      { date: "30 Oct", text: "Decided to learn filmmaking. Opened a Films room on this site before making a single film." },
    ],
    result: "Pending. Measured film by film.",
    body: [
      {
        t: "p",
        text: "I want to make documentary-style films about my life, the things I’m learning and the things I’m building. I don’t know how yet. That’s what this entry is for.",
      },
      { t: "h", text: "The plan" },
      {
        t: "list",
        items: [
          "Learn the basics: shooting, sound, light, editing",
          "Make short films first, then longer ones",
          "Pair every film with the entry it documents, so you can watch it and then read how it was made",
          "Log what went wrong in each film, here",
        ],
      },
      {
        t: "p",
        text: "The early films will be rough. They stay up anyway. The point of an archive of becoming is that you can see the distance.",
      },
    ],
    cipher: [
      { t: "h", text: "status: running" },
      { t: "p", text: "new skill. zero films. one empty room waiting for them." },
      { t: "list", items: ["+ room: /films is open", "- footage: none yet", "? first film: in production"] },
      { t: "p", text: "> the light side gets the finished film. this side gets the takes that didn't make it." },
    ],
    margin: [{ label: "Gear", text: "To be decided. Starting with what I already have." }],
    related: ["IEJ-0002"],
  },
  {
    catalog: "IEJ-0001",
    slug: "why-an-archive-of-becoming",
    room: "writing",
    type: "essay",
    title: "Why I am building an archive of becoming",
    summary:
      "Most personal sites are a shop window. I wanted a place that keeps everything: the work, the experiments, the failures, and the slow business of getting better.",
    date: "2026-10-29",
    status: "seed",
    tags: ["this-site", "building-in-public"],
    body: [
      {
        t: "p",
        text: "Most personal websites are a shop window. A home page, a few projects, an about page, a contact form. They show the finished work and hide everything that made it.",
      },
      {
        t: "p",
        text: "I wanted the opposite. A place that keeps the experiments that went nowhere, the projects that broke, the notes I wrote at 2am, and the things I am still figuring out. An archive, not a portfolio.",
        note: "he means it. the failures room is real.",
      },
      { t: "h", text: "Starting empty, on purpose" },
      {
        t: "p",
        text: "Today most rooms here say “not yet written.” That is the point. The site starts on the day I started building it, and it grows as I do. If you come back in a year, you should be able to see the distance.",
      },
      {
        t: "quote",
        text: "Rooms open before they are full.",
      },
      { t: "h", text: "Two readings" },
      {
        t: "p",
        text: "There are two ways to read this place. This one, in my name, is the considered version. The other belongs to The Cipher: terser, rawer, closer to how I actually think while I’m working. Same rooms, different voice.",
      },
      {
        t: "p",
        text: "Some things are hidden. Not because they are secret, but because the people who go looking for them are usually the people I most want to meet.",
      },
    ],
    cipher: [
      { t: "h", text: "the short version" },
      { t: "list", items: ["most sites = shop windows", "this one = the whole workshop", "starts empty. grows."] },
      { t: "h", text: "raw notes" },
      {
        t: "p",
        text: "rooms, not pages. entries, not posts. every entry gets a catalog number so nothing gets lost.",
      },
      {
        t: "p",
        text: "the light side is careful. this side is the notebook. read whichever one you trust more.",
      },
      { t: "redacted", text: "there are more rooms than the menu shows." },
    ],
    margin: [
      {
        label: "Margin note",
        text: "Written on the day the first line of code went in. Expect it to be tended, rewritten, and argued with.",
      },
    ],
    related: ["IEJ-0002"],
  },
  {
    catalog: "IEJ-0002",
    slug: "two-readings",
    room: "lab",
    type: "experiment",
    title: "Designing a site with two readings",
    summary:
      "One site, two voices: Ifeanyi in the light, The Cipher in the dark. Does a second reading make people stay, explore and remember?",
    date: "2026-10-29",
    updated: "2026-10-30",
    status: "running",
    tags: ["this-site", "design", "nextjs"],
    hypothesis:
      "If the same site can be read two ways, the people who find the second reading will explore further and remember it longer.",
    log: [
      { date: "29 Oct", text: "Mapped the site as rooms instead of pages. Wireframed every screen in black and white." },
      { date: "29 Oct", text: "Chose paper, ink and camwood. The Cipher keeps the same red, glowing in the dark." },
      { date: "29 Oct", text: "Designed five ways things hide: redacted lines, ciphered words, Cipher notes, glyph clues, secret commands." },
      { date: "30 Oct", text: "Started building in Next.js and Tailwind. First rooms open." },
    ],
    result:
      "Pending. This experiment concludes once real people have used the site for a while.",
    body: [
      {
        t: "p",
        text: "The question behind this site: can a personal website be something you explore, not just something you scan?",
      },
      { t: "h", text: "The setup" },
      {
        t: "p",
        text: "Every page has two readings. Switching between them decodes the page: text scrambles and resolves into the other voice. The colours are shared, paper and ink with one camwood red, so both readings feel like the same world.",
      },
      {
        t: "p",
        text: "Layered on top is a small secret layer. Nothing a visitor needs is ever hidden. But curious people find things, and a keyring remembers what they’ve found.",
      },
      { t: "h", text: "What I’m watching" },
      {
        t: "list",
        items: [
          "How many visitors switch readings at all",
          "Whether people who find a secret go on to read more",
          "Whether the hidden layer gets in anyone’s way",
        ],
      },
    ],
    cipher: [
      { t: "h", text: "status: running" },
      { t: "p", text: "one site. two readings. the toggle is the whole trick." },
      {
        t: "list",
        items: [
          "+ built: rooms, entries, keyring, ⌘k",
          "+ colours: paper / ink / camwood",
          "- broke: nothing yet. give it time.",
        ],
      },
      { t: "p", text: "> lesson so far: restraint. one or two secrets a page. no more." },
      { t: "code", text: "[29.10 02:14] it works. do not touch it.\n[29.10 02:31] touched it.\n[29.10 03:02] fixed. going to sleep." },
    ],
    margin: [
      { label: "Tools", text: "Figma, Next.js, Tailwind, Notion, Cloudflare." },
    ],
    related: ["IEJ-0001"],
  },
];
