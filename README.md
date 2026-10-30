# ifeanyiemmanuel.com

An archive of becoming. The personal site of Ifeanyi Emmanuel Joseph, and its other reading, The Cipher.

Built with Next.js (App Router), TypeScript and Tailwind CSS. Exported as a static site and hosted free on Cloudflare Pages.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in /out
npm start          # preview /out locally
npm run typecheck
```

Needs Node 20 or newer.

## Content comes from Notion

Entries, the Now page and the Story chapters are written in Notion, on the private page **ifeanyiemmanueljoseph.com** (databases: Entries, Now, Story). That page explains how to write and publish.

- With `NOTION_TOKEN` set, every build reads Notion (`src/lib/notion.ts`). Only entries with **Published** ticked appear.
- Without it, the site uses the local copies in `src/content`, so it always builds.
- The site is static, so Notion changes go live on the next build. The GitHub Action in `.github/workflows/publish.yml` triggers one every 6 hours, or when you press **Run workflow**.

### One-time Notion setup

1. Create an internal integration at notion.so/profile/integrations, named *Website*. Copy its secret.
2. In Notion, open the **ifeanyiemmanueljoseph.com** page → ••• → Connections → add *Website*.
3. Put the secret in `.env.local` as `NOTION_TOKEN` (for `npm run dev`) and in Cloudflare → Settings → Variables and secrets (for the live site).

## Where things live

| What | Where |
| --- | --- |
| Colours, fonts, type scale, both readings | `src/app/globals.css` (mirrors the Figma variables) |
| Name, location trail, socials, booking link | `src/lib/site.ts` |
| Entries, films, Now, Story | Notion (local fallbacks: `src/content/entries.ts`, `now.ts`, `story.ts`) |
| Rooms, their names and descriptions | `src/content/rooms.ts` (counts and the Now date update by themselves) |
| The offer on Work with me | `src/app/work-with-me/page.tsx` |
| Secrets, keyring labels, vault key | `src/content/secrets.ts` |
| Contact form backend (Cloudflare) | `functions/api/contact.ts` |

Pages only read content through `src/lib/content.ts`.

## The two readings

Every line that differs between readings uses `<Dual i="Ifeanyi's words" c="the cipher's words" />`. Both are rendered; CSS shows the one that matches `html[data-mode]`, so nothing flashes and it works without JavaScript. Headings and body text switch to monospace and lowercase automatically in The Cipher.

- `⌘K` / `Ctrl+K`: command line (type `help`)
- `⌘.` / `Ctrl+.`: switch readings

## The secret layer

Spoilers. Found secrets are saved in the visitor's browser and shown as "N of ?".

- Switching to The Cipher, the ◇ note after the headline, the redacted line on the entrance
- `help`, `whoami`, `decode --all`, `unlock vault` in the command line
- `cipher.help()` and `cipher.fragment()` in the browser console
- Key fragments: a faint ◇ in the Lab, one on the 404 page, one in the console
- The vault key is the three fragments joined (stored as a SHA-256 hash in `secrets.ts`)

To add a secret, add an id and label to `secrets` and call `discover("your-id")` wherever it is found.

## Deploy to Cloudflare Pages (free)

1. Push this folder to a GitHub repo.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.
3. Build command `npm run build`, output directory `out`.
4. Add the custom domain `ifeanyiemmanuel.com`.
5. Under Settings → Variables and secrets, add `NOTION_TOKEN`.
6. Under Settings → Builds → Deploy hooks, create a hook, then add its URL to the GitHub repo as the secret `CLOUDFLARE_DEPLOY_HOOK` (Settings → Secrets and variables → Actions).
7. For the contact form: create a free Resend account, verify the domain, then add `RESEND_API_KEY`, `CONTACT_TO` and `CONTACT_FROM` under Settings → Variables and secrets.
8. Turn on Web Analytics for the project (free, no code needed).

The contact form only works once deployed; locally it shows the "book a call instead" fallback.

## Next

- Images inside Notion entries (copied to Cloudflare R2 at build time, since Notion image links expire)
- Bold, italic and links inside Notion text
- Kit newsletter form (`NEXT_PUBLIC_KIT_FORM_ACTION`)
- Courses and accounts: remove `output: "export"` in `next.config.ts` and deploy with the OpenNext Cloudflare adapter
