import Link from "next/link";

const services = [
  {
    number: "01 / SUARAKAN",
    title: "Lapor masalah",
    description:
      "Dari jalan rusak sampai lampu mati, ceritakan apa yang kamu temui dan tandai lokasinya.",
    meta: "CERITA  ·  KATEGORI  ·  LOKASI",
    href: "/lapor",
    action: "Mulai melapor",
  },
  {
    number: "02 / IKUTI",
    title: "Cek status",
    description: "Satu nomor tiket untuk melihat jejak laporan yang tersimpan di perangkat ini.",
    meta: "TIKET  ·  PERKEMBANGAN  ·  KONFIRMASI",
    href: "/status",
    action: "Lihat status",
  },
];

export function ServiceCards() {
  return (
    <section
      className="section section-light services-section"
      id="layanan"
      aria-labelledby="services-title"
    >
      <div className="container">
        <div className="services-heading" data-reveal>
          <span className="eyebrow">LAYANAN</span>
          <h2 id="services-title">Satu tempat untuk peduli pada kotamu.</h2>
          <p>Pilih langkah yang kamu butuhkan sekarang.</p>
        </div>
        <div className="service-list">
          {services.map((service) => (
            <Link href={service.href} className="service-row" key={service.href} data-reveal>
              <span className="service-row-index">{service.number}</span>
              <div className="service-row-content">
                <h3>{service.title}</h3>
                <span>{service.description}</span>
                <small>{service.meta}</small>
              </div>
              <span className="service-row-action">
                {service.action} <span aria-hidden="true">↗</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
