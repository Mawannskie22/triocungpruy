import type { ReportStatus } from "@/types/report";

export const reportStages: { id: ReportStatus; label: string; description: string }[] = [
  { id: "diterima", label: "Menunggu verifikasi", description: "Laporan sudah diterima." },
  { id: "diverifikasi", label: "Terverifikasi", description: "Isi laporan sudah ditinjau." },
  { id: "diproses", label: "Dalam penanganan", description: "Masalah sedang ditindaklanjuti." },
  { id: "selesai", label: "Selesai", description: "Tindak lanjut dinyatakan selesai." },
];

export function getStatusLabel(status: ReportStatus): string {
  return reportStages.find((stage) => stage.id === status)?.label ?? status;
}

export function getNextStatus(status: ReportStatus): ReportStatus | null {
  const index = reportStages.findIndex((stage) => stage.id === status);
  return index < 0 || index === reportStages.length - 1 ? null : reportStages[index + 1].id;
}
