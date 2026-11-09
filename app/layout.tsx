import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Lapor Balik — Suaramu untuk Jakarta",
  description:
    "Laporkan masalah di sekitarmu dalam tiga langkah dan pantau statusnya dengan nomor tiket.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={plusJakartaSans.className} data-scroll-behavior="smooth">
      <body>
        <Script id="splash-session-check" strategy="beforeInteractive">
          {`try{if(new URLSearchParams(location.search).get("intro")!=="1"&&sessionStorage.getItem("lapor-balik-splash-seen-v1")==="1")document.documentElement.dataset.splashSeen="1"}catch{}`}
        </Script>
        {children}
      </body>
    </html>
  );
}
