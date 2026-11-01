import Link from "next/link";

export function GoalsList() {
  return (
    <section className="section mission-section" aria-labelledby="mission-title">
      <div className="container mission-grid">
        <div>
          <span className="eyebrow">TUJUAN KAMI</span>
          <h2 id="mission-title">Dari suara warga, jadi langkah yang terlihat.</h2>
          <p>
            Laporan yang mudah dibuat, perkembangan yang mudah dicari, dan kesempatan untuk memberi
            tanggapan.
          </p>
          <Link className="text-link" href="/lapor">
            Buat laporan pertama kamu <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="mission-list">
          <div>
            <span>01</span>
            <strong>Mudah dilaporkan</strong>
            <p>Tiga langkah sederhana, tanpa akun.</p>
          </div>
          <div>
            <span>02</span>
            <strong>Jelas perkembangannya</strong>
            <p>Simpan tiket untuk melihat status laporan.</p>
          </div>
          <div>
            <span>03</span>
            <strong>Ada suara warga</strong>
            <p>Beri konfirmasi saat laporan selesai.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
