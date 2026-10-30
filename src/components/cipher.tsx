"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSite } from "@/components/SiteProvider";
import { scramble } from "@/lib/decode";
import { fragments, secrets } from "@/content/secrets";

/* ------------------------------------------------------------------
   Decode toggle: Ifeanyi ⇄ Cipher
------------------------------------------------------------------- */
export function DecodeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useSite();
  const seg = (m: "ifeanyi" | "cipher", label: string) => {
    const active = mode === m;
    return (
      <button
        type="button"
        onClick={() => setMode(m)}
        aria-pressed={active}
        className={`whitespace-nowrap rounded-full ${compact ? "px-2 sm:px-2.5" : "px-3.5"} py-1.5 ${compact ? "text-[11px] sm:text-[12px]" : "text-[12px]"} leading-none transition-colors ${
          m === "cipher" ? "font-mono" : "font-sans"
        } ${active ? "bg-camwood text-on-accent" : "text-ink-2 hover:text-ink"}`}
      >
        {label}
      </button>
    );
  };
  return (
    <div
      role="group"
      aria-label="Reading: Ifeanyi or The Cipher"
      className="inline-flex items-center rounded-full border border-ink p-1"
    >
      {seg("ifeanyi", "Ifeanyi")}
      {seg("cipher", "cipher")}
    </div>
  );
}

