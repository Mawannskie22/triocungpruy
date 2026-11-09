import type { Report } from "@/types/report";
import { createTicketId } from "@/lib/tickets";
import { getNextStatus } from "@/data/report-status";

const STORAGE_KEY = "lapor-balik-reports-v1";
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

type Result<T> = { ok: true; data: T } | { ok: false; error: string; existingTicket?: string };

type ReportDraft = Pick<Report, "description" | "category" | "address" | "coordinates" | "photo">;

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("id-ID");
}

function writeReports(reports: Report[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    return true;
  } catch {
    return false;
  }
}

export function readReports(): Report[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter(isReport) : [];
  } catch {
    return [];
  }
}

export function setReports(reports: Report[]): boolean {
  return writeReports(reports);
}

function isReport(value: unknown): value is Report {
  if (!value || typeof value !== "object") return false;
  const report = value as Partial<Report>;
  return (
    typeof report.id === "string" &&
    typeof report.description === "string" &&
    typeof report.address === "string" &&
    typeof report.createdAt === "string" &&
    ["diterima", "diverifikasi", "diproses", "selesai"].includes(report.status ?? "") &&
    (report.history === undefined ||
      (Array.isArray(report.history) &&
        report.history.every(
          (event) =>
            event &&
            typeof event === "object" &&
            ["diterima", "diverifikasi", "diproses", "selesai"].includes(event.status) &&
            typeof event.at === "string" &&
            typeof event.note === "string" &&
            ["warga", "petugas-demo"].includes(event.actor),
        ))) &&
    (report.resolutionPhoto === undefined || typeof report.resolutionPhoto === "string")
  );
}

export function findReport(id: string): Report | undefined {
  return readReports().find((report) => report.id.toUpperCase() === id.trim().toUpperCase());
}

export function saveReport(input: ReportDraft): Result<Report> {
  const reports = readReports();
  const now = Date.now();
  const duplicate = reports.find(
    (report) =>
      now - new Date(report.createdAt).getTime() >= 0 &&
      now - new Date(report.createdAt).getTime() < DUPLICATE_WINDOW_MS &&
      report.category === input.category &&
      normalize(report.address) === normalize(input.address) &&
      normalize(report.description) === normalize(input.description),
  );
  if (duplicate) {
    return {
      ok: false,
      error: `Laporan yang sama sudah tersimpan dengan nomor ${duplicate.id}.`,
      existingTicket: duplicate.id,
    };
  }
  const date = new Date(now);
  const randomCode = Math.random().toString(36).slice(2, 6).toUpperCase();
  const report: Report = {
    ...input,
    id: createTicketId(date, randomCode),
    status: "diterima",
    createdAt: date.toISOString(),
    history: [
      {
        status: "diterima",
        at: date.toISOString(),
        actor: "warga",
        note: "Laporan tersimpan di browser ini.",
      },
    ],
  };
  if (writeReports([report, ...reports])) {
    return { ok: true, data: report };
  }
  return {
    ok: false,
    error:
      "Penyimpanan browser penuh atau tidak tersedia. Coba kurangi ukuran foto, lalu kirim lagi.",
  };
}

export function confirmReport(id: string): Result<Report> {
  const reports = readReports();
  const index = reports.findIndex((report) => report.id === id);
  if (index < 0) return { ok: false, error: "Laporan tidak ditemukan di browser ini." };
  if (reports[index].status !== "selesai") {
    return { ok: false, error: "Laporan belum berada pada tahap selesai." };
  }
  reports[index] = { ...reports[index], confirmed: true };
  if (writeReports(reports)) {
    return { ok: true, data: reports[index] };
  }
  return { ok: false, error: "Konfirmasi belum tersimpan. Coba lagi." };
}

export function advanceDemoStatus(
  id: string,
  note: string,
  resolutionPhoto?: string,
): Result<Report> {
  const reports = readReports();
  const index = reports.findIndex((report) => report.id === id);
  if (index < 0) return { ok: false, error: "Laporan tidak ditemukan di browser ini." };
  const status = getNextStatus(reports[index].status);
  if (!status) return { ok: false, error: "Laporan sudah berada pada tahap terakhir." };
  const cleanNote = note.trim();
  if (cleanNote.length < 5 || cleanNote.length > 300) {
    return { ok: false, error: "Catatan tindak lanjut harus berisi 5–300 karakter." };
  }
  if (resolutionPhoto && status !== "selesai") {
    return { ok: false, error: "Bukti foto hanya dapat dilampirkan pada tahap selesai." };
  }
  if (status === "selesai" && !resolutionPhoto) {
    return { ok: false, error: "Foto bukti penyelesaian wajib diunggah." };
  }
  if (
    resolutionPhoto &&
    (!/^data:image\/(jpeg|png|webp);base64,/.test(resolutionPhoto) ||
      resolutionPhoto.length > 1_500_000)
  ) {
    return {
      ok: false,
      error: "Bukti foto harus JPG, PNG, atau WebP dengan ukuran maksimal 1 MB.",
    };
  }
  const now = new Date().toISOString();
  reports[index] = {
    ...reports[index],
    status,
    history: [
      ...(reports[index].history ?? [
        {
          status: "diterima" as const,
          at: reports[index].createdAt,
          actor: "warga" as const,
          note: "Laporan dibuat sebelum riwayat tahap tersedia.",
        },
      ]),
      { status, at: now, actor: "petugas-demo", note: cleanNote },
    ],
    ...(status === "selesai" && resolutionPhoto ? { resolutionPhoto } : {}),
  };
  if (writeReports(reports)) {
    return { ok: true, data: reports[index] };
  }
  return { ok: false, error: "Perubahan status belum tersimpan. Coba lagi." };
}
