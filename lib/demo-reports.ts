import { getCategoryLabel } from "@/data/categories";
import { readReports, setReports } from "@/lib/reports";
import { createTicketId } from "@/lib/tickets";
import type { Report, ReportCategory, ReportStatus, StatusEvent } from "@/types/report";

const TOTAL_REPORTS = 48;
const STAGES: ReportStatus[] = ["diterima", "diverifikasi", "diproses", "selesai"];

const CATEGORIES: ReportCategory[] = [
  "jalan-rusak",
  "lampu-mati",
  "sampah",
  "genangan",
  "parkir-liar",
  "lainnya",
];

const ADDRESSES = [
  "Jl. Sudirman dekat halte, Jakarta Pusat",
  "Jl. Thamrin depan gedung, Jakarta Pusat",
  "Jl. Kemang Raya, Jakarta Selatan",
  "Jl. Fatmawati dekat pasar, Jakarta Selatan",
  "Jl. Tebet Barat Dalam, Jakarta Selatan",
  "Jl. Casablanca, Jakarta Selatan",
  "Jl. Gajah Mada, Jakarta Barat",
  "Jl. Tanjung Duren Raya, Jakarta Barat",
  "Jl. Daan Mogot, Jakarta Barat",
  "Jl. Pemuda, Jakarta Timur",
  "Jl. Matraman Raya, Jakarta Timur",
  "Jl. Kalimalang, Jakarta Timur",
  "Jl. Yos Sudarso, Jakarta Utara",
  "Jl. Pluit Raya, Jakarta Utara",
  "Jl. Kelapa Gading Boulevard, Jakarta Utara",
  "Jl. Pramuka, Jakarta Pusat",
];

const DEMO_POINTS: Record<string, [number, number]> = {
  "Jl. Sudirman dekat halte, Jakarta Pusat": [-6.2074, 106.8214],
  "Jl. Thamrin depan gedung, Jakarta Pusat": [-6.1944, 106.8231],
  "Jl. Kemang Raya, Jakarta Selatan": [-6.2631, 106.8146],
  "Jl. Fatmawati dekat pasar, Jakarta Selatan": [-6.2924, 106.7938],
  "Jl. Tebet Barat Dalam, Jakarta Selatan": [-6.2301, 106.8491],
  "Jl. Casablanca, Jakarta Selatan": [-6.2221, 106.8413],
  "Jl. Gajah Mada, Jakarta Barat": [-6.1592, 106.8177],
  "Jl. Tanjung Duren Raya, Jakarta Barat": [-6.1781, 106.7875],
  "Jl. Daan Mogot, Jakarta Barat": [-6.1541, 106.7783],
  "Jl. Pemuda, Jakarta Timur": [-6.1926, 106.8904],
  "Jl. Matraman Raya, Jakarta Timur": [-6.2031, 106.8571],
  "Jl. Kalimalang, Jakarta Timur": [-6.2468, 106.9028],
  "Jl. Yos Sudarso, Jakarta Utara": [-6.1394, 106.8788],
  "Jl. Pluit Raya, Jakarta Utara": [-6.1194, 106.7978],
  "Jl. Kelapa Gading Boulevard, Jakarta Utara": [-6.1589, 106.9051],
  "Jl. Pramuka, Jakarta Pusat": [-6.1921, 106.8592],
};

const MAP_SEED_KEY = "lapor-balik-map-seeded-v1";

const DESCRIPTIONS: Record<ReportCategory, string[]> = {
  "jalan-rusak": [
    "Aspal berlubang cukup dalam di lajur kiri dan membahayakan pengendara motor.",
    "Jalan berlubang setelah hujan, sudah dua minggu belum diperbaiki.",
    "Trotoar ambles di depan pertokoan dan perlu dipasang penanda.",
  ],
  "lampu-mati": [
    "Lampu jalan mati sejak tiga malam, jalan jadi gelap dan rawan.",
    "Lampu penerangan taman mati total, beberapa titik tidak menyala.",
    "Lampu jalan berkedip lalu mati, sudah dilaporkan ke pengurus RT.",
  ],
  sampah: [
    "Tumpukan sampah di pinggir jalan sudah menyebar dan menimbulkan bau.",
    "Bak sampah penuh, sebagian sampah dibuang ke saluran air.",
    "Sampah menumpuk di bawah jembatan dan mengundang lalat.",
  ],
  genangan: [
    "Genangan air setinggi mata kaki setelah hujan dan sulit dilewati.",
    "Saluran air tersumbat sehingga air menggenang di depan rumah.",
    "Jalan tergenang dan air mulai masuk ke halaman warga.",
  ],
  "parkir-liar": [
    "Motor parkir liar di trotoar sehingga pejalan kaki harus turun ke jalan.",
    "Mobil parkir di badan jalan dan menghambat arus lalu lintas.",
    "Parkir liar di depan halte membuat bus sulit berhenti.",
  ],
  lainnya: [
    "Pohon tumbang menutup sebagian jalan dan kabel ikut tertarik.",
    "Pagar taman rusak dan beberapa bagiannya tajam.",
    "Fasilitas umum rusak dan perlu pengecekan petugas.",
  ],
};

const CATEGORY_HUES: Record<ReportCategory, number> = {
  "jalan-rusak": 25,
  "lampu-mati": 220,
  sampah: 120,
  genangan: 200,
  "parkir-liar": 280,
  lainnya: 45,
};

