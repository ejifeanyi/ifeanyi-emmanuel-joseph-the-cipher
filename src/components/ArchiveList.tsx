"use client";

import { useMemo, useState } from "react";
import type { SearchItem } from "@/lib/content";
import type { EntryType } from "@/lib/types";
import { typeLabel } from "@/lib/labels";
import { EntryRow } from "@/components/content";

export function ArchiveList({ items }: { items: SearchItem[] }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState<EntryType | "all">("all");

  const types = useMemo(() => Array.from(new Set(items.map((i) => i.type))), [items]);
  const filtered = items.filter((i) => {
    if (type !== "all" && i.type !== type) return false;
    const t = q.trim().toLowerCase();
    return !t || `${i.title} ${i.catalog} ${i.summary} ${i.tags.join(" ")}`.toLowerCase().includes(t);
  });
  const years = Array.from(new Set(filtered.map((i) => i.date.slice(0, 4))));

  const chip = (active: boolean) =>
    `t-label rounded-full border px-3 py-1.5 !text-[11px] transition-colors ${
      active ? "border-ink bg-ink text-page" : "border-rule text-ink-2 hover:border-ink"
    }`;

  return (
    <>
      <div className="flex flex-col gap-4">
        <label className="sr-only" htmlFor="archive-search">
          Search the archive
        </label>
        <input
          id="archive-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the archive…"
          className="w-full rounded-lg border border-rule bg-transparent px-4 py-3.5 text-[15px] text-ink placeholder:text-ink-3 focus:border-ink focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          <button type="button" className={chip(type === "all")} onClick={() => setType("all")} aria-pressed={type === "all"}>
            All · {items.length}
          </button>
          {types.map((t) => (
            <button key={t} type="button" className={chip(type === t)} onClick={() => setType(t)} aria-pressed={type === t}>
              {typeLabel[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12">
        {years.map((y) => {
          const inYear = filtered.filter((i) => i.date.startsWith(y));
          return (
            <section key={y} className="mb-12">
              <div className="mb-3 flex items-baseline gap-4">
                <h2 className="t-h2">{y}</h2>
                <span className="t-label text-ink-3">
                  {inYear.length} {inYear.length === 1 ? "entry" : "entries"}
                </span>
              </div>
              <div className="border-b border-rule">
                {inYear.map((e) => (
                  <EntryRow key={e.catalog} e={e} />
                ))}
              </div>
            </section>
          );
        })}
        {filtered.length === 0 && <p className="border-t border-rule py-8 text-ink-2">Nothing matches that. Try another word, or press ⌘K.</p>}
      </div>
    </>
  );
}
