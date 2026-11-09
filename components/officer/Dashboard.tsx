"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getStatusLabel } from "@/data/report-status";
import { loadOrSeedReports } from "@/lib/demo-reports";
import { buildOfficerStats, STATUS_COLORS } from "@/lib/officer-stats";
import type { Report } from "@/types/report";

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e6e2d9",
  fontSize: 12,
  boxShadow: "0 10px 30px rgba(26, 26, 26, 0.08)",
};

function formatDateTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

function formatHours(hours: number): string {
  if (hours <= 0) return "-";
  if (hours < 24) return `${Math.round(hours)} jam`;
  return `${(hours / 24).toFixed(1)} hari`;
}

export function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setReports(loadOrSeedReports());
    setLoaded(true);
  }, []);

  const stats = useMemo(() => buildOfficerStats(reports), [reports]);

  if (!loaded) {
    return <p className="officer-empty">Memuat dashboard...</p>;
  }

  return (
    <div className="officer-dashboard">
      <div className="officer-heading">
        <div>
          <span className="officer-context">DASHBOARD PETUGAS</span>
          <h1>Ringkasan laporan</h1>
          <p>Pantau volume laporan, sebaran kategori, dan kecepatan penyelesaian.</p>
        </div>
      </div>

      <div className="officer-kpis">
        <Link href="/petugas/dashboard/tiket" className="officer-kpi officer-kpi-link">
          <span>Total laporan</span>
          <strong>{stats.total}</strong>
          <small>Semua laporan di browser ini · Lihat tiket →</small>
        </Link>
        <article className="officer-kpi">
          <span>Masuk hari ini</span>
          <strong>{stats.today}</strong>
          <small>Sejak tengah malam</small>
        </article>
        <article className="officer-kpi">
          <span>Sedang diproses</span>
          <strong>{stats.inProgress}</strong>
          <small>Terverifikasi + dalam penanganan</small>
        </article>
        <article className="officer-kpi">
          <span>Selesai</span>
          <strong>{stats.done}</strong>
          <small>{stats.completionRate}% dari total laporan</small>
        </article>
      </div>

      <div className="officer-chart-grid">
        <article className="officer-card officer-chart-wide">
          <div className="officer-card-head">
            <h2>Tren 14 hari</h2>
            <span>Laporan masuk vs selesai</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={stats.trend} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trendMasuk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f5b700" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#f5b700" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="trendSelesai" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3a9b5c" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3a9b5c" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ece8dd" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                interval={1}
                tick={{ fontSize: 11, fill: "#7a766b" }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#7a766b" }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="masuk"
                name="Masuk"
                stroke="#c99700"
                strokeWidth={2}
                fill="url(#trendMasuk)"
              />
              <Area
                type="monotone"
                dataKey="selesai"
                name="Selesai"
                stroke="#2e7d32"
                strokeWidth={2}
                fill="url(#trendSelesai)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </article>

        <article className="officer-card">
          <div className="officer-card-head">
            <h2>Status laporan</h2>
            <span>4 tahap</span>
          </div>
          <div className="officer-donut-wrap">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.byStatus}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={58}
                  outerRadius={86}
                  paddingAngle={2}
                  stroke="none"
                >
                  {stats.byStatus.map((item) => (
                    <Cell key={item.status} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="officer-donut-center">
              <strong>{stats.total}</strong>
              <span>laporan</span>
            </div>
          </div>
          <ul className="officer-legend">
            {stats.byStatus.map((item) => (
              <li key={item.status}>
                <span className="officer-legend-dot" style={{ background: item.color }} />
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="officer-card officer-chart-wide">
          <div className="officer-card-head">
            <h2>Laporan per kategori</h2>
            <span>6 kategori</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={stats.byCategory}
              layout="vertical"
              margin={{ top: 4, right: 18, left: 8, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} stroke="#ece8dd" />
              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#7a766b" }}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={96}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#4c493f" }}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#faf8f2" }} />
              <Bar
                dataKey="count"
                name="Laporan"
                fill="#f5b700"
                radius={[0, 6, 6, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="officer-card">
          <div className="officer-card-head">
            <h2>Tingkat penyelesaian</h2>
            <span>Semua laporan</span>
          </div>
          <div className="officer-radial-wrap">
            <ResponsiveContainer width="100%" height={190}>
              <RadialBarChart
                innerRadius="72%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
                data={[
                  { name: "Selesai", value: stats.completionRate, fill: STATUS_COLORS.selesai },
                ]}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" background={{ fill: "#f0ece2" }} cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="officer-radial-center">
              <strong>{stats.completionRate}%</strong>
              <span>selesai</span>
            </div>
          </div>
          <p className="officer-radial-note">
            Rata-rata selesai <strong>{formatHours(stats.avgCompletionHours)}</strong> setelah
            laporan masuk.
          </p>
        </article>
      </div>

      <article className="officer-card officer-activity-card">
        <div className="officer-card-head">
          <h2>Aktivitas terbaru</h2>
          <span>6 pembaruan terakhir</span>
        </div>
        <ul className="officer-activity">
          {stats.recent.map((item) => (
            <li key={`${item.ticket}-${item.status}-${item.at}`}>
              <span
                className="officer-activity-dot"
                style={{ background: STATUS_COLORS[item.status] }}
              />
              <div>
                <strong>{item.ticket}</strong>
                <span>{item.category}</span>
              </div>
              <span className="officer-activity-meta">
                {getStatusLabel(item.status)}
                <small>{formatDateTime(item.at)}</small>
              </span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
