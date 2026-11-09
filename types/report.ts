export type ReportStatus = "diterima" | "diverifikasi" | "diproses" | "selesai";
export type ReportCategory =
  "jalan-rusak" | "lampu-mati" | "sampah" | "genangan" | "parkir-liar" | "lainnya";

export type StatusEvent = {
  status: ReportStatus;
  at: string;
  actor: "warga" | "petugas-demo";
  note: string;
};

export type Report = {
  id: string;
  description: string;
  category: ReportCategory;
  address: string;
  coordinates?: { latitude: number; longitude: number };
  photo?: string;
  status: ReportStatus;
  createdAt: string;
  history?: StatusEvent[];
  resolutionPhoto?: string;
  confirmed?: boolean;
};