const NOTES: Record<ReportStatus, string> = {
  diterima: "Laporan tersimpan di browser ini.",
  diverifikasi: "Isi laporan sudah diperiksa petugas.",
  diproses: "Petugas sedang menangani laporan di lokasi.",
  selesai: "Penanganan selesai dan sudah dicek di lokasi.",
};

function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function pick<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

function pickStatus(daysAgo: number, value: number): ReportStatus {
  const doneChance = Math.min(0.82, 0.12 + daysAgo * 0.055);
  if (value < doneChance) return "selesai";
  const rest = (value - doneChance) / (1 - doneChance);
  if (rest < 0.45) return "diproses";
  if (rest < 0.72) return "diverifikasi";
  return "diterima";
}

function createCode(random: () => number): string {
  return Math.floor(random() * 1679616)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0");
}

function placeholderImage(title: string, hue: number, caption: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="450" viewBox="0 0 720 450"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 55% 82%)"/><stop offset="1" stop-color="hsl(${hue + 30} 45% 58%)"/></linearGradient></defs><rect width="720" height="450" fill="url(#g)"/><circle cx="108" cy="86" r="42" fill="#ffffff" opacity="0.35"/><rect x="56" y="300" width="608" height="92" rx="12" fill="#1a1a1a" opacity="0.38"/><text x="360" y="343" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="700" fill="#ffffff">${title}</text><text x="360" y="378" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#ffffff" opacity="0.88">${caption}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function createDemoReports(): Report[] {
  const random = createRandom(20261109);
  const now = new Date();
  const usedIds = new Set<string>();
  const reports: Report[] = [];

  for (let index = 0; index < TOTAL_REPORTS; index += 1) {
    const category = pick(CATEGORIES, random);
    const daysAgo = Math.floor(random() * 14);

    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - daysAgo);
    createdAt.setHours(6 + Math.floor(random() * 15), Math.floor(random() * 60), 0, 0);
    if (createdAt.getTime() > now.getTime()) {
      createdAt.setTime(now.getTime() - Math.floor(random() * 5 * 60 * 60 * 1000));
    }

    const status = pickStatus(daysAgo, random());
    const statusIndex = STAGES.indexOf(status);
    const minimumAge = statusIndex * 3 * 60 * 60 * 1000;
    if (now.getTime() - createdAt.getTime() < minimumAge) {
      createdAt.setTime(now.getTime() - minimumAge - Math.floor(random() * 3 * 60 * 60 * 1000));
    }

    const span = Math.max(now.getTime() - createdAt.getTime(), 60 * 60 * 1000);
    const pace = 0.55 + random() * 0.35;
    const history: StatusEvent[] = [];

    for (let step = 0; step <= statusIndex; step += 1) {
      const fraction = statusIndex === 0 ? 0 : (step / statusIndex) * pace;
      history.push({
        status: STAGES[step],
        at: new Date(createdAt.getTime() + span * fraction).toISOString(),
        actor: step === 0 ? "warga" : "petugas-demo",
        note: NOTES[STAGES[step]],
      });
    }

    let id = createTicketId(createdAt, createCode(random));
    while (usedIds.has(id)) {
      id = createTicketId(createdAt, createCode(random));
    }
    usedIds.add(id);

    const description = pick(DESCRIPTIONS[category], random);
    const address = pick(ADDRESSES, random);
    const [latitude, longitude] = DEMO_POINTS[address];

    reports.push({
      id,
      description,
      category,
      address,
      coordinates: {
        latitude: latitude + ((index % 5) - 2) * 0.00055,
        longitude: longitude + ((Math.floor(index / 5) % 5) - 2) * 0.00055,
      },
      status,
      createdAt: createdAt.toISOString(),
      history,
      ...(random() < 0.75
        ? {
            photo: placeholderImage(
              getCategoryLabel(category),
              CATEGORY_HUES[category],
              "Foto laporan warga",
            ),
          }
        : {}),
      ...(status === "selesai"
        ? {
            resolutionPhoto: placeholderImage("Bukti penyelesaian", 145, "Foto bukti penyelesaian"),
          }
        : {}),
    });
  }

  return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function loadOrSeedReports(): Report[] {
  const existing = readReports();
  if (existing.length > 0) return existing;
  return resetDemoReports();
}

export function resetDemoReports(): Report[] {
  const seeded = createDemoReports();
  setReports(seeded);
  return seeded;
}

export function ensureMapDemoReports(): { reports: Report[]; storageAvailable: boolean } {
  const existing = readReports();
  try {
    if (localStorage.getItem(MAP_SEED_KEY) === "1") {
      return { reports: existing, storageAvailable: true };
    }
  } catch {
    return { reports: existing, storageAvailable: false };
  }

  const demo = createDemoReports();
  const demoById = new Map(demo.map((report) => [report.id, report]));
  const preserved = existing.map((report) =>
    !report.coordinates && demoById.has(report.id)
      ? { ...report, coordinates: demoById.get(report.id)?.coordinates }
      : report,
  );
  const ids = new Set(preserved.map((report) => report.id));
  const merged = [...preserved, ...demo.filter((report) => !ids.has(report.id))].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  if (!setReports(merged)) return { reports: existing, storageAvailable: false };
  try {
    localStorage.setItem(MAP_SEED_KEY, "1");
  } catch {
    // The reports have already been saved; a later visit can safely retry deduplication.
  }
  return { reports: merged, storageAvailable: true };
}
