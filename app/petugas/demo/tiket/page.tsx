import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tiket Petugas | Lapor Balik",
  robots: { index: false, follow: false },
};

export default function OfficerTicketsPage() {
  return (
    <div className="officer-heading">
      <div>
        <span className="officer-context">DAFTAR TIKET</span>
        <h1>Laporan masuk</h1>
        <p>Daftar tiket dan tindak lanjut akan diisi pada langkah berikutnya.</p>
      </div>
    </div>
  );
}
