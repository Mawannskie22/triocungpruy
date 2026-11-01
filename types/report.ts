export type ReportStatus = "diterima" | "diproses" | "selesai";
export type ReportCategory =
  "jalan-rusak" | "lampu-mati" | "sampah" | "genangan" | "parkir-liar" | "lainnya";

export type Report = {
  id: string;
  description: string;
  category: ReportCategory;
  address: string;
  coordinates?: { latitude: number; longitude: number };
  photo?: string;
  status: ReportStatus;
  createdAt: string;
  confirmed?: boolean;
};
