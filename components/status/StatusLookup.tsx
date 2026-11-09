"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getCategoryLabel } from "@/data/categories";
import { getStatusLabel, reportStages } from "@/data/report-status";
import { confirmReport, findReport } from "@/lib/reports";
import type { Report } from "@/types/report";

function formatTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Waktu tidak tercatat"
    : date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

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

  function confirm() {
    if (!report) return;
    const result = confirmReport(report.id);
    if (result.ok) setReport(result.data);
    else setError(result.error);
  }

  const stages = report?.history?.length
    ? reportStages
    : reportStages.filter((stage) => stage.id !== "diverifikasi");
  const currentStage = reportStages.findIndex((stage) => stage.id === report?.status);
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
            <span className={`status-badge status-${report.status}`}>
              {getStatusLabel(report.status)}
            </span>
          </div>
          <div className="report-details">
            <div>
              <span>Kategori</span>
              <strong>{getCategoryLabel(report.category)}</strong>
            </div>
            <div>
              <span>Dibuat</span>
              <strong>{formatTime(report.createdAt)}</strong>
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
            {stages.map((stage) => {
              const event = report.history?.find((item) => item.status === stage.id);
              const done = reportStages.findIndex((item) => item.id === stage.id) <= currentStage;
              return (
                <li key={stage.id} className={done ? "done" : ""}>
                  <span className="timeline-dot" />
                  <div>
                    <strong>{stage.label}</strong>
                    <p>
                      {event
                        ? event.note
                        : done
                          ? "Catatan perubahan belum tersedia pada laporan lama."
                          : stage.description}
                    </p>
                    {event && (
                      <small className="timeline-time">
                        {formatTime(event.at)} ·{" "}
                        {event.actor === "warga" ? "Warga" : "Petugas demo"}
                      </small>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          {report.status === "selesai" && (
            <div className="resolution-evidence">
              <h3>Bukti penyelesaian</h3>
              {report.resolutionPhoto ? (
                <Image
                  src={report.resolutionPhoto}
                  alt="Foto bukti penyelesaian yang diunggah petugas demo"
                  width={800}
                  height={500}
                  unoptimized
                />
              ) : (
                <p>Foto bukti belum dilampirkan.</p>
              )}
            </div>
          )}
          <div className="result-actions">
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
            Pembaruan di atas berasal dari panel petugas demo dalam browser ini dan belum terhubung
            ke instansi.
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
