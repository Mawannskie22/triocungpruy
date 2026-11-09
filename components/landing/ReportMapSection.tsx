"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ReportMapCanvas } from "@/components/map/ReportMapCanvas";
import { MapGlyph } from "@/components/map/map-icons";
import { categories, getCategoryLabel } from "@/data/categories";
import { getStatusLabel } from "@/data/report-status";
import { ensureMapDemoReports } from "@/lib/demo-reports";
import { readReports } from "@/lib/reports";
import type { Report, ReportCategory } from "@/types/report";

type Filter = ReportCategory | "semua";

export function ReportMapSection() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<Filter>("semua");
  const [selectedId, setSelectedId] = useState("");
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    const result = ensureMapDemoReports();
    setReports(result.reports);
    setStorageAvailable(result.storageAvailable);
    const sync = () => setReports(readReports());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const located = reports.filter((report) => report.coordinates);
  const visible =
    filter === "semua" ? located : located.filter((report) => report.category === filter);
  const selected = visible.find((report) => report.id === selectedId);

  return (
    <section className="report-map-section" id="peta-laporan" aria-labelledby="report-map-title">
      <div className="container">
        <div className="report-map-heading">
          <div>
            <span className="eyebrow">PETA LAPORAN</span>
            <h2 id="report-map-title">Jakarta sedang bersuara.</h2>
            <p>Setiap tanda menunjukkan kejadian yang dilaporkan di titik itu.</p>
          </div>
          <div className="report-map-count">
            <strong>{visible.length}</strong>
            <span>titik ditampilkan</span>
          </div>
        </div>

        <div className="report-map-filters" role="group" aria-label="Saring kategori laporan">
          <button
            type="button"
            className={filter === "semua" ? "active" : ""}
            onClick={() => {
              setFilter("semua");
              setSelectedId("");
            }}
            aria-pressed={filter === "semua"}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={filter === category.id ? "active" : ""}
              onClick={() => {
                setFilter(category.id);
                setSelectedId("");
              }}
              aria-pressed={filter === category.id}
            >
              <MapGlyph category={category.id} /> {category.label}
            </button>
          ))}
        </div>

        <div className="report-map-layout">
          <div className="report-map-stage">
            <ReportMapCanvas mode="browse" reports={visible} onSelect={setSelectedId} />
            <span className="report-map-hint">Geser peta · Pakai tombol +/− untuk memperbesar</span>
          </div>
          <aside className="report-map-sidebar" aria-live="polite">
            {selected ? (
              <div className="report-map-detail">
                <span className="report-map-detail-kicker">LAPORAN DI TITIK INI</span>
                <div className="report-map-detail-icon">
                  <MapGlyph category={selected.category} />
                </div>
                <h3>{getCategoryLabel(selected.category)}</h3>
                <p>{selected.description}</p>
                <dl>
                  <div>
                    <dt>Lokasi</dt>
                    <dd>{selected.address}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{getStatusLabel(selected.status)}</dd>
                  </div>
                </dl>
                <Link href={`/status?ticket=${encodeURIComponent(selected.id)}`}>
                  Lihat perkembangan <span aria-hidden="true">↗</span>
                </Link>
              </div>
            ) : (
              <div className="report-map-intro">
                <span className="report-map-detail-kicker">JELAJAHI LAPORAN</span>
                <strong>Pilih tanda di peta.</strong>
                <p>Lihat apa yang terjadi, di mana lokasinya, dan sampai mana penanganannya.</p>
              </div>
            )}
            <div className="report-map-recent">
              <span>Daftar laporan</span>
              <div className="report-map-recent-list">
                {visible.map((report) => (
                  <button
                    key={report.id}
                    type="button"
                    className={selectedId === report.id ? "active" : ""}
                    onClick={() => setSelectedId(report.id)}
                  >
                    <MapGlyph category={report.category} />
                    <span>
                      <strong>{getCategoryLabel(report.category)}</strong>
                      <small>{report.address}</small>
                    </span>
                  </button>
                ))}
                {visible.length === 0 && (
                  <p>Belum ada laporan dengan titik lokasi pada kategori ini.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
        <p className="report-map-disclaimer">
          Data simulasi tersimpan di browser ini. Titik laporan contoh adalah perkiraan lokasi,
          bukan koordinat kejadian terverifikasi.
          {!storageAvailable &&
            " Penyimpanan browser tidak tersedia; data contoh tidak dapat disimpan."}
        </p>
      </div>
    </section>
  );
}