/** Banner at the end of an entry that switches to the other reading. */
export function ReadingSwitch() {
  const { mode, toggleMode } = useSite();
  const toCipher = mode !== "cipher";
  return (
    <button
      type="button"
      onClick={() => {
        toggleMode();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl px-6 py-5 text-left font-mono transition-colors ${
        toCipher ? "bg-ink text-page hover:bg-camwood" : "border border-ink text-ink hover:border-camwood hover:text-camwood"
      }`}
    >
      <span className="text-[14px]">{toCipher ? "> read this entry in The Cipher’s words" : "< read ifeanyi’s version"}</span>
      <span className="text-[13px] opacity-70">⌘ .</span>
    </button>
  );
}

/* ------------------------------------------------------------------
   Redacted line: blacked out until clicked, then decodes in place.
------------------------------------------------------------------- */
export function Redacted({ text, id, className = "" }: { text: string; id?: string; className?: string }) {
  const { discover, hasFound } = useSite();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const known = id ? hasFound(id) : false;

  useEffect(() => {
    const all = () => reveal();
    window.addEventListener("iej:decode-all", all);
    return () => window.removeEventListener("iej:decode-all", all);
  });

  function reveal() {
    if (open) return;
    setOpen(true);
    requestAnimationFrame(() => {
      if (ref.current) void scramble(ref.current, text, 700);
    });
    if (id && id in secrets) discover(id);
  }

  if (open || known)
    return (
      <span className={`font-mono ${className}`}>
        <span ref={ref}>{text}</span>
      </span>
    );

  return (
    <button
      type="button"
      onClick={reveal}
      aria-label="Encoded text. Press to decode."
      title="decode?"
      className={`group relative inline-block h-[1.1em] w-[min(26ch,70vw)] translate-y-[0.15em] cursor-pointer rounded-[2px] bg-redacted align-baseline transition-opacity hover:opacity-85 ${className}`}
    >
      <span className="t-label pointer-events-none absolute -top-7 left-0 hidden rounded-full bg-camwood px-2 py-1 !text-[10px] text-on-accent group-hover:block group-focus-visible:block">
        decode?
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------
   Cipher note: a faint ◇ that opens The Cipher's side remark.
------------------------------------------------------------------- */
export function CipherNote({ text, id, size = "1em" }: { text: string; id?: string; size?: string }) {
  const { discover } = useSite();
  const [open, setOpen] = useState(false);
  const noteRef = useRef<HTMLSpanElement>(null);
  const [shift, setShift] = useState(0);

  // Keep the note on screen: if it would run past either edge, slide it back in.
  useLayoutEffect(() => {
    if (!open || !noteRef.current) return setShift(0);
    const place = () => {
      const el = noteRef.current;
      if (!el) return;
      el.style.translate = "";
      const r = el.getBoundingClientRect();
      const gutter = 16;
      const vw = document.documentElement.clientWidth;
      let dx = 0;
      if (r.right > vw - gutter) dx = vw - gutter - r.right;
      if (r.left + dx < gutter) dx = gutter - r.left;
      setShift(dx);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open]);

  return (
    <span className="relative inline-block align-baseline">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (id) discover(id);
        }}
        aria-expanded={open}
        aria-label="A note from The Cipher"
        className="cursor-pointer px-1 font-mono text-camwood transition-transform hover:scale-110"
        style={{ fontSize: size }}
      >
        {open ? "◆" : "◇"}
      </button>
      {open && (
        <span
          ref={noteRef}
          role="note"
          style={{ translate: shift ? `${shift}px 0` : undefined }}
          className="rise absolute left-0 top-full z-20 mt-2 block w-[min(320px,calc(100vw-32px))] rounded-lg bg-[#0e0b0a] p-4 text-left font-mono text-[13px] leading-relaxed tracking-normal text-[#f2e9e1] normal-case shadow-xl"
        >
          <span className="mb-1 block text-[11px] text-[#a3958a]">◇ the cipher</span>
          {text}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------
   Key fragment: a nearly invisible glyph in a margin.
------------------------------------------------------------------- */
export function KeyFragment({ id, className = "" }: { id: keyof typeof fragments; className?: string }) {
  const { discover, toast } = useSite();
  const n = id.split("-")[1];
  return (
    <button
      type="button"
      aria-label="A small glyph"
      onClick={() => {
        if (!discover(id, `◇ key fragment ${n} of 3: ${fragments[id]}_`)) {
          toast(`◇ fragment ${n} is already on your keyring`);
        }
      }}
      className={`cursor-pointer font-mono text-[15px] text-rule transition-colors hover:text-camwood ${className}`}
    >
      ◇
    </button>
  );
}

/* ------------------------------------------------------------------
   Toasts
------------------------------------------------------------------- */
export function Toasts() {
  const { toasts } = useSite();
  return (
    <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-[70] flex flex-col items-end gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="rise rounded-full bg-[#0e0b0a] px-4 py-2.5 font-mono text-[13px] text-[#f2e9e1] shadow-lg">
          {t.text}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   First-visit hint: "this site has two readings"
------------------------------------------------------------------- */
export function FirstVisitHint() {
  const { mode, setMode } = useSite();
  const [show, setShow] = useState(false);
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem("iej:hinted") === "1";
      localStorage.setItem("iej:hinted", "1");
    } catch {
      seen = true;
    }
    if (seen || document.documentElement.dataset.mode === "cipher") return;
    const a = setTimeout(() => setShow(true), 1500);
    const b = setTimeout(() => setShow(false), 10000);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);
  if (!show || mode === "cipher") return null;
  return (
    <button
      type="button"
      onClick={() => {
        setShow(false);
        setMode("cipher");
      }}
      className="rise fixed bottom-4 left-4 z-[60] flex items-center gap-3 rounded-full bg-ink px-4 py-3 text-[13px] text-page shadow-lg"
    >
      This site has two readings.
      <span className="font-mono text-camwood">try ⇄</span>
    </button>
  );
}

/* ------------------------------------------------------------------
   One-time overlay the first time someone enters The Cipher.
------------------------------------------------------------------- */
export function FirstDecodeOverlay() {
  const { firstDecode, dismissFirstDecode, keyring } = useSite();
  useEffect(() => {
    if (!firstDecode) return;
    const t = setTimeout(() => {
      const close = () => dismissFirstDecode();
      window.addEventListener("keydown", close, { once: true });
      window.addEventListener("pointerdown", close, { once: true });
    }, 400);
    return () => clearTimeout(t);
  }, [firstDecode, dismissFirstDecode]);
  if (!firstDecode) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-6" role="dialog" aria-modal="true" aria-label="You decoded the site">
      <div className="rise w-full max-w-lg rounded-xl border border-rule bg-page p-8 font-mono">
        <p className="text-2xl text-ink">
          &gt; you decoded the site<span className="caret text-camwood">_</span>
        </p>
        <p className="mt-4 text-sm text-ink-2">there is more here than the menu shows.</p>
        <p className="mt-6 text-sm text-ink">doors found: {keyring.length} of ?</p>
        <p className="mt-8 text-xs text-ink-3">press any key</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Keyring dialog
------------------------------------------------------------------- */
export function KeyringDialog() {
  const { keyringOpen, setKeyringOpen, keyring } = useSite();
  useEffect(() => {
    if (!keyringOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setKeyringOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keyringOpen, setKeyringOpen]);
  if (!keyringOpen) return null;
  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/60 p-6" onClick={() => setKeyringOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Keyring"
        onClick={(e) => e.stopPropagation()}
        className="rise w-full max-w-md rounded-xl bg-[#0e0b0a] p-6 font-mono text-[#f2e9e1]"
      >
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-[#a3958a]">◇ keyring</p>
          <button type="button" onClick={() => setKeyringOpen(false)} className="text-[12px] text-[#a3958a] hover:text-white">
            esc ✕
          </button>
        </div>
        <ul className="mt-5 space-y-2 text-[14px]">
          {keyring.length === 0 && <li className="text-[#a3958a]">nothing yet. keep looking.</li>}
          {keyring.map((id) => (
            <li key={id} className="flex gap-3">
              <span className="text-[#e2553e]">✓</span>
              {secrets[id] ?? id}
            </li>
          ))}
          <li className="flex gap-3 text-[#6e625a]">
            <span>·</span>???
          </li>
        </ul>
        <p className="mt-6 text-[15px]">found: {keyring.length} of ?</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   For developers who open the console.
------------------------------------------------------------------- */
export function ConsoleSecrets() {
  const { discover } = useSite();
  useEffect(() => {
    const w = window as unknown as { cipher?: unknown; __cipherGreeted?: boolean };
    if (!w.__cipherGreeted) {
      w.__cipherGreeted = true;
      console.log(
        "%c◇\n%chello, curious one.\nyou opened the console, so you are one of us.\ntry: cipher.help()",
        "color:#e2553e;font-size:22px",
        "font-family:monospace;font-size:13px;line-height:1.6",
      );
    }
    w.cipher = {
      help() {
        discover("console");
        return "cipher.whoami()  ·  cipher.fragment()  ·  there is a vault. it wants a key.";
      },
      whoami() {
        return "the other reading of ifeanyi emmanuel joseph. engineer. notes before polish.";
      },
      fragment() {
        discover("frag-3", `◇ key fragment 3 of 3: ${fragments["frag-3"]}_`);
        return `fragment 3 of 3: ${fragments["frag-3"]}. the other two are on the site.`;
      },
    };
  }, [discover]);
  return null;
}
