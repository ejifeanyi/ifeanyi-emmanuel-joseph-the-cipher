import Link from "next/link";
import { getEntries, getNow, getRooms } from "@/lib/content";
import { formatDate, numberWord } from "@/lib/labels";
import { Dual, OnlyIn } from "@/components/Dual";
import { ButtonLink, Chip, Label } from "@/components/ui";
import { EntryRow, RoomTile } from "@/components/content";
import { UliSpiral } from "@/components/Uli";
import { CipherNote, Redacted } from "@/components/cipher";

export default async function Entrance() {
  const [all, now, rooms] = await Promise.all([getEntries(), getNow(), getRooms()]);
  const latest = all.slice(0, 4);
  const n = numberWord(rooms.length);
  const N = n[0].toUpperCase() + n.slice(1);

  return (
    <>
      {/* Hero */}
      <section className="wrap pt-16 pb-14 md:pt-28 md:pb-20">
        <OnlyIn mode="ifeanyi">
          <Label>An archive of becoming · IEJ-0000</Label>
          <h1 className="t-display mt-6 max-w-[1100px]">
            I build things, break some of them, and write down what they teach{" "}
            <span className="whitespace-nowrap">
              me.
              <CipherNote text="he is underselling the breaking part." id="cipher-note" size="0.5em" />
            </span>
          </h1>
          <p className="t-body mt-8 max-w-[720px] text-ink-2">
            I’m Ifeanyi, a software engineer in Lagos. I build products with founders, mostly in Node.js and
            TypeScript, and I keep everything here: the work, the experiments, the failures, and the slow business
            of becoming.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href="/rooms">Enter the rooms →</ButtonLink>
            <ButtonLink href="/work-with-me" variant="secondary">
              Work with me
            </ButtonLink>
            <span className="t-label ml-1 hidden text-ink-3 sm:inline">or press ⌘K anywhere</span>
          </div>
        </OnlyIn>

        <OnlyIn mode="cipher">
          <p className="t-label text-ink-2">~/ · decoded view</p>
          <h1 className="mt-6 font-mono text-[clamp(3rem,9vw,6rem)] leading-none tracking-[-0.04em]">
            &gt; the cipher<span className="caret text-camwood">_</span>
          </h1>
          <p className="mt-8 max-w-[720px] font-mono text-[15px] leading-[1.75] text-ink-2">
            same person. other reading.
            <br />
            this is where the notes live before they are polished, and the things he does not say in the light.
          </p>
          <p className="mt-8 font-mono text-[13px] text-ink-3">// press ⌘K and type help. or don’t.</p>
        </OnlyIn>
      </section>

      {/* Now */}
      <section className="wrap">
        <div className="grid gap-6 rounded-xl bg-surface p-6 md:grid-cols-[180px_1fr_auto] md:gap-12 md:p-9">
          <div className="flex flex-col gap-1.5">
            <Label accent>Now</Label>
            <p className="t-label text-ink-3">Updated {formatDate(now.updated)}</p>
          </div>
          <ul className="flex flex-col gap-3">
            {now.items.map((it, i) => (
              <li key={it.label} className="t-h3">
                <Dual i={it.text} c={now.cipher[i]} />
              </li>
            ))}
          </ul>
          <Link href="/now" className="link-accent self-start text-[15px] font-medium">
            <Dual i="The full Now page →" c="cat /now →" />
          </Link>
        </div>
      </section>

      {/* Rooms */}
      <section className="wrap pt-24 md:pt-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Label>
              <Dual i="The rooms" c="$ ls /rooms" />
            </Label>
            <h2 className="t-h1 mt-3 max-w-[820px]">
              <Dual i={`${N} rooms to start. More open as the archive grows.`} c={`${n} rooms. more behind the walls.`} />
            </h2>
          </div>
          <Link href="/rooms" className="link-accent shrink-0 text-[15px] font-medium">
            <Dual i="Open the full map →" c="ls -a →" />
          </Link>
        </div>

        <OnlyIn mode="ifeanyi" className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {rooms.map((r) => (
            <RoomTile key={r.slug} r={r} />
          ))}
        </OnlyIn>

        <OnlyIn mode="cipher" className="mt-10">
          <ul>
            {rooms.map((r) => (
              <li key={r.slug}>
                <Link href={`/${r.slug}`} className="group grid grid-cols-[1fr_auto] items-center gap-4 border-t border-rule py-4 font-mono sm:grid-cols-[70px_260px_1fr_auto]">
                  <span className="hidden text-[13px] text-ink-3 sm:block">drwx</span>
                  <span className="text-[20px] group-hover:text-camwood md:text-[24px]">{r.cipherPath}</span>
                  <span className="hidden text-[13px] text-ink-2 sm:block">{r.cipherDescription}</span>
                  <span className={`text-[13px] ${r.live ? "text-ink" : "text-ink-3"}`}>{r.live ? "live" : "··"}</span>
                </Link>
              </li>
            ))}
            <li className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-rule py-4 font-mono sm:grid-cols-[70px_260px_1fr_auto]">
              <span className="hidden text-[13px] text-ink-3 sm:block">d---</span>
              <span className="text-[20px] text-camwood md:text-[24px]">/???</span>
              <span className="hidden text-[13px] text-ink-2 sm:block">locked</span>
              <span className="text-[13px] text-ink">find the key</span>
            </li>
          </ul>
        </OnlyIn>
      </section>

      <div className="wrap pt-24 md:pt-28">
        <UliSpiral />
      </div>

      {/* Latest */}
      <section className="wrap pt-20 md:pt-24">
        <div className="mb-6 flex items-end justify-between gap-6">
          <h2 className="t-h1">
            <Dual i="Latest from the archive" c="tail -n 4 /archive" />
          </h2>
          <Link href="/archive" className="link-accent shrink-0 text-[15px] font-medium">
            <Dual i="The full archive →" c="cd /archive →" />
          </Link>
        </div>
        <div className="border-b border-rule">
          {latest.map((e) => (
            <EntryRow key={e.catalog} e={e} />
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className="t-label text-ink-3">IEJ-0000</span>
          <Redacted text="there are more rooms than the menu shows. ⌘K, then type help." id="redacted-entrance" />
        </div>
        <div className="mt-6 c-only">
          <Chip variant="accent">◇ open your keyring: ⌘K → keys</Chip>
        </div>
      </section>
    </>
  );
}
