import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getEntriesByRoom, readingMinutes } from "@/lib/content";
import { entryHref, formatDate, statusLabel, typeLabel } from "@/lib/labels";
import type { Entry, RoomSlug } from "@/lib/types";
import { PageIntro } from "@/components/content";
import { EmptyState, Label, StatusChip, ButtonLink } from "@/components/ui";
import { KeyFragment } from "@/components/cipher";
import { Dual } from "@/components/Dual";
import { FilmPlayer } from "@/components/FilmPlayer";

const ROOM_META: Record<
  RoomSlug,
  { code: string; title: string; cipher: string; sub: string; cipherSub: string; empty: string; emptyBody: string }
> = {
  work: {
    code: "R-03 · Work",
    title: "Things I built.",
    cipher: "ls /work",
    sub: "Projects drawn like blueprints: what it was, what I did, and what happened after.",
    cipherSub: "the builds. specs, scars, outcomes.",
    empty: "The first blueprint is being drawn.",
    emptyBody: "Client work comes here once it can be shown. Until then, the Lab has what I’m building right now.",
  },
  lab: {
    code: "R-04 · Lab",
    title: "The lab notebook.",
    cipher: "cat /lab/notebook",
    sub: "Experiments and raw notes, published before they are polished. Expect loose ends.",
    cipherSub: "unpolished on purpose. hypotheses, logs, results.",
    empty: "The notebook is open.",
    emptyBody: "The first experiment is on its way.",
  },
  failures: {
    code: "R-05 · Failures",
    title: "What broke, and what it taught me.",
    cipher: "ls /failures",
    sub: "Postmortems, written honestly. Nothing here is hidden or deleted.",
    cipherSub: "postmortems. nothing deleted.",
    empty: "The first postmortem will live here.",
    emptyBody: "Rooms open before they are full. Something will break soon enough.",
  },
  writing: {
    code: "R-06 · Writing",
    title: "Essays and notes.",
    cipher: "ls /writing",
    sub: "Long-form thinking. Some pieces are finished; some are still growing.",
    cipherSub: "long-form. some finished, most still growing.",
    empty: "The first essay is drafting.",
    emptyBody: "Check back soon.",
  },
  films: {
    code: "R-07 · Films",
    title: "Films.",
    cipher: "ls /films",
    sub: "Documentary films of the work and the life. Each one is paired with the notes it came from, so you can watch it, then read how it was made.",
    cipherSub: "films first. notes underneath. the takes that didn't make it, on the other side.",
    empty: "The first film is in production.",
    emptyBody: "I’m learning to make films, in public. Every film’s mistakes get logged in the Lab.",
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return (Object.keys(ROOM_META) as RoomSlug[]).map((room) => ({ room }));
}

export async function generateMetadata({ params }: { params: Promise<{ room: string }> }): Promise<Metadata> {
  const { room } = await params;
  const m = ROOM_META[room as RoomSlug];
  return m ? { title: m.code.split(" · ")[1], description: m.sub } : {};
}

export default async function RoomPage({ params }: { params: Promise<{ room: string }> }) {
  const { room } = await params;
  const meta = ROOM_META[room as RoomSlug];
  if (!meta) notFound();
  const list = await getEntriesByRoom(room as RoomSlug);

  return (
    <>
      <PageIntro code={meta.code} title={meta.title} cipherTitle={meta.cipher} sub={meta.sub} cipherSub={meta.cipherSub} />
      <div className="wrap relative">
        {room === "lab" && (
          // Key fragment 1 of 3, hiding in the margin of the lab notebook.
          <KeyFragment id="frag-1" className="absolute -top-6 right-5 md:right-10 xl:right-20" />
        )}
        {list.length === 0 ? (
          <EmptyState title={meta.empty} label={room === "films" ? "In production" : undefined}>
            <p>{meta.emptyBody}</p>
            <div className="mt-6 flex justify-center">
              {room === "films" ? (
                <ButtonLink href="/lab/learning-to-make-films" variant="quiet">
                  Read the filmmaking log →
                </ButtonLink>
              ) : (
                <ButtonLink href="/lab" variant="quiet">
                  Visit the Lab
                </ButtonLink>
              )}
            </div>
          </EmptyState>
        ) : room === "films" ? (
          <FilmGrid list={list} />
        ) : room === "work" ? (
          <WorkGrid list={list} />
        ) : room === "lab" ? (
          <LabList list={list} />
        ) : room === "failures" ? (
          <FailureList list={list} />
        ) : (
          <WritingList list={list} />
        )}
      </div>
    </>
  );
}

function WorkGrid({ list }: { list: Entry[] }) {
  return (
    <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
      {list.map((e) => (
        <Link key={e.catalog} href={entryHref(e)} className="group flex flex-col gap-3">
          <div className="flex aspect-[2/1] items-center justify-center rounded-xl bg-surface t-label text-ink-3">blueprint</div>
          <div className="flex items-center justify-between">
            <span className="t-label text-ink-3">{e.catalog}</span>
            <StatusChip status={e.status} />
          </div>
          <h2 className="t-h2 group-hover:text-camwood">{e.title}</h2>
          <p className="text-ink-2">{e.summary}</p>
          <p className="t-label text-ink-3">{e.tags.join(" · ")}</p>
        </Link>
      ))}
    </div>
  );
}

function FilmGrid({ list }: { list: Entry[] }) {
  const [first, ...rest] = list;
  return (
    <div className="flex flex-col gap-16">
      <Link href={entryHref(first)} className="group grid items-center gap-8 rounded-xl bg-surface p-5 md:p-8 lg:grid-cols-[1.4fr_1fr]">
        <FilmPlayer youtubeId={first.video?.youtubeId} title={first.title} />
        <div className="flex flex-col gap-4">
          <span className="t-label text-camwood">
            {first.catalog} · {first.status === "production" ? "In production" : first.video?.duration ?? "Film"}
          </span>
          <h2 className="t-h2 group-hover:text-camwood">{first.title}</h2>
          <p className="text-ink-2">{first.summary}</p>
          {first.documents && <p className="t-label text-ink-3">Documents: {first.documents.join(", ")}</p>}
        </div>
      </Link>
      {rest.length > 0 && (
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((e) => (
            <Link key={e.catalog} href={entryHref(e)} className="group flex flex-col gap-3">
              <FilmPlayer youtubeId={e.video?.youtubeId} title={e.title} small />
              <div className="flex justify-between">
                <span className="t-label text-ink-3">{e.catalog}</span>
                <span className="t-label text-ink-2">{e.video?.duration}</span>
              </div>
              <h3 className="t-h3 group-hover:text-camwood">{e.title}</h3>
              {e.documents && <p className="text-[13px] text-ink-2">Notes: {e.documents.join(", ")}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function LabList({ list }: { list: Entry[] }) {
  return (
    <div className="grid gap-16 lg:grid-cols-[1fr_300px]">
      <div className="border-b border-rule">
        {list.map((e) => (
          <Link key={e.catalog} href={entryHref(e)} className="group flex flex-col gap-3 border-t border-rule py-8">
            <div className="flex items-center gap-3">
              <span className="t-label text-ink-3">{formatDate(e.date)}</span>
              <StatusChip status={e.status} />
            </div>
            <h2 className="t-h2 group-hover:text-camwood">{e.title}</h2>
            {e.hypothesis && (
              <p className="t-body italic text-ink-2">
                <Dual i={`Hypothesis: ${e.hypothesis}`} c={`> if: ${e.hypothesis.toLowerCase()}`} decode={false} />
              </p>
            )}
          </Link>
        ))}
      </div>
      <aside className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Label>Currently running</Label>
          {list
            .filter((e) => e.status === "running")
            .map((e) => (
              <Link key={e.catalog} href={entryHref(e)} className="text-[14px] hover:text-camwood">
                {e.catalog} · {e.title}
              </Link>
            ))}
        </div>
        <div className="flex flex-col gap-1 text-[14px] text-ink-2">
          <Label>Status key</Label>
          <p>Running: still going</p>
          <p>Concluded: got a result</p>
          <p>Abandoned: stopped, with notes</p>
        </div>
      </aside>
    </div>
  );
}

function FailureList({ list }: { list: Entry[] }) {
  return (
    <div className="border-b border-rule">
      {list.map((e) => (
        <Link key={e.catalog} href={entryHref(e)} className="group grid gap-4 border-t border-rule py-8 md:grid-cols-[160px_1fr_auto]">
          <span className="t-label text-ink-3">{e.catalog}</span>
          <div className="flex flex-col gap-2">
            <h2 className="t-h2 group-hover:text-camwood">{e.title}</h2>
            {e.tldr && <p className="text-ink-2">{e.tldr}</p>}
          </div>
          <span className="t-label text-ink">Read →</span>
        </Link>
      ))}
    </div>
  );
}

function WritingList({ list }: { list: Entry[] }) {
  return (
    <div className="border-b border-rule">
      {list.map((e) => (
        <Link key={e.catalog} href={entryHref(e)} className="group flex flex-col gap-2 border-t border-rule py-8">
          <h2 className="t-h2 group-hover:text-camwood">{e.title}</h2>
          <p className="max-w-3xl text-ink-2">{e.summary}</p>
          <p className="t-label text-ink-3">
            {formatDate(e.date)} · {readingMinutes(e.body)} min · {typeLabel[e.type]} · {statusLabel[e.status]}
          </p>
        </Link>
      ))}
    </div>
  );
}
