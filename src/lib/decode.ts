// The decode effect: text scrambles through cipher characters and resolves
// left to right. Used when switching readings and when revealing secrets.

const GLYPHS = "!<>-_\\/[]{}=+*^?#%&@$░▒◇";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Animate `el`'s text from noise to `final`. Resolves when done. */
export function scramble(el: HTMLElement, final: string, duration = 600): Promise<void> {
  if (prefersReducedMotion() || !final) {
    el.textContent = final;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const start = performance.now();
    const chars = [...final];
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const settled = Math.floor(p * chars.length);
      let out = "";
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        if (i < settled || ch === " " || ch === "\n") out += ch;
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(tick);
      else {
        el.textContent = final;
        resolve();
      }
    };
    requestAnimationFrame(tick);
  });
}

/** Decode every visible [data-decode] element in the viewport. */
export function decodeVisible(duration = 600) {
  if (prefersReducedMotion()) return;
  const vh = window.innerHeight;
  document.querySelectorAll<HTMLElement>("[data-decode]").forEach((el) => {
    if (el.offsetParent === null) return; // hidden reading
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return; // off screen: no need
    const final = el.dataset.text ?? el.textContent ?? "";
    el.dataset.text = final;
    void scramble(el, final, duration);
  });
}
