import { categories, getCategoryLabel } from "@/data/categories";
import { reportStages } from "@/data/report-status";
import type { Report, ReportStatus } from "@/types/report";

export const STATUS_COLORS: Record<ReportStatus, string> = {
  diterima: "#4a86c5",
  diverifikasi: "#d4a017",
  diproses: "#e8892b",
  selesai: "#3a9b5c",
};

export type OfficerStats = {
  total: number;
  today: number;
  inProgress: number;
  done: number;
  completionRate: number;
  avgCompletionHours: number;
  byStatus: { status: ReportStatus; label: string; count: number; color: string }[];
  byCategory: { category: string; label: string; count: number }[];
  trend: { label: string; masuk: number; selesai: number }[];
  recent: { ticket: string; category: string; status: ReportStatus; at: string }[];
};

function within(iso: string, start: Date, end: Date): boolean {
  const time = new Date(iso).getTime();
  return time >= start.getTime() && time < end.getTime();
}

export function buildOfficerStats(reports: Report[]): OfficerStats {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const completedDurations = reports
    .map((report) => {
      if (report.status !== "selesai") return null;
      const doneEvent = report.history?.find((event) => event.status === "selesai");
      if (!doneEvent) return null;
      const duration = new Date(doneEvent.at).getTime() - new Date(report.createdAt).getTime();
      return duration > 0 ? duration : null;
    })
    .filter((duration): duration is number => duration !== null);

  const avgCompletionHours = completedDurations.length
    ? completedDurations.reduce((total, duration) => total + duration, 0) /
      completedDurations.length /
      3_600_000
    : 0;

  const trend: { label: string; masuk: number; selesai: number }[] = [];
  for (let offset = 13; offset >= 0; offset -= 1) {
    const dayStart = new Date(todayStart);
    dayStart.setDate(dayStart.getDate() - offset);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    trend.push({
      label: dayStart.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
      masuk: reports.filter((report) => within(report.createdAt, dayStart, dayEnd)).length,
      selesai: reports.filter((report) =>
        (report.history ?? []).some(
          (event) => event.status === "selesai" && within(event.at, dayStart, dayEnd),
        ),
      ).length,
    });
  }

  const recent = reports
    .flatMap((report) =>
      (report.history ?? []).map((event) => ({
        ticket: report.id,
        category: getCategoryLabel(report.category),
        status: event.status,
        at: event.at,
      })),
    )
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 6);

  const total = reports.length;
  const done = reports.filter((report) => report.status === "selesai").length;

  return {
    total,
    today: reports.filter((report) => within(report.createdAt, todayStart, tomorrowStart)).length,
    inProgress: reports.filter(
      (report) => report.status === "diverifikasi" || report.status === "diproses",
    ).length,
    done,
    completionRate: total ? Math.round((done / total) * 100) : 0,
    avgCompletionHours,
    byStatus: reportStages.map((stage) => ({
      status: stage.id,
      label: stage.label,
      count: reports.filter((report) => report.status === stage.id).length,
      color: STATUS_COLORS[stage.id],
    })),
    byCategory: categories.map((category) => ({
      category: category.id,
      label: category.label,
      count: reports.filter((report) => report.category === category.id).length,
    })),
    trend,
    recent,
  };
}
