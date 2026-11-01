"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getCategoryLabel } from "@/data/categories";
import { advanceDemoStatus, confirmReport, findReport } from "@/lib/reports";
import type { Report } from "@/types/report";

function Lookup() {
  const searchParams = useSearchParams();
  const initialTicket = searchParams.get("ticket") ?? "";
  const [ticket, setTicket] = useState(initialTicket);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");

  function search() {
    const found = findReport(ticket);
    setReport(found ?? null);
    setError(
      found
        ? ""
        : "Nomor tiket tidak ditemukan di browser ini. Periksa kembali nomor tiket atau gunakan perangkat tempat kamu melapor.",
    );
  }

  function advance() {
    if (!report) return;
    const result = advanceDemoStatus(report.id);
    if (result.ok) setReport(result.data);
    else setError(result.error);
  }

  function confirm() {
    if (!report) return;
    const result = confirmReport(report.id);
    if (result.ok) setReport(result.data);
    else setError(result.error);
  }

  const stages = ["diterima", "diproses", "selesai"] as const;
  return (
    <div className="container status-shell">
      <div className="lookup-panel">
        <label className="field-label" htmlFor="ticket">
          Nomor tiket laporan
        </label>
        <div className="lookup-row">
          <input
            id="ticket"
            value={ticket}
            onChange={(event) => setTicket(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") search();
            }}
            placeholder="LB-YYMMDD-XXXX"
          />
          <button type="button" className="button button-primary" onClick={search}>
            Cari Laporan <span aria-hidden="true">↗</span>
          </button>
        </div>
        <p className="field-hint">
          Contoh format: LB-261024-A1B2. Tiket hanya dapat dicari di browser tempat laporan dibuat.
        </p>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </div>
      {report && (
        <article className="result-panel">
          <div className="result-top">
            <div>
              <span className="eyebrow">DATA SIMULASI</span>
              <h2>{report.id}</h2>
            </div>
            <span className={`status-badge status-${report.status}`}>{report.status}</span>
          </div>
          <div className="report-details">
            <div>
              <span>Kategori</span>
              <strong>{getCategoryLabel(report.category)}</strong>
            </div>
            <div>
              <span>Dibuat</span>
              <strong>
                {new Date(report.createdAt).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </strong>
            </div>
            <div>
              <span>Lokasi</span>
              <strong>{report.address}</strong>
            </div>
            <div className="wide">
              <span>Deskripsi</span>
              <strong>{report.description}</strong>
            </div>
          </div>
          <h3>Perkembangan laporan</h3>
          <ol className="timeline">
            {stages.map((stage, index) => (
              <li key={stage} className={stages.indexOf(report.status) >= index ? "done" : ""}>
                <span className="timeline-dot" />
                <div>
                  <strong>
                    {stage === "diterima"
                      ? "Laporan diterima"
                      : stage === "diproses"
                        ? "Sedang diproses"
                        : "Selesai"}
                  </strong>
                  <p>
                    {stage === "diterima"
                      ? "Laporan tersimpan di browser ini."
                      : stage === "diproses"
                        ? "Tahap tindak lanjut dalam simulasi."
                        : "Tahap selesai dalam simulasi."}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="result-actions">
            {report.status !== "selesai" && (
              <button type="button" className="button button-primary" onClick={advance}>
                Simulasikan tahap berikutnya →
              </button>
            )}
            {report.status === "selesai" && !report.confirmed && (
              <button type="button" className="button button-primary" onClick={confirm}>
                Konfirmasi sudah beres ✓
              </button>
            )}
            {report.confirmed && (
              <p className="confirmed-note">✓ Kamu sudah mengonfirmasi laporan ini.</p>
            )}
          </div>
          <p className="demo-note">
            Perubahan status di atas adalah simulasi yang kamu jalankan sendiri, bukan tindak lanjut
            dari instansi.
          </p>
        </article>
      )}
      <div className="status-help">
        <p>Belum punya nomor tiket?</p>
        <Link href="/lapor" className="text-link">
          Buat laporan baru ↗
        </Link>
      </div>
    </div>
  );
}

export function StatusLookup() {
  return (
    <Suspense fallback={<div className="container status-shell">Memuat formulir pencarian...</div>}>
      <Lookup />
    </Suspense>
  );
}
