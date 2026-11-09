import type { Metadata } from "next";
import { StatusLookup } from "@/components/status/StatusLookup";

export const metadata: Metadata = { title: "Cek Status | Lapor Balik" };

export default function StatusPage() {
  return (
    <main className="inner-page">
      <div className="container page-intro">
        <span className="eyebrow">PANTAU LAPORAN</span>
        <h1>Setiap laporan punya jejak.</h1>
        <p>Masukkan nomor tiket untuk melihat laporan yang tersimpan di browser perangkat ini.</p>
      </div>
      <StatusLookup />
    </main>
  );
}
