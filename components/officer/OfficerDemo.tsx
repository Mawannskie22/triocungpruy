"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategoryLabel } from "@/data/categories";
import { getNextStatus, getStatusLabel, reportStages } from "@/data/report-status";
import { advanceDemoStatus, readReports } from "@/lib/reports";
import type { Report, ReportStatus } from "@/types/report";

type Filter = "semua" | ReportStatus;
const MAX_EVIDENCE_SIZE = 1_000_000;
const EVIDENCE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function formatTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Waktu tidak tercatat"
    : date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

export function OfficerDemo() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<Filter>("semua");
  const [selectedId, setSelectedId] = useState("");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [note, setNote] = useState("");
  const [evidence, setEvidence] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    function sync() {
      const current = readReports();
      setReports(current);
      setSelectedId((id) =>
        current.some((report) => report.id === id) ? id : (current[0]?.id ?? ""),
      );
      setLoaded(true);
    }
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const visibleReports =
    filter === "semua" ? reports : reports.filter((report) => report.status === filter);
  const selected = reports.find((report) => report.id === selectedId);
  const nextStatus = selected ? getNextStatus(selected.status) : null;

  function selectReport(id: string) {
    setSelectedId(id);
    setMobileDetailOpen(true);
    setNote("");
    setEvidence("");
    setError("");
    setMessage("");
  }

  function chooseEvidence(file?: File) {
    if (!file) {
      setEvidence("");
      return;
    }
    if (!EVIDENCE_TYPES.includes(file.type) || file.size > MAX_EVIDENCE_SIZE) {
      setError("Pilih foto JPG, PNG, atau WebP dengan ukuran maksimal 1 MB.");
      setEvidence("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setEvidence(reader.result);
        setError("");
      }
    };
    reader.onerror = () => setError("Foto gagal dibaca. Coba pilih file lain.");
    reader.readAsDataURL(file);
  }

  function saveUpdate() {
    if (!selected || !nextStatus) return;
    const result = advanceDemoStatus(
      selected.id,
      note,
      nextStatus === "selesai" ? evidence : undefined,
    );
    if (!result.ok) {
      setError(result.error);
      setMessage("");
      return;
    }
    setReports(readReports());
    setNote("");
    setEvidence("");
    setError("");
    setMessage(`Tahap ${getStatusLabel(result.data.status).toLowerCase()} tersimpan.`);
  }

  return (
    <div className="officer-frame">
      <aside className="officer-sidebar" aria-label="Ruang kerja petugas demo">
        <div className="officer-sidebar-brand">
          LAPOR<span>BALIK</span>
        </div>
        <p>Ruang kerja</p>
        <strong>Petugas demo</strong>
        <span>Data dari browser ini</span>
        <Link href="/status">Lihat halaman warga ↗</Link>
      </aside>
      <section className="officer-sheet">
        <div className="officer-heading">
          <div>
            <span className="officer-context">SIMULASI PETUGAS</span>
            <h1>Laporan masuk</h1>
            <p>Periksa laporan warga dan catat setiap tindak lanjut.</p>
          </div>
          <Link href="/lapor" className="officer-text-link">
            Buat laporan uji ↗
          </Link>
        </div>

        <div className="officer-counts" aria-label="Jumlah laporan menurut tahap">
          <div>
            <strong>{reports.length}</strong>
            <span>Semua laporan</span>
          </div>
          {reportStages.map((stage) => (
            <div key={stage.id}>
              <strong>{reports.filter((report) => report.status === stage.id).length}</strong>
              <span>{stage.label}</span>
            </div>
          ))}
        </div>

        <div className={`officer-workspace ${mobileDetailOpen ? "detail-open" : ""}`}>
          <div className="officer-queue">
            <div className="officer-section-title">
              <h2>Daftar laporan</h2>
              <span>{visibleReports.length} ditampilkan</span>
            </div>
            <label className="officer-filter-label" htmlFor="officer-filter">
              Tampilkan tahap
            </label>
            <select
              id="officer-filter"
              value={filter}
              onChange={(event) => {
                setFilter(event.target.value as Filter);
                setMobileDetailOpen(false);
              }}
            >
              <option value="semua">Semua tahap</option>
              {reportStages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.label}
                </option>
              ))}
            </select>
            {!loaded ? (
              <p className="officer-empty">Memuat laporan dari browser...</p>
            ) : visibleReports.length === 0 ? (
              <div className="officer-empty-state">
                <strong>{reports.length === 0 ? "Belum ada laporan" : "Tidak ada laporan"}</strong>
                <p>
                  {reports.length === 0
                    ? "Buat satu laporan uji di browser ini untuk mencoba alur petugas."
                    : "Coba pilih tahap lain untuk melihat laporan yang tersedia."}
                </p>
                {reports.length === 0 && <Link href="/lapor">Buat laporan uji ↗</Link>}
              </div>
            ) : (
              <ul className="officer-report-list">
                {visibleReports.map((report) => (
                  <li key={report.id}>
                    <button
                      type="button"
                      className={`officer-report-row ${selectedId === report.id ? "selected" : ""}`}
                      onClick={() => selectReport(report.id)}
                      aria-pressed={selectedId === report.id}
                    >
                      <span className="officer-report-main">
                        <strong>{report.id}</strong>
                        <span>
                          {getCategoryLabel(report.category)} · {report.address}
                        </span>
                      </span>
                      <span className="officer-report-status">{getStatusLabel(report.status)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="officer-detail">
            <button
              type="button"
              className="officer-mobile-back"
              onClick={() => setMobileDetailOpen(false)}
            >
              ← Semua laporan
            </button>
            <div className="officer-section-title">
              <h2>Detail laporan</h2>
            </div>
            {!selected ? (
              <p className="officer-empty">
                Pilih laporan untuk melihat detail dan mencatat tindak lanjut.
              </p>
            ) : (
              <>
                <div className="officer-detail-head">
                  <strong>{selected.id}</strong>
                  <span className={`status-badge status-${selected.status}`}>
                    {getStatusLabel(selected.status)}
                  </span>
                </div>
                <dl className="officer-facts">
                  <div>
                    <dt>Kategori</dt>
                    <dd>{getCategoryLabel(selected.category)}</dd>
                  </div>
                  <div>
                    <dt>Dibuat</dt>
                    <dd>{formatTime(selected.createdAt)}</dd>
                  </div>
                  <div>
                    <dt>Lokasi</dt>
                    <dd>{selected.address}</dd>
                  </div>
                  <div>
                    <dt>Cerita warga</dt>
                    <dd>{selected.description}</dd>
                  </div>
                </dl>
                {selected.photo && (
                  <div className="officer-attachment">
                    <span>Foto laporan</span>
                    <Image
                      src={selected.photo}
                      alt="Foto pendukung laporan warga"
                      width={720}
                      height={450}
                      unoptimized
                    />
                  </div>
                )}
                {nextStatus ? (
                  <div className="officer-update">
                    <h3>Tahap berikutnya: {getStatusLabel(nextStatus)}</h3>
                    <label htmlFor="officer-note">Catatan tindak lanjut</label>
                    <textarea
                      id="officer-note"
                      rows={3}
                      maxLength={300}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Contoh: Lokasi dan isi laporan sudah diperiksa."
                    />
                    <small>Wajib 5–300 karakter. Catatan ini terlihat oleh warga.</small>
                    {nextStatus === "selesai" && (
                      <>
                        <label htmlFor="officer-evidence">Foto bukti penyelesaian (opsional)</label>
                        <input
                          id="officer-evidence"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(event) => chooseEvidence(event.target.files?.[0])}
                        />
                        <small>
                          JPG, PNG, atau WebP, maksimal 1 MB. Gunakan foto uji untuk demo.
                        </small>
                        {evidence && (
                          <Image
                            src={evidence}
                            alt="Pratinjau bukti penyelesaian"
                            width={720}
                            height={450}
                            unoptimized
                          />
                        )}
                      </>
                    )}
                    {error && (
                      <p className="form-error" role="alert">
                        {error}
                      </p>
                    )}
                    <button type="button" className="button button-primary" onClick={saveUpdate}>
                      Simpan tahap {getStatusLabel(nextStatus).toLowerCase()}
                    </button>
                  </div>
                ) : (
                  <div className="officer-update">
                    <p>
                      Tahap terakhir sudah dicatat. Warga dapat melihat bukti dan memberi
                      konfirmasi.
                    </p>
                    {selected.resolutionPhoto && (
                      <Image
                        src={selected.resolutionPhoto}
                        alt="Bukti penyelesaian laporan"
                        width={720}
                        height={450}
                        unoptimized
                      />
                    )}
                  </div>
                )}
                {message && (
                  <p className="officer-success" role="status">
                    {message}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        <p className="officer-disclaimer">
          Panel ini hanya untuk simulasi. Data disimpan di browser yang sama dan belum dikirim ke
          instansi.
        </p>
      </section>
    </div>
  );
}
