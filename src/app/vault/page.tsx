import type { Metadata } from "next";
import { Vault } from "@/components/Vault";

export const metadata: Metadata = { title: "/vault", robots: { index: false, follow: false } };

export default function VaultPage() {
  return (
    <section className="wrap">
      <Vault />
    </section>
  );
}
