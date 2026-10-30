"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui";
import { site } from "@/lib/site";

type State = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-lg border border-rule bg-transparent px-4 py-3 text-[15px] text-ink placeholder:text-ink-3 focus:border-ink focus:outline-none";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      // Handled by functions/api/contact.ts on Cloudflare Pages.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent")
    return (
      <div className="rise flex flex-col gap-4 rounded-xl bg-surface p-8">
        <p className="t-label text-camwood">Message received</p>
        <p className="t-h2">Thank you. I’ll read this properly.</p>
        <p className="text-ink-2">I read every message myself, and reply to everyone who writes.</p>
      </div>
    );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {/* Honeypot: real people never see or fill this. */}
      <input type="text" name="company_site" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-[13px] font-medium">
          Name
          <input name="name" required className={field} placeholder="Your name" />
        </label>
        <label className="flex flex-col gap-2 text-[13px] font-medium">
          Email
          <input name="email" type="email" required className={field} placeholder="you@company.com" />
        </label>
      </div>
      <label className="flex flex-col gap-2 text-[13px] font-medium">
        What are you building?
        <textarea name="message" required rows={5} className={field} placeholder="A few sentences is enough." />
      </label>
      <label className="flex flex-col gap-2 text-[13px] font-medium">
        When do you want to start?
        <select name="timeline" className={field} defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          <option>As soon as possible</option>
          <option>In the next month</option>
          <option>In 1–3 months</option>
          <option>Just exploring</option>
        </select>
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state === "sending"} className={buttonClass("primary")}>
          {state === "sending" ? "Sending…" : "Send message →"}
        </button>
        {state === "error" && (
          <p className="text-[14px] text-camwood">
            That didn’t go through.{" "}
            <a href={site.bookingUrl} target="_blank" rel="noreferrer" className="underline">
              Book a call instead
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
