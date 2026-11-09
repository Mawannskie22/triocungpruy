"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCategoryLabel } from "@/data/categories";
import { getNextStatus, getStatusLabel, reportStages } from "@/data/report-status";
import { loadOrSeedReports } from "@/lib/demo-reports";
import { advanceDemoStatus } from "@/lib/reports";
import type { Report, ReportStatus } from "@/types/report";

type Filter = "semua" | ReportStatus;

const MAX_EVIDENCE_SIZE = 1_000_000;
const EVIDENCE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PAGE_SIZE = 10;

function formatTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Waktu tidak tercatat"
    : date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

function normalize(value: string): string {
  return value.toLocaleLowerCase("id-ID");
}

export function TicketWorkspace() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<Filter>("semua");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [note, setNote] = useState("");
  const [evidence, setEvidence] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    function sync() {
      const current = loadOrSeedReports();
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

  const filters = useMemo(
    () => [
      { id: "semua" as Filter, label: "Semua", count: reports.length },
      ...reportStages.map((stage) => ({
        id: stage.id as Filter,
        label: stage.label,
        count: reports.filter((report) => report.status === stage.id).length,
      })),
    ],
    [reports],
  );

  const visibleReports = useMemo(() => {
    const keyword = normalize(query.trim());
    return reports.filter((report) => {
      if (filter !== "semua" && report.status !== filter) return false;
      if (!keyword) return true;
      return (
        normalize(report.id).includes(keyword) ||
        normalize(getCategoryLabel(report.category)).includes(keyword) ||
        normalize(report.address).includes(keyword) ||
        normalize(report.description).includes(keyword)
      );
    });
  }, [reports, filter, query]);

  const pageCount = Math.max(1, Math.ceil(visibleReports.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pagedReports = useMemo(
    () => visibleReports.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [visibleReports, currentPage],
  );
  const rangeStart = visibleReports.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, visibleReports.length);

  useEffect(() => {
    setPage(1);
  }, [filter, query]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  useEffect(() => {
    if (pagedReports.length === 0) {
      setSelectedId("");
      return;
    }
    if (!pagedReports.some((report) => report.id === selectedId)) {
      setSelectedId(pagedReports[0].id);
    }
  }, [pagedReports, selectedId]);

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
    if (nextStatus === "selesai" && !evidence) {
      setError("Foto bukti penyelesaian wajib diunggah.");
      setMessage("");
      return;
    }
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
    setReports(loadOrSeedReports());
    setNote("");
    setEvidence("");
    setError("");
    setMessage(`Tahap ${getStatusLabel(result.data.status).toLowerCase()} tersimpan.`);
  }

  return (
    <div>
      <div className="officer-heading">
        <div>
          <span className="officer-context">DAFTAR TIKET</span>
          <h1>Laporan masuk</h1>
          <p>Periksa laporan warga dan catat setiap tindak lanjut.</p>
        </div>
        <Link href="/lapor" className="officer-text-link">
          Buat laporan uji ↗
        </Link>
      </div>

      <div className="officer-toolbar">
        <input
          type="search"
          className="officer-search"
          placeholder="Cari nomor tiket, kategori, atau alamat..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Cari laporan"
        />
        <div className="officer-filter-bar" role="group" aria-label="Filter status">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={filter === item.id ? "active" : ""}
              aria-pressed={filter === item.id}
              onClick={() => {
                setFilter(item.id);
                setMobileDetailOpen(false);
              }}
            >
              {item.label}
              <span>{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`officer-workspace ${mobileDetailOpen ? "detail-open" : ""}`}>
        <div className="officer-queue">
          <div className="officer-section-title">
            <h2>Daftar laporan</h2>
            <span>{visibleReports.length} laporan</span>
          </div>
          {!loaded ? (
            <p className="officer-empty">Memuat laporan dari browser...</p>
          ) : visibleReports.length === 0 ? (
            <div className="officer-empty-state">
              <strong>{reports.length === 0 ? "Belum ada laporan" : "Tidak ada laporan"}</strong>
              <p>
                {reports.length === 0
                  ? "Buat satu laporan uji di browser ini untuk mencoba alur petugas."
                  : "Coba ubah kata kunci pencarian atau pilih tahap lain."}
              </p>
              {reports.length === 0 && <Link href="/lapor">Buat laporan uji ↗</Link>}
            </div>
          ) : (
            <>
              <ul className="officer-report-list">
                {pagedReports.map((report) => (
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
              <div className="officer-pagination">
                <span>
                  Menampilkan {rangeStart}–{rangeEnd} dari {visibleReports.length}
                </span>
                <div className="officer-pagination-controls">
                  <button
                    type="button"
                    onClick={() => setPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Halaman sebelumnya"
                  >
                    ←
                  </button>
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                    <button
                      key={number}
                      type="button"
                      className={number === currentPage ? "active" : ""}
                      aria-current={number === currentPage ? "page" : undefined}
                      onClick={() => setPage(number)}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPage(currentPage + 1)}
                    disabled={currentPage === pageCount}
                    aria-label="Halaman berikutnya"
                  >
                    →
                  </button>
                </div>
              </div>
            </>
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
                    alt="Foto tempat kejadian dari warga"
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
                      <label htmlFor="officer-evidence">
                        Foto bukti penyelesaian <span>*</span>
                      </label>
                      <input
                        id="officer-evidence"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => chooseEvidence(event.target.files?.[0])}
                      />
                      <small>
                        Wajib diunggah. JPG, PNG, atau WebP, maksimal 1 MB. Gunakan foto uji untuk
                        demo.
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
                    Tahap terakhir sudah dicatat. Warga dapat melihat bukti dan memberi konfirmasi.
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
    </div>
  );
}
