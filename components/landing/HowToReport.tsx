import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Ceritakan masalah",
    text: "Tulis apa yang terjadi. Kalau ada foto, tambahkan.",
  },
  { number: "02", title: "Pilih kategori", text: "Pilih jenis masalah yang paling sesuai." },
  {
    number: "03",
    title: "Tandai lokasi",
    text: "Isi alamat atau gunakan lokasi perangkat. Setelah itu, simpan nomor tiketmu.",
  },
];

export function HowToReport() {
  return (
    <section className="section how-section" id="cara-melapor" aria-labelledby="how-title">
      <div className="container">
        <div className="process-heading" data-reveal>
          <span className="eyebrow">CARA MELAPOR</span>
          <h2 id="how-title">
            Buat laporan dalam <span>tiga langkah.</span>
          </h2>
          <p>Ceritakan masalahnya, pilih kategori, lalu tandai lokasi.</p>
        </div>
        <ol className="process-rail">
          {steps.map((step) => (
            <li className="process-step" key={step.number} data-reveal>
              <span className="process-number">{step.number}</span>
              <span className="process-node" aria-hidden="true" />
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="process-footer" data-reveal>
          <p>
            Lokasi hanya dipakai untuk menandai titik laporan. Kamu bisa mengisinya secara manual.
          </p>
          <Link href="/lapor" className="button button-primary">
            Mulai Lapor <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
