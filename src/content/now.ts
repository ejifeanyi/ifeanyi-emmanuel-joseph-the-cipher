// The Now page. Update this whenever the season changes; move the old
// one into `previous` so nothing is lost.

export const now = {
  updated: "2026-10-30",
  items: [
    { label: "Building", text: "Building this site, in public, one room at a time." },
    { label: "Designing", text: "Designing two readings of one world: mine, and The Cipher’s." },
    { label: "Learning", text: "Learning to make documentary films, starting with this one." },
    { label: "Preparing", text: "Getting ready to move from Lagos to Argentina." },
  ],
  cipher: [
    "building: this site. in public. one room at a time.",
    "designing: two readings. you're in the second one.",
    "learning: film. so you can watch, not just read.",
    "packing: lagos → argentina. soon.",
  ],
  previous: [] as { season: string; date: string; items: string[] }[],
};
