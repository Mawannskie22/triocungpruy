import type { Metadata } from "next";
import { OfficerDemo } from "@/components/officer/OfficerDemo";

export const metadata: Metadata = {
  title: "Panel Petugas Demo | Lapor Balik",
  robots: { index: false, follow: false },
};

export default function OfficerDemoPage() {
  return (
    <main className="officer-page">
      <OfficerDemo />
    </main>
  );
}
