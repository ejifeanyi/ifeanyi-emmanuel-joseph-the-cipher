"use client";

import { useState } from "react";
import { useSite } from "@/components/SiteProvider";
import { Glyph } from "@/components/ui";
import { VAULT_KEY_SHA256 } from "@/content/secrets";

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// What lives in the vault. Things not ready for the main rooms.
const contents = [
  { name: "unsent-letter.md", note: "not yet written. it will be." },
  { name: "ideas-i-am-not-sure-about.md", note: "half-formed. kept here until they're not." },
  { name: "clue-02.txt", note: "the next hidden room opens later. this file will point to it." },
];

export function Vault() {
  const { hasFound, discover } = useSite();
  const [key, setKey] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [wrong, setWrong] = useState(false);
  const open = hasFound("vault");

  async function tryKey(e: React.FormEvent) {
    e.preventDefault();
    const ok = (await sha256(key.trim().toLowerCase())) === VAULT_KEY_SHA256;
    if (ok) discover("vault", "◇ access granted: /vault");
    else {
      setAttempts((a) => a + 1);
      setWrong(true);
      setTimeout(() => setWrong(false), 900);
    }
  }

  if (!open)
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center font-mono md:py-32">
        <div className="flex size-24 items-center justify-center rounded border border-ink">
          <Glyph size={40} />
        </div>
        <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] text-camwood">/vault · locked</h1>
        <form onSubmit={tryKey} className={`flex w-full max-w-md items-center gap-3 rounded-md border px-4 py-3.5 ${wrong ? "border-camwood" : "border-ink"}`}>
          <span className="text-ink">&gt;</span>
          <label className="sr-only" htmlFor="vault-key">
            Enter the key
          </label>
          <input
            id="vault-key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="enter the key_"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3"
          />
        </form>
        <p className="text-[13px] text-ink-3">// three fragments. one is in the lab. one is lost. one is for developers.</p>
        <p className="text-[12px] text-ink-3">attempts: {attempts}</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-10 py-20 font-mono md:py-28">
      <div className="flex flex-col gap-4">
        <p className="text-[12px] text-ink-2">/vault · access granted</p>
        <h1 className="text-[clamp(2.2rem,6vw,3.5rem)] leading-none text-camwood">you found it.</h1>
        <p className="max-w-2xl text-[15px] leading-[1.7] text-ink-2">
          nothing here is linked from anywhere else. keep it that way. the key was where he’s from.
        </p>
      </div>
      <ul className="border-b border-rule">
        {contents.map((c) => (
          <li key={c.name} className="grid gap-2 border-t border-rule py-5 sm:grid-cols-[340px_1fr]">
            <span className="text-[15px] text-ink">{c.name}</span>
            <span className="text-[14px] text-ink-2">{c.note}</span>
          </li>
        ))}
      </ul>
      <div className="rounded-xl bg-surface p-6 text-[14px] text-ink-2">
        <p className="text-[12px] text-ink-3">// guestbook</p>
        <p className="mt-2">only people who found this room will be able to sign here. it opens with the next update.</p>
      </div>
    </div>
  );
}
