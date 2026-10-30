// Uli-inspired linework: thin lines, mostly empty space, one camwood mark.
// To be refined with reference to real uli work.

export function UliSpiral({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-ink-3 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-current opacity-70" />
      <span className="size-1 rounded-full bg-current" />
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M14 14C14 11 17 11 17 14C17 18 11 18 11 14C11 8 21 8 21 14C21 21 7 21 7 14C7 4 25 4 25 14"
          stroke="var(--c-camwood)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="size-1 rounded-full bg-current" />
      <span className="h-px flex-1 bg-current opacity-70" />
    </div>
  );
}

export function UliWave({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-8 w-full text-ink-3 ${className}`}
      viewBox="0 0 1280 32"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 16C40 6 80 26 120 16S200 6 240 16S320 26 360 16S440 6 480 16S560 26 600 16S680 6 720 16S800 26 840 16S920 6 960 16S1040 26 1080 16S1160 6 1200 16S1240 22 1280 16"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="300" cy="4" r="2" fill="var(--c-camwood)" />
      <circle cx="660" cy="28" r="2" fill="currentColor" />
      <circle cx="1020" cy="4" r="2" fill="currentColor" />
    </svg>
  );
}

export function UliCrescents({ className = "" }: { className?: string }) {
  return (
    <svg className={`h-6 w-full text-ink-3 ${className}`} viewBox="0 0 360 24" fill="none" aria-hidden="true">
      {[30, 110, 190, 270, 350].map((x, i) => (
        <path
          key={x}
          d={`M${x - 10} 10A10 10 0 0 0 ${x + 10} 10`}
          stroke={i === 2 ? "var(--c-camwood)" : "currentColor"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
      {[70, 150, 230, 310].map((x) => (
        <circle key={x} cx={x} cy="9" r="1.6" fill="currentColor" />
      ))}
    </svg>
  );
}
