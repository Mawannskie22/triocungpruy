import type { Report } from "@/types/report";
import { createTicketId } from "@/lib/tickets";

const STORAGE_KEY = "lapor-balik-reports-v1";
const RATE_LIMIT_MS = 60_000;

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export function readReports(): Report[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter(isReport) : [];
  } catch {
    return [];
  }
}

function isReport(value: unknown): value is Report {
  if (!value || typeof value !== "object") return false;
  const report = value as Partial<Report>;
  return (
    typeof report.id === "string" &&
    typeof report.description === "string" &&
    typeof report.address === "string" &&
    typeof report.createdAt === "string"
  );
}

export function findReport(id: string): Report | undefined {
  return readReports().find((report) => report.id.toUpperCase() === id.trim().toUpperCase());
}

export function saveReport(input: Omit<Report, "id" | "status" | "createdAt">): Result<Report> {
  const reports = readReports();
  const latest = reports[0];
  if (latest && Date.now() - new Date(latest.createdAt).getTime() < RATE_LIMIT_MS) {
    return { ok: false, error: "Tunggu satu menit sebelum mengirim laporan berikutnya." };
  }
  const date = new Date();
  const randomCode = Math.random().toString(36).slice(2, 6).toUpperCase();
  const report: Report = {
    ...input,
    id: createTicketId(date, randomCode),
    status: "diterima",
    createdAt: date.toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([report, ...reports]));
    return { ok: true, data: report };
  } catch {
    return {
      ok: false,
      error:
        "Penyimpanan browser penuh atau tidak tersedia. Coba kurangi ukuran foto, lalu kirim lagi.",
    };
  }
}

export function confirmReport(id: string): Result<Report> {
  const reports = readReports();
  const index = reports.findIndex((report) => report.id === id);
  if (index < 0) return { ok: false, error: "Laporan tidak ditemukan di browser ini." };
  reports[index] = { ...reports[index], confirmed: true };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    return { ok: true, data: reports[index] };
  } catch {
    return { ok: false, error: "Konfirmasi belum tersimpan. Coba lagi." };
  }
}

export function advanceDemoStatus(id: string): Result<Report> {
  const reports = readReports();
  const index = reports.findIndex((report) => report.id === id);
  if (index < 0) return { ok: false, error: "Laporan tidak ditemukan di browser ini." };
  const status = reports[index].status === "diterima" ? "diproses" : "selesai";
  reports[index] = { ...reports[index], status };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    return { ok: true, data: reports[index] };
  } catch {
    return { ok: false, error: "Perubahan status belum tersimpan. Coba lagi." };
  }
}
