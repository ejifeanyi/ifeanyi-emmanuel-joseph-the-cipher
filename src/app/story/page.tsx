import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/content";
import { UliCrescents } from "@/components/Uli";
import { Dual } from "@/components/Dual";
import { getStory } from "@/lib/content";

export const metadata: Metadata = { title: "Story", description: "A life told in chapters. Some are not yet written." };

export default async function StoryPage() {
  const chapters = await getStory();
  return (
    <>
      <PageIntro
        code="R-01 · Story"
        title="The story so far."
        cipherTitle="cat /story"
        sub="Told in chapters, not a résumé. Some chapters are not yet written."
        cipherSub="chapters, not a résumé. most still encrypted."
      />
      <section className="wrap">
        <UliCrescents className="mb-12 max-w-md" />
        <ol>
          {chapters.map((c) => (
            <li key={c.n} className="grid gap-4 md:grid-cols-[160px_1fr] md:gap-12">
              <div className="t-label pt-2 text-ink">{c.n}</div>
              <div className="border-l border-ink pb-16 pl-8 md:pl-10">
                <h2 className="t-h1">
                  <Dual i={c.title} c={c.text ? c.title.toLowerCase() : "████████ ████"} />
                </h2>
                {c.text ? (
                  <p className="t-body mt-4 max-w-2xl text-ink-2">
                    {c.text}{" "}
                    {c.href && (
                      <Link href={c.href} className="link-accent">
                        Read it →
                      </Link>
                    )}
                  </p>
                ) : (
                  <p className="t-label mt-4 text-ink-3">
                    <Dual i="Not yet written" c="encrypted. not yet." />
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
