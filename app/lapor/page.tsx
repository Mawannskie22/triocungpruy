import type { Metadata } from "next";
import { ReportForm } from "@/components/report/ReportForm";

export const metadata: Metadata = { title: "Buat Laporan | Lapor Balik" };

export default function ReportPage() {
  return (
    <main className="inner-page">
      <div className="container page-intro">
        <span className="eyebrow">BUAT LAPORAN</span>
        <h1>Mulai dari ceritamu.</h1>
        <p>
          Tiga langkah untuk menyampaikan masalah di sekitar kamu. Tanpa login, tanpa izin yang
          tidak perlu.
        </p>
      </div>
      <ReportForm />
    </main>
  );
}
