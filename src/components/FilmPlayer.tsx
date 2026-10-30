"use client";

import { useState } from "react";

/**
 * A light YouTube player: shows the thumbnail and only loads YouTube when
 * someone presses play, so pages stay fast. With no youtubeId it shows an
 * "in production" frame.
 */
export function FilmPlayer({ youtubeId, title, small = false }: { youtubeId?: string; title: string; small?: boolean }) {
  const [playing, setPlaying] = useState(false);

  if (!youtubeId)
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-xl bg-sunken">
        <span className={`flex items-center justify-center rounded-full bg-camwood text-on-accent ${small ? "size-11" : "size-16"}`} aria-hidden="true">
          ▶
        </span>
        <span className="t-label text-ink-2">In production</span>
      </div>
    );

  if (playing)
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          className="size-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play film: ${title}`}
      className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-xl bg-sunken"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className={`flex items-center justify-center rounded-full bg-camwood text-on-accent shadow-lg ${small ? "size-11" : "size-16"}`}>▶</span>
      </span>
    </button>
  );
}
