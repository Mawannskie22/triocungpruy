import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Petugas | Lapor Balik",
  robots: { index: false, follow: false },
};

export default function OfficerDashboardPage() {
  return (
    <div className="officer-heading">
      <div>
        <span className="officer-context">DASHBOARD PETUGAS</span>
        <h1>Ringkasan laporan</h1>
        <p>Chart dan statistik akan diisi pada langkah berikutnya.</p>
      </div>
    </div>
  );
}
