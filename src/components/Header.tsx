"use client";

import Link from "next/link";
import { useSite } from "@/components/SiteProvider";
import { DecodeToggle } from "@/components/cipher";
import { Glyph } from "@/components/ui";
import { Dual } from "@/components/Dual";
import { site } from "@/lib/site";

const NAV = [
  { i: "Now", c: "/now", href: "/now" },
  { i: "Archive", c: "/archive", href: "/archive" },
  { i: "Work with me", c: "/work-with-me", href: "/work-with-me" },
];

export function Header() {
  const { setMenuOpen, setPaletteOpen, keyring, setKeyringOpen } = useSite();
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-page/90 backdrop-blur">
      <div className="wrap flex h-[68px] items-center justify-between gap-4 md:h-[76px]">
        <Link href="/" className="flex items-center gap-3 text-ink" aria-label={`${site.name}, home`}>
          <Glyph size={22} />
          <span className="t-h3 !text-[17px] md:!text-[19px]">
            <Dual i={<><span className="hidden sm:inline">{site.name}</span><span className="sm:hidden">{site.shortName}</span></>} c="the cipher" />
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Main">
          <button type="button" onClick={() => setMenuOpen(true)} className="text-[15px] text-ink hover:text-camwood">
            <Dual i="Rooms" c="/rooms" />
          </button>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-[15px] text-ink hover:text-camwood">
              <Dual i={n.i} c={n.c} />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="hidden items-center gap-2 rounded-full border border-rule px-3 py-1.5 text-[13px] text-ink-2 hover:border-ink sm:inline-flex"
            aria-label="Open the command line"
          >
            <Dual i="Search" c="search" />
            <span className="font-mono text-[11px] text-ink-3">⌘K</span>
          </button>
          {keyring.length > 0 && (
            <button
              type="button"
              onClick={() => setKeyringOpen(true)}
              className="c-only rounded-full bg-camwood-soft px-3 py-1.5 font-mono text-[11px] text-camwood"
              aria-label={`Keyring: ${keyring.length} found`}
            >
              ◇ {keyring.length} of ?
            </button>
          )}
          <DecodeToggle compact />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="text-[14px] font-medium text-ink lg:hidden"
            aria-label="Open the rooms menu"
          >
            <Dual i="Menu" c="/rooms" />
          </button>
        </div>
      </div>
    </header>
  );
}
