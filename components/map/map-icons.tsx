import type { ReportCategory } from "@/types/report";

const paths: Record<ReportCategory, string> = {
  "jalan-rusak": '<path d="M7 3v18M17 3v18M12 2v4m0 3 2 2-3 2 2 2-1 3v4"/>',
  "lampu-mati":
    '<path d="M9 18h6m-5 3h4M8 13c-1.2-1-2-2.2-2-4a6 6 0 0 1 12 0c0 1.8-.8 3-2 4l-1 3H9l-1-3Z"/><path d="M3 9H1m22 0h-2M4 3 2.5 1.5M20 3l1.5-1.5"/>',
  sampah: '<path d="M4 7h16M9 7V4h6v3m-9 0 1 14h10l1-14M10 11v6m4-6v6"/>',
  genangan:
    '<path d="M2 9c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2M2 15c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2"/>',
  "parkir-liar": '<path d="M5 3v18M5 4h8a4 4 0 0 1 0 8H5M3 21 21 3"/>',
  lainnya: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 4h.01"/>',
};

export function mapIconSvg(category: ReportCategory): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[category]}</svg>`;
}

export function MapGlyph({ category }: { category: ReportCategory }) {
  return <span className="map-glyph" dangerouslySetInnerHTML={{ __html: mapIconSvg(category) }} />;
}
