import Link from "next/link";
import { UliWave } from "@/components/Uli";
import { Dual } from "@/components/Dual";
import { buttonClass } from "@/components/ui";
import { site } from "@/lib/site";
import { rooms } from "@/content/rooms";
import { numberWord } from "@/lib/labels";

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  x: "X",
  github: "GitHub",
};

export function Footer() {
  const socials = Object.entries(site.socials).filter(([, url]) => url);
  const { origin, now, next } = site.location;

  return (
    <footer className="mt-24 md:mt-32">
      <div className="wrap">
        <UliWave className="opacity-80" />
        <div className="grid gap-10 py-12 md:grid-cols-[1fr_1.2fr_auto] md:gap-16">
          <div className="flex flex-col gap-2">
            <p className="t-h3 whitespace-pre-line">
              <Dual
                i={`From ${origin}.\nLiving in ${now}.`}
                c={`// origin: ${origin.split(",")[0].toLowerCase()}\n// now: ${now.toLowerCase()}${next ? `\n// next: ${next.toLowerCase()}` : ""}`}
              />
            </p>
            {next && (
              <p className="t-label text-ink-2">
                <Dual i={`Next stop: ${next}.`} c="end of transmission." />
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[15px] font-medium text-ink">
              <Dual i="Letters, only when there is something worth saying." c="> subscribe --signal" />
            </p>
            {site.kitFormAction ? (
              <form action={site.kitFormAction} method="post" target="_blank" className="flex flex-col gap-2 sm:flex-row">
                <label className="sr-only" htmlFor="footer-email">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  name="email_address"
                  required
                  placeholder="Your email"
                  className="w-full rounded-full border border-rule bg-transparent px-4 py-3 text-[14px] text-ink placeholder:text-ink-3 sm:max-w-[280px]"
                />
                <button type="submit" className={buttonClass("primary")}>
                  <Dual i="Subscribe" c="send" />
                </button>
              </form>
            ) : (
              <p className="text-[14px] text-ink-2">
                <Dual i="The first letter is being written. Sign-ups open soon." c="signal not live yet. check back." />
              </p>
            )}
          </div>

          <ul className="flex flex-col gap-2 text-[15px]">
            {socials.map(([key, url]) => (
              <li key={key}>
                <a href={url} target="_blank" rel="noreferrer" className="text-ink hover:text-camwood">
                  <Dual i={SOCIAL_LABELS[key]} c={SOCIAL_LABELS[key].toLowerCase()} />
                </a>
              </li>
            ))}
            <li>
              <Link href="/rooms" className="text-ink hover:text-camwood">
                <Dual i="All rooms" c="ls /rooms" />
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-2 border-t border-rule py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-label text-ink-3">
            <Dual i={`© ${new Date().getFullYear()} ${site.name}`} c={`© ${new Date().getFullYear()} · the cipher`} />
          </p>
          <p className="t-label text-ink-3">
            <Dual
              i={`There are ${numberWord(rooms.length)} rooms on the menu. There are more than ${numberWord(rooms.length)} rooms.`}
              c={`there are more than ${numberWord(rooms.length)} rooms.`}
            />
          </p>
        </div>
      </div>
    </footer>
  );
}
