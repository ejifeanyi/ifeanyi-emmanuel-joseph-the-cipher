import type { Metadata } from "next";
import { getNow } from "@/lib/content";
import { formatDate } from "@/lib/labels";
import { PageIntro } from "@/components/content";
import { Label } from "@/components/ui";
import { Dual } from "@/components/Dual";

export const metadata: Metadata = { title: "Now", description: "What Ifeanyi is doing this season." };

export default async function NowPage() {
  const now = await getNow();
  return (
    <>
      <PageIntro
        code="R-02 · Now"
        title="What I’m doing now."
        cipherTitle="cat /now"
        sub={`Updated ${formatDate(now.updated)}. A snapshot of this season, not a to-do list.`}
        cipherSub={`last write: ${now.updated}. this season, not a to-do list.`}
      />
      <section className="wrap">
        <div className="grid gap-5 md:grid-cols-2">
          {now.items.map((it, i) => (
            <div key={it.label} className="flex flex-col gap-4 rounded-xl border border-rule p-7">
              <Label accent>{String(i + 1).padStart(2, "0")}</Label>
              <p className="t-h2">
                <Dual i={it.text} c={now.cipher[i]} />
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="t-h2 mb-4">
            <Dual i="Previous seasons" c="ls /now/.history" />
          </h2>
          {now.previous.length === 0 ? (
            <p className="border-t border-rule pt-5 text-ink-2">
              <Dual i="This is the first season. The archive of Nows starts here." c="empty. this is the first season." />
            </p>
          ) : (
            now.previous.map((p) => (
              <div key={p.date} className="border-t border-rule py-5">
                <p className="t-label text-ink-3">{p.season}</p>
                <ul className="mt-2 text-ink-2">
                  {p.items.map((x) => (
                    <li key={x}>— {x}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
