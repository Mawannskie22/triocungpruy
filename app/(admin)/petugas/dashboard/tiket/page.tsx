import type { Metadata } from "next";
import { TicketWorkspace } from "@/components/officer/TicketWorkspace";

export const metadata: Metadata = {
  title: "Tiket Petugas | Lapor Balik",
  robots: { index: false, follow: false },
};

export const instant = false;

export default function OfficerTicketsPage() {
  return <TicketWorkspace />;
}
