import type { ReportCategory } from "@/types/report";

export const categories: { id: ReportCategory; label: string; icon: string }[] = [
  { id: "jalan-rusak", label: "Jalan rusak", icon: "▧" },
  { id: "lampu-mati", label: "Lampu mati", icon: "✳" },
  { id: "sampah", label: "Sampah", icon: "♻" },
  { id: "genangan", label: "Genangan", icon: "≈" },
  { id: "parkir-liar", label: "Parkir liar", icon: "Ⓟ" },
  { id: "lainnya", label: "Lainnya", icon: "···" },
];

export function getCategoryLabel(id: ReportCategory): string {
  return categories.find((category) => category.id === id)?.label ?? "Lainnya";
}
