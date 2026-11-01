import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand footer-brand">
            <span className="brand-mark" aria-hidden="true">
              L<span>↗</span>
            </span>
            <span>
              LAPOR<span className="brand-accent">BALIK</span>
            </span>
          </Link>
          <p>Ruang untuk suara warga dan kota yang lebih tanggap.</p>
        </div>
        <div>
          <h3>Jelajahi</h3>
          <Link href="/">Beranda</Link>
          <Link href="/#layanan">Layanan</Link>
          <Link href="/#cara-melapor">Cara Melapor</Link>
          <Link href="/status">Cek Status</Link>
        </div>
        <div>
          <h3>Bantuan</h3>
          <a href="mailto:halo@laporbalik.example">halo@laporbalik.example</a>
          <p>Prototipe untuk keperluan demo. Laporan tersimpan hanya di browser perangkat ini.</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Lapor Balik</span>
        <span>Data simulasi untuk keperluan demo</span>
      </div>
    </footer>
  );
}
