import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntries, getEntry, readingMinutes } from "@/lib/content";
import { entryHref, formatDate, formatDateCipher, typeLabel } from "@/lib/labels";
import { Blocks, SideBlock } from "@/components/content";
import { Chip, Label, StatusChip, buttonClass } from "@/components/ui";
import { FilmPlayer } from "@/components/FilmPlayer";
import { Dual, OnlyIn } from "@/components/Dual";
import { ReadingSwitch } from "@/components/cipher";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getEntries()).map((e) => ({ room: e.room, slug: e.slug }));
}

type Params = { params: Promise<{ room: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { room, slug } = await params;
  const e = await getEntry(room, slug);
  return e ? { title: e.title, description: e.summary } : {};
}

export default async function EntryPage({ params }: Params) {
  const { room, slug } = await params;
  const e = await getEntry(room, slug);
  if (!e) notFound();

  const all = await getEntries();
  const idx = all.findIndex((x) => x.catalog === e.catalog);
  const newer = idx > 0 ? all[idx - 1] : undefined;
  const older = idx < all.length - 1 ? all[idx + 1] : undefined;
  const byCatalog = (c: string) => all.find((x) => x.catalog === c);
  const related = (e.related ?? []).map(byCatalog).filter(Boolean);
  const documented = (e.documents ?? []).map(byCatalog).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const film = e.film ? byCatalog(e.film) : undefined;

  return (
    <article>
      {/* Head */}
      <header className="wrap pt-14 pb-10 md:pt-20 md:pb-14">
        <Label>
          <Link href={`/${e.room}`} className="hover:text-camwood">
            {e.room}
          </Link>{" "}
          / {e.catalog}
        </Label>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Chip>{typeLabel[e.type]}</Chip>
          <StatusChip status={e.status} />
          <Chip>
            <Dual i={formatDate(e.date)} c={formatDateCipher(e.date)} decode={false} />
          </Chip>
          <Chip>{e.type === "film" ? e.video?.duration ?? "Film" : `${readingMinutes(e.body)} min read`}</Chip>
        </div>
        <h1 className="t-h1 mt-6 max-w-4xl">
          <Dual i={e.title} c={`${e.catalog.toLowerCase()} :: ${e.title.toLowerCase()}`} />
        </h1>
        <p className="t-body mt-5 max-w-2xl text-ink-2">{e.summary}</p>
      </header>

      {e.type === "film" && (
        <div className="wrap pb-12">
          <FilmPlayer youtubeId={e.video?.youtubeId} title={e.title} />
        </div>
      )}

      <div className="wrap grid gap-14 pb-8 lg:grid-cols-[1fr_300px] lg:gap-20">
        <div className="flex min-w-0 max-w-[760px] flex-col gap-10">
          {e.hypothesis && (
            <div className="rounded-md border border-ink p-6 md:p-7">
              <Label>Hypothesis</Label>
              <p className="t-h3 mt-3 font-display italic">{e.hypothesis}</p>
            </div>
          )}
          {e.tldr && (
            <div className="rounded-xl bg-surface p-6 md:p-7">
              <Label>TL;DR</Label>
              <p className="mt-3 text-[17px] leading-relaxed">{e.tldr}</p>
            </div>
          )}
          {e.spec && (
            <div className="rounded-md border border-ink p-6">
              <Label>Spec sheet</Label>
              <dl className="mt-3">
                {e.spec.map((s) => (
                  <div key={s.k} className="grid grid-cols-[120px_1fr] gap-4 border-t border-rule py-3">
                    <dt className="t-label text-ink-2">{s.k}</dt>
                    <dd className="text-[15px]">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <OnlyIn mode="ifeanyi">
            <Blocks blocks={e.body} />
          </OnlyIn>
          <OnlyIn mode="cipher">
            <p className="mb-6 font-mono text-[12px] text-ink-3">~/{e.room}/{e.catalog.toLowerCase()}.md · the cipher’s reading</p>
            <Blocks blocks={e.cipher} cipher />
          </OnlyIn>

          {e.log && (
            <section>
              <h2 className="t-h2 mb-4">Log</h2>
              <ol>
                {e.log.map((l, i) => (
                  <li key={i} className="grid grid-cols-[72px_1fr] gap-4 border-t border-rule py-3 text-[15px]">
                    <span className="t-label pt-0.5 text-ink">{l.date}</span>
                    <span>{l.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {e.video?.chapters && e.video.chapters.length > 0 && (
            <section>
              <h2 className="t-h2 mb-4">Chapters</h2>
              <ol>
                {e.video.chapters.map((c) => (
                  <li key={c.t} className="grid grid-cols-[72px_1fr] gap-4 border-t border-rule py-3 text-[15px]">
                    <span className="t-label pt-0.5 text-ink">{c.t}</span>
                    <span>{c.label}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {documented.map((d) => (
            <Link
              key={d.catalog}
              href={entryHref(d)}
              className="group flex flex-col justify-between gap-4 rounded-xl bg-surface p-6 sm:flex-row sm:items-center md:p-7"
            >
              <span className="flex flex-col gap-1.5">
                <Label>The notes behind this film</Label>
                <span className="t-h3 group-hover:text-camwood">
                  {d.catalog} · {d.title}
                </span>
              </span>
              <span className={`${buttonClass("primary")} shrink-0 whitespace-nowrap`}>Read the notes →</span>
            </Link>
          ))}
          {film && (
            <Link
              href={entryHref(film)}
              className="group flex flex-col justify-between gap-4 rounded-xl bg-surface p-6 sm:flex-row sm:items-center md:p-7"
            >
              <span className="flex flex-col gap-1.5">
                <Label>There’s a film of this</Label>
                <span className="t-h3 group-hover:text-camwood">
                  {film.catalog} · {film.title}
                </span>
              </span>
              <span className={`${buttonClass("primary")} shrink-0 whitespace-nowrap`}>Watch the film ▶</span>
            </Link>
          )}
          {e.result && (
            <div className="rounded-xl bg-surface p-6 md:p-7">
              <Label>Result{e.status === "running" ? " · pending" : ""}</Label>
              <p className="mt-3 text-[16px] leading-relaxed">{e.result}</p>
            </div>
          )}

          <ReadingSwitch />
        </div>

        <aside className="flex flex-col gap-8 lg:pt-2">
          {e.margin?.map((m) => (
            <SideBlock key={m.label} label={m.label}>
              {m.text}
            </SideBlock>
          ))}
          {e.links && (
            <SideBlock label="Links">
              <ul className="flex flex-col gap-1">
                {e.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noreferrer" className="link-accent">
                      {l.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </SideBlock>
          )}
          {e.video?.madeWith && <SideBlock label="Made with">{e.video.madeWith}</SideBlock>}
          {e.video?.youtubeId && (
            <SideBlock label="Also on">
              <a href={`https://www.youtube.com/watch?v=${e.video.youtubeId}`} target="_blank" rel="noreferrer" className="link-accent">
                YouTube ↗
              </a>
            </SideBlock>
          )}
          {e.tags.length > 0 && <SideBlock label="Tags">{e.tags.map((t) => `#${t}`).join("  ")}</SideBlock>}
          {related.length > 0 && (
            <SideBlock label="Related">
              <ul className="flex flex-col gap-2">
                {related.map((r) => (
                  <li key={r!.catalog}>
                    <Link href={entryHref(r!)} className="hover:text-camwood">
                      {r!.catalog} · {typeLabel[r!.type]} · {r!.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </SideBlock>
          )}
        </aside>
      </div>

      <nav className="wrap mt-10 flex flex-col justify-between gap-4 border-t border-rule pt-8 text-[15px] text-ink-2 sm:flex-row" aria-label="More entries">
        {older ? (
          <Link href={entryHref(older)} className="hover:text-camwood">
            ← {older.catalog} · {older.title}
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link href={entryHref(newer)} className="hover:text-camwood sm:text-right">
            {newer.catalog} · {newer.title} →
          </Link>
        )}
      </nav>
    </article>
  );
}
