"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSite } from "@/components/SiteProvider";
import { fragments } from "@/content/secrets";
import { typeLabel, entryHref } from "@/lib/labels";
import type { SearchItem } from "@/lib/content";

type Item = { label: string; hint: string; group: string; run: () => void };

const ROOMS: [string, string][] = [
  ["Story", "/story"],
  ["Now", "/now"],
  ["Work", "/work"],
  ["Lab", "/lab"],
  ["Failures", "/failures"],
  ["Writing", "/writing"],
  ["Films", "/films"],
  ["Archive", "/archive"],
  ["Work with me", "/work-with-me"],
];

const HELP = [
  "rooms    open the rooms menu",
  "now      what i am doing now",
  "random   a random entry",
  "whoami   who is the cipher",
  "keys     your keyring",
  "theme    switch readings",
  "clear    clear this screen",
  "…and some i won’t list.",
];

export function CommandPalette({ index }: { index: SearchItem[] }) {
  const site = useSite();
  const { paletteOpen, setPaletteOpen, mode } = site;
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [output, setOutput] = useState<string[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = () => {
    setPaletteOpen(false);
    setQ("");
    setOutput(null);
    setSel(0);
  };
  const go = (href: string) => {
    close();
    router.push(href);
  };

  useEffect(() => {
    if (paletteOpen) setTimeout(() => inputRef.current?.focus(), 10);
  }, [paletteOpen]);

  const items: Item[] = useMemo(() => {
    const term = q.trim().toLowerCase();
    const match = (s: string) => !term || s.toLowerCase().includes(term);
    const out: Item[] = [];
    for (const [name, href] of ROOMS)
      if (match(name)) out.push({ group: "Jump to", label: name, hint: href, run: () => go(href) });
    for (const e of index)
      if (match(`${e.title} ${e.catalog} ${e.tags.join(" ")} ${e.summary}`))
        out.push({ group: term ? "Entries" : "Recent entries", label: `${e.catalog} · ${e.title}`, hint: typeLabel[e.type], run: () => go(entryHref(e)) });
    const actions: Item[] = [
      { group: "Actions", label: mode === "cipher" ? "Switch to Ifeanyi" : "Switch to The Cipher", hint: "⌘ .", run: () => { close(); site.toggleMode(); } },
      { group: "Actions", label: "Open keyring", hint: "keys", run: () => { close(); site.setKeyringOpen(true); } },
      { group: "Actions", label: "Book a call", hint: "↗", run: () => go("/work-with-me") },
    ];
    for (const a of actions) if (match(a.label)) out.push(a);
    return term ? out : out.slice(0, 12);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, index, mode]);

  function runCommand(raw: string): boolean {
    const cmd = raw.trim().toLowerCase().replace(/^>\s*/, "");
    const say = (lines: string[]) => setOutput((o) => [...(o ?? []), `> ${cmd}`, ...lines]);
    switch (cmd) {
      case "help":
        site.discover("help");
        say(HELP);
        return true;
      case "rooms":
        close();
        site.setMenuOpen(true);
        return true;
      case "now":
        go("/now");
        return true;
      case "random": {
        const e = index[Math.floor(Math.random() * index.length)];
        if (e) go(entryHref(e));
        return true;
      }
      case "whoami":
        site.discover("whoami");
        say(["the cipher. the other reading of ifeanyi emmanuel joseph.", "engineer by day. notes before polish. you’re talking to a static site."]);
        return true;
      case "keys":
        close();
        site.setKeyringOpen(true);
        return true;
      case "theme":
      case "decode":
        close();
        site.toggleMode();
        return true;
      case "clear":
        setOutput(null);
        return true;
      case "decode --all":
        close();
        site.discover("decode-all");
        window.dispatchEvent(new Event("iej:decode-all"));
        return true;
      case "unlock vault":
      case "open vault": {
        const have = (Object.keys(fragments) as (keyof typeof fragments)[]).filter((f) => site.hasFound(f));
        if (have.length < 3) say([`the vault wants a key. fragments found: ${have.length} of 3.`]);
        else {
          say(["key assembled. opening /vault…"]);
          setTimeout(() => go("/vault"), 600);
        }
        return true;
      }
      case "sudo":
      case "sudo su":
        say(["nice try."]);
        return true;
      case "ls -a":
        say(["story  now  work  lab  failures  writing  films  archive  work-with-me  .vault"]);
        return true;
      default:
        return false;
    }
  }

  if (!paletteOpen) return null;

  const groups = items.reduce<Record<string, Item[]>>((acc, it) => ((acc[it.group] ??= []).push(it), acc), {});
  let flat = 0;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-black/40 px-4 pt-[12vh]" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command line"
        onClick={(e) => e.stopPropagation()}
        className="rise w-full max-w-[640px] overflow-hidden rounded-xl border border-rule bg-page shadow-2xl"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (runCommand(q)) {
              setQ("");
              return;
            }
            items[sel]?.run();
          }}
          className="flex items-center gap-3 border-b border-rule px-5 py-4"
        >
          <span className="font-mono text-ink">&gt;</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
              else if (e.key === "ArrowDown") {
                e.preventDefault();
                setSel((s) => Math.min(s + 1, items.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSel((s) => Math.max(s - 1, 0));
              }
            }}
            placeholder="Type a command or search…"
            aria-label="Type a command or search"
            className="w-full bg-transparent font-mono text-[15px] text-ink outline-none placeholder:text-ink-3 focus-visible:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" onClick={close} className="t-label shrink-0 text-ink-3 hover:text-ink">
            esc
          </button>
        </form>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {output && (
            <pre className="mb-2 whitespace-pre-wrap rounded-lg bg-sunken p-4 font-mono text-[13px] leading-relaxed text-ink-2">
              {output.join("\n")}
            </pre>
          )}
          {Object.entries(groups).map(([group, list]) => (
            <div key={group} className="py-2">
              <p className="t-label px-3 pb-1 !text-[11px] text-ink-3">{group}</p>
              {list.map((it) => {
                const i = flat++;
                return (
                  <button
                    key={group + it.label}
                    type="button"
                    onMouseEnter={() => setSel(i)}
                    onClick={it.run}
                    className={`flex w-full items-center justify-between gap-4 rounded-md px-3 py-2.5 text-left text-[14px] ${
                      sel === i ? "bg-surface text-ink" : "text-ink"
                    }`}
                  >
                    <span className="truncate">{it.label}</span>
                    <span className="shrink-0 font-mono text-[12px] text-ink-3">{it.hint}</span>
                  </button>
                );
              })}
            </div>
          ))}
          {items.length === 0 && !output && (
            <p className="px-3 py-6 font-mono text-[13px] text-ink-3">no match. press enter to run it as a command, or try “help”.</p>
          )}
        </div>
        <div className="border-t border-rule px-5 py-3 font-mono text-[11px] text-ink-3">↑↓ navigate · ↵ open · esc close · type help</div>
      </div>
    </div>
  );
}
