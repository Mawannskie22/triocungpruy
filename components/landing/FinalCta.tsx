import Link from "next/link";

export function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="cta-title">
      <div className="container final-cta-inner">
        <div>
          <span className="eyebrow">SEKARANG GILIRANMU</span>
          <h2 id="cta-title">Ada masalah di lingkunganmu? Laporkan sekarang.</h2>
        </div>
        <div className="cta-actions">
          <Link href="/lapor" className="button button-dark">
            Lapor Sekarang <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/status" className="cta-link">
            Cek Status Laporan
          </Link>
        </div>
      </div>
    </section>
  );
}
