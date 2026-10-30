import Link from "next/link";
import { Fragment } from "react";
import type { Block, Entry, Room } from "@/lib/types";
import { entryHref, formatDate, formatDateCipher, typeLabel } from "@/lib/labels";
import { Dual } from "@/components/Dual";
import { Label, LiveDot, StatusChip } from "@/components/ui";
import { CipherNote, Redacted } from "@/components/cipher";

/** Big page intro used at the top of every room. */
export function PageIntro({
  code,
  title,
  cipherTitle,
  sub,
  cipherSub,
}: {
  code: string;
  title: string;
  cipherTitle?: string;
  sub?: string;
  cipherSub?: string;
}) {
  return (
    <section className="wrap pt-16 pb-10 md:pt-24 md:pb-14">
      <Label>{code}</Label>
      <h1 className="t-h1 mt-4 max-w-4xl">
        <Dual i={title} c={`> ${cipherTitle ?? title.toLowerCase()}_`} />
      </h1>
      {sub && (
        <p className="t-body mt-5 max-w-2xl text-ink-2">
          <Dual i={sub} c={cipherSub ?? sub.toLowerCase()} decode={false} />
        </p>
      )}
    </section>
  );
}

/** One line in a list of entries. */
export function EntryRow({ e }: { e: Pick<Entry, "catalog" | "type" | "title" | "status" | "date" | "room" | "slug"> }) {
  return (
    <Link
      href={entryHref(e)}
      className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 border-t border-rule py-5 md:grid-cols-[100px_110px_1fr_auto_120px]"
    >
      <span className="t-label hidden text-ink-3 md:block">{e.catalog}</span>
      <span className="t-label hidden text-ink-2 md:block">{typeLabel[e.type]}</span>
      <span className="t-h3 col-span-2 group-hover:text-camwood md:col-span-1">{e.title}</span>
      <span className="flex items-center gap-3 md:contents">
        <span className="t-label text-ink-3 md:hidden">
          {e.catalog} · {typeLabel[e.type]}
        </span>
        <StatusChip status={e.status} />
      </span>
      <span className="t-label text-right text-ink-3">
        <Dual i={formatDate(e.date)} c={formatDateCipher(e.date)} decode={false} />
      </span>
    </Link>
  );
}

export function RoomTile({ r }: { r: Room }) {
  return (
    <Link
      href={`/${r.slug}`}
      className="group flex flex-col gap-2 rounded-xl border border-rule p-4 transition-colors hover:border-ink sm:p-6"
    >
      <span className="t-label text-ink-3">{r.code}</span>
      <span className="t-h2 group-hover:text-camwood">{r.name}</span>
      <span className="text-[13px] text-ink-2">{r.description}</span>
      <span className="mt-auto pt-3 sm:pt-4">
        <LiveDot live={r.live}>{r.status}</LiveDot>
      </span>
    </Link>
  );
}

/** Renders entry body blocks. */
export function Blocks({ blocks, cipher = false }: { blocks: Block[]; cipher?: boolean }) {
  return (
    <div className={`prose-entry ${cipher ? "font-mono text-[15px] leading-[1.75]" : "t-body"} text-ink`}>
      {blocks.map((b, i) => (
        <Fragment key={i}>{renderBlock(b, cipher)}</Fragment>
      ))}
    </div>
  );
}

function renderBlock(b: Block, cipher: boolean) {
  switch (b.t) {
    case "p": {
      if (!b.note) return <p>{b.text}</p>;
      // Keep the last word and the ◇ together so the mark never wraps alone.
      const cut = b.text.lastIndexOf(" ");
      return (
        <p>
          {b.text.slice(0, cut + 1)}
          <span className="whitespace-nowrap">
            {b.text.slice(cut + 1)}
            <CipherNote text={b.note} />
          </span>
        </p>
      );
    }
    case "h":
      return <h2 className={cipher ? "font-mono text-[15px] text-camwood" : "t-h2"}>{cipher ? `## ${b.text}` : b.text}</h2>;
    case "quote":
      return (
        <blockquote className={cipher ? "border-l-2 border-camwood pl-4" : "t-h2 italic"}>
          {cipher ? `> ${b.text}` : `“${b.text}”`}
        </blockquote>
      );
    case "list":
      return (
        <ul className={cipher ? "space-y-1" : "list-disc space-y-2 pl-6 marker:text-camwood"}>
          {b.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-lg bg-surface p-5 font-mono text-[13px] leading-relaxed text-ink-2">{b.text}</pre>
      );
    case "redacted":
      return (
        <p>
          <Redacted text={b.text} id={b.id} />
        </p>
      );
  }
}

export function SideBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="text-[14px] leading-relaxed text-ink">{children}</div>
    </div>
  );
}
