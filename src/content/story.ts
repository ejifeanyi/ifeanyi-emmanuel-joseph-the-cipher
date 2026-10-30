import type { Chapter } from "@/lib/notion";

// Local fallback for the Story page. With Notion connected, chapters come
// from the Story database instead.
export const chapters: Chapter[] = [
  { n: "CH. 01", title: "Where it begins" },
  { n: "CH. 02", title: "Chapter two" },
  { n: "CH. 03", title: "Chapter three" },
  { n: "NOW", title: "The chapter being lived", text: "The present tense lives on the Now page.", href: "/now" },
];
