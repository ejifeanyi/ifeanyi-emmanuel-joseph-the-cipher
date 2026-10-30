import type { Metadata, Viewport } from "next";
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import "./globals.css";

import { SiteProvider, modeBootScript } from "@/components/SiteProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RoomsMenu } from "@/components/RoomsMenu";
import { CommandPalette } from "@/components/CommandPalette";
import { ConsoleSecrets, FirstDecodeOverlay, FirstVisitHint, KeyringDialog, Toasts } from "@/components/cipher";
import { getNow, getSearchIndex } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · An archive of becoming`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} · An archive of becoming`,
    description: site.description,
    url: site.url,
  },
  twitter: { card: "summary" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f0e8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0b0a" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [index, now] = await Promise.all([getSearchIndex(), getNow()]);
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeBootScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <SiteProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-page">
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <RoomsMenu nowLine={{ i: now.items[0]?.text ?? "", c: now.cipher[0] ?? "" }} />
          <CommandPalette index={index} />
          <KeyringDialog />
          <FirstVisitHint />
          <FirstDecodeOverlay />
          <Toasts />
          <ConsoleSecrets />
        </SiteProvider>
      </body>
    </html>
  );
}
