import type { ReportCategory } from "@/types/report";
import { categories } from "@/data/categories";

export const MIN_DESCRIPTION_LENGTH = 10;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MIN_ADDRESS_LENGTH = 5;

export function validateDescription(value: string): string | null {
  const length = value.trim().length;
  if (length < MIN_DESCRIPTION_LENGTH)
    return `Ceritakan masalahnya minimal ${MIN_DESCRIPTION_LENGTH} karakter.`;
  if (length > MAX_DESCRIPTION_LENGTH)
    return `Deskripsi maksimal ${MAX_DESCRIPTION_LENGTH} karakter.`;
  return null;
}

export function validateCategory(value: ReportCategory | ""): string | null {
  return categories.some((category) => category.id === value)
    ? null
    : "Pilih satu kategori laporan.";
}

export function validateAddress(value: string): string | null {
  return value.trim().length >= MIN_ADDRESS_LENGTH
    ? null
    : "Tulis alamat atau patokan lokasi minimal 5 karakter.";
}
