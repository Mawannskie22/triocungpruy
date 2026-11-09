import type { Metadata } from "next";
import { Dashboard } from "@/components/officer/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard Petugas | Lapor Balik",
  robots: { index: false, follow: false },
};

export const instant = false;

export default function OfficerDashboardPage() {
  return <Dashboard />;
}
