import type { ElementType } from "react";

/**
 * Two readings of the same line. Renders both; CSS shows the one that matches
 * the current mode, so there is no flash and it works without JavaScript.
 * Short lines get `data-decode`, which makes them scramble when the reading
 * switches.
 */
export function Dual({
  i,
  c,
  as: Tag = "span",
  className,
  decode = true,
}: {
  i: React.ReactNode;
  c: React.ReactNode;
  as?: ElementType;
  className?: string;
  decode?: boolean;
}) {
  const canDecode = decode && typeof c === "string";
  const canDecodeI = decode && typeof i === "string";
  return (
    <>
      <Tag className={["i-only", className].filter(Boolean).join(" ")} {...(canDecodeI ? { "data-decode": "" } : {})}>
        {i}
      </Tag>
      <Tag className={["c-only", className].filter(Boolean).join(" ")} {...(canDecode ? { "data-decode": "" } : {})}>
        {c}
      </Tag>
    </>
  );
}

/** Show children only in one reading. */
export function OnlyIn({ mode, children, className }: { mode: "ifeanyi" | "cipher"; children: React.ReactNode; className?: string }) {
  return <div className={[mode === "cipher" ? "c-only" : "i-only", className].filter(Boolean).join(" ")}>{children}</div>;
}
