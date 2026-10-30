import Link from "next/link";
import type { Status } from "@/lib/types";
import { liveStatuses, statusLabel } from "@/lib/labels";

/** The Cipher glyph: a split diamond. One half open, one half decoded. */
export function Glyph({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" aria-hidden="true" className={className}>
      <path d="M48 8L88 48L48 88L8 48Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
      <path d="M48 8L8 48L48 88Z" fill="var(--c-camwood)" />
    </svg>
  );
}

export function Label({ children, className = "", accent = false }: { children: React.ReactNode; className?: string; accent?: boolean }) {
  return <p className={`t-label ${accent ? "text-camwood" : "text-ink-2"} ${className}`}>{children}</p>;
}

export function Chip({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "on" | "accent" }) {
  const styles =
    variant === "on"
      ? "bg-ink text-page border-ink"
      : variant === "accent"
        ? "bg-camwood-soft text-camwood border-transparent"
        : "border-rule text-ink-2";
  return <span className={`t-label inline-flex items-center rounded-full border px-3 py-1 !text-[11px] ${styles}`}>{children}</span>;
}

export function StatusChip({ status }: { status: Status }) {
  return <Chip variant={liveStatuses.includes(status) ? "accent" : "default"}>{statusLabel[status]}</Chip>;
}

type BtnProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "quiet";
  external?: boolean;
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", external, className = "" }: BtnProps) {
  const cls = `${buttonClass(variant)} ${className}`;
  if (external)
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function buttonClass(variant: "primary" | "secondary" | "quiet" = "primary") {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-medium leading-none transition-colors cursor-pointer disabled:opacity-50";
  if (variant === "primary") return `${base} bg-camwood text-on-accent hover:brightness-110`;
  if (variant === "secondary") return `${base} border border-ink text-ink hover:bg-ink hover:text-page`;
  return `${base} border border-rule text-ink hover:border-ink`;
}

/** Small camwood dot + status words, used on room tiles. */
export function LiveDot({ live, children }: { live: boolean; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`size-1.5 rounded-full ${live ? "bg-camwood" : "bg-ink-3"}`} aria-hidden="true" />
      <span className={`t-label !text-[11px] ${live ? "text-ink" : "text-ink-3"}`}>{children}</span>
    </span>
  );
}

/** A dashed "not yet written" panel for empty rooms. */
export function EmptyState({ label = "Not yet written", title, children }: { label?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-ink-3 px-6 py-16 text-center">
      <Label>{label}</Label>
      <h2 className="t-h2 max-w-xl">{title}</h2>
      {children && <div className="max-w-md text-ink-2">{children}</div>}
    </div>
  );
}
