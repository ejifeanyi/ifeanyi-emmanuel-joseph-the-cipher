import type { Metadata } from "next";
import { getSearchIndex } from "@/lib/content";
import { PageIntro } from "@/components/content";
import { ArchiveList } from "@/components/ArchiveList";
import { Label } from "@/components/ui";
import { Dual } from "@/components/Dual";

export const metadata: Metadata = { title: "Archive", description: "Every entry, in order." };

export default async function ArchivePage() {
  const items = await getSearchIndex();
  return (
    <>
      <PageIntro
        code="R-08 · Archive"
        title="Everything, in order."
        cipherTitle="ls -la /archive"
        sub="Every entry ever published: projects, experiments, failures, essays. Filter, search, or just scroll back in time."
        cipherSub="every file. nothing deleted."
      />
      <section className="wrap">
        <ArchiveList items={items} />
        <div className="mt-4 flex flex-col gap-2">
          <Label>
            <Dual i="The archive starts here" c="// first write: 29.10.2026" />
          </Label>
          <p className="max-w-xl text-ink-2">
            Older years appear as the archive grows. Nothing is deleted; abandoned work stays, marked as abandoned.
          </p>
        </div>
      </section>
    </>
  );
}
