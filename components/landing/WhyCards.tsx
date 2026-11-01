const reasons = [
  {
    number: "01",
    title: "Lapor, lalu bertanya-tanya?",
    text: "Setiap laporan punya nomor tiket dan perkembangan yang bisa kamu lihat lagi.",
  },
  {
    number: "02",
    title: "Izin seperlunya saja.",
    text: "Foto boleh dilewati. Lokasi bisa ditulis manual tanpa memberi akses GPS.",
  },
  {
    number: "03",
    title: "Selesai harus terasa nyata.",
    text: "Warga dapat memberi konfirmasi saat masalah di lingkungannya sudah ditangani.",
  },
];

export function WhyCards() {
  return (
    <section className="section section-light why-section" id="tentang" aria-labelledby="why-title">
      <div className="container why-layout">
        <div className="why-intro" data-reveal>
          <span className="eyebrow">KENAPA LAPOR BALIK?</span>
          <h2 id="why-title">Kota yang lebih baik dimulai dari laporan yang didengar.</h2>
          <p>
            Masalah kecil di sekitar kita pantas mendapat perhatian yang jelas. Lapor Balik membantu
            kamu menyuarakannya dan menyimpan jejak tindak lanjutnya.
          </p>
          <span className="why-signature" aria-hidden="true">
            Dari warga. Untuk kota.
          </span>
        </div>
        <div className="reason-list">
          {reasons.map((item) => (
            <article className="reason-row" key={item.number} data-reveal>
              <span className="reason-index">{item.number}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <span className="reason-spark" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
