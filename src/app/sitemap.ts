import type { MetadataRoute } from "next";
import { getEntries } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/rooms", "/now", "/story", "/work", "/lab", "/failures", "/writing", "/films", "/archive", "/work-with-me"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}` })),
    ...(await getEntries()).map((e) => ({ url: `${site.url}/${e.room}/${e.slug}`, lastModified: e.updated ?? e.date })),
  ];
}
