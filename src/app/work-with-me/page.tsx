import type { Metadata } from "next";
import { PageIntro } from "@/components/content";
import { ContactForm } from "@/components/ContactForm";
import { ButtonLink, Label } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work with me",
  description: "I build MVPs for non-technical founders: a UI design in two days, then a working product in weeks.",
};

// The offer, in one place. Edit prices and steps here.
const offer = [
  {
    label: "What I do",
    lines: [
      "Build MVPs for non-technical founders: from idea to a product people can use.",
      "4-week MVP · $3,500",
      "8-week build, for bigger scopes · priced after a call",
    ],
  },
  {
    label: "How it works",
    lines: [
      "01  A call to understand the idea",
      "02  A UI design, delivered in the first two days",
      "03  The build starts once you approve the design",
      "Payments: 40% upfront, 30% midway, 30% at launch",
    ],
  },
  {
    label: "Proof",
    lines: [
      "Built a social platform for Hollywood creatives for a founder, live in six weeks.",
      "Senior full-stack, strongest in Node.js and TypeScript.",
    ],
  },
];

export default function WorkWithMePage() {
  return (
    <>
      <PageIntro
        code="R-09 · Work with me"
        title="A quiet door."
        cipherTitle="./work-with-me"
        sub="For founders with an idea and no technical co-founder. You see the product before a line of code is written, and you have something real in weeks."
        cipherSub="idea in. product out. design first, code second."
      />
      <section className="wrap">
        <div className="grid gap-5 md:grid-cols-3">
          {offer.map((o) => (
            <div key={o.label} className="flex flex-col gap-3 rounded-xl border border-rule p-7">
              <Label>{o.label}</Label>
              {o.lines.map((l) => (
                <p key={l} className="text-[16px] leading-relaxed">
                  {l}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="wrap mt-20 grid gap-14 lg:grid-cols-[1fr_320px] lg:gap-20">
        <div>
          <h2 className="t-h1 mb-8">Tell me what you’re building.</h2>
          <ContactForm />
        </div>
        <aside className="flex flex-col gap-6">
          <Label>Or skip the form</Label>
          <p className="text-[15px] text-ink-2">Pick a time that works for you. The first call is free.</p>
          <ButtonLink href={site.bookingUrl} external variant="secondary" className="self-start">
            Book a call ↗
          </ButtonLink>
          {site.socials.linkedin && (
            <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="link-accent text-[15px]">
              LinkedIn ↗
            </a>
          )}
        </aside>
      </section>
    </>
  );
}
