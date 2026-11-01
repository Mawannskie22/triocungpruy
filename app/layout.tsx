import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Lapor Balik — Suaramu untuk Jakarta",
  description:
    "Laporkan masalah di sekitarmu dalam tiga langkah dan pantau statusnya dengan nomor tiket.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={plusJakartaSans.className}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
