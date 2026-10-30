"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSite } from "@/components/SiteProvider";
import { DecodeToggle } from "@/components/cipher";
import { Dual } from "@/components/Dual";
import { rooms, laterRooms } from "@/content/rooms";

export function RoomsMenu({ nowLine }: { nowLine: { i: string; c: string } }) {
  const { menuOpen, setMenuOpen, setPaletteOpen, keyring, setKeyringOpen } = useSite();
  const pathname = usePathname();

  useEffect(() => setMenuOpen(false), [pathname, setMenuOpen]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen, setMenuOpen]);

  if (!menuOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="The rooms" className="fixed inset-0 z-[85] overflow-y-auto bg-page">
      <div className="wrap flex min-h-full flex-col gap-10 py-6 md:py-12">
        <div className="flex items-center justify-between">
          <p className="t-label text-ink-2">
            <Dual i={`The rooms · ${rooms.length} open`} c={`ls /rooms · ${rooms.length} open`} />
          </p>
          <div className="flex items-center gap-4">
            {keyring.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setKeyringOpen(true);
                }}
                className="c-only whitespace-nowrap rounded-full bg-camwood-soft px-3 py-1.5 font-mono text-[11px] text-camwood sm:!hidden"
                aria-label={`Keyring: ${keyring.length} found`}
              >
                ◇ {keyring.length} of ?
              </button>
            )}
            <button type="button" onClick={() => setMenuOpen(false)} className="t-label whitespace-nowrap text-ink hover:text-camwood">
              Close ✕
            </button>
          </div>
        </div>

        <ul className="grid gap-x-16 md:grid-cols-2">
          {rooms.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/${r.slug}`}
                className="group flex items-center gap-5 border-t border-rule py-4 md:py-5"
              >
                <span className="t-label w-12 text-ink-3">{r.code}</span>
                <span className="t-h1 flex-1 !text-[clamp(1.8rem,4vw,2.6rem)] group-hover:text-camwood">
                  <Dual i={r.name} c={r.cipherPath} />
                </span>
                <span className="t-label hidden text-ink-3 sm:inline">{r.status}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div>
          <p className="t-label mb-3 text-ink-2">
            <Dual i="Opening later" c="locked for now" />
          </p>
          <div className="flex flex-wrap gap-2">
            {laterRooms.map((n) => (
              <span key={n} className="rounded-full border border-rule px-3.5 py-2 text-[13px] text-ink-3">
                {n} · soon
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-4 rounded-xl bg-surface p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <p className="text-[15px] text-ink">
            <span className="t-label mr-3 text-camwood">Now</span>
            <Dual i={nowLine.i} c={nowLine.c} />
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setPaletteOpen(true);
              }}
              className="rounded-full border border-rule px-3 py-1.5 font-mono text-[12px] text-ink-2"
            >
              ⌘K
            </button>
            <DecodeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
