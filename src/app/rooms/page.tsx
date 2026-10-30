import type { Metadata } from "next";
import { laterRooms } from "@/content/rooms";
import { getRooms } from "@/lib/content";
import { PageIntro, RoomTile } from "@/components/content";
import { Label } from "@/components/ui";
import { Dual } from "@/components/Dual";
import { numberWord } from "@/lib/labels";

export const metadata: Metadata = { title: "The rooms", description: "Every room in the archive, open and opening later." };

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export default async function RoomsPage() {
  const rooms = await getRooms();
  return (
    <>
      <PageIntro
        code="The map"
        title="The rooms."
        cipherTitle="ls -la /rooms"
        sub={`${cap(numberWord(rooms.length))} rooms are open. More open as the archive grows. Some are not on this map at all.`}
        cipherSub={`${numberWord(rooms.length)} open. ${numberWord(laterRooms.length)} waiting. at least one you won't find here.`}
      />
      <section className="wrap">
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {rooms.map((r) => (
            <RoomTile key={r.slug} r={r} />
          ))}
        </div>
        <div className="mt-16">
          <Label>
            <Dual i="Opening later" c="locked for now" />
          </Label>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {laterRooms.map((n) => (
              <div key={n} className="flex flex-col gap-2 rounded-xl border border-dashed border-ink-3 p-6 text-ink-3">
                <span className="t-h2">{n}</span>
                <span className="t-label">Opening later</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
