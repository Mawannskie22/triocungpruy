# Struktur Folder: Lapor Balik (Next.js)

**Stack:** Next.js (App Router), TypeScript, CSS global dengan variabel warna.
**Font:** Plus Jakarta Sans via `next/font/google`.
**Versi dokumen:** 0.1
**Tanggal:** 24 Oktober 2026

---

## 1. Pohon Folder

```
lapor-balik/
├── app/
│   ├── layout.tsx            # Root layout: font, navbar, footer, metadata
│   ├── page.tsx              # Landing page (hero, layanan, tutorial, CTA)
│   ├── globals.css           # Variabel warna, tipografi, reset
│   ├── lapor/
│   │   └── page.tsx          # Form lapor 3 langkah
│   ├── status/
│   │   └── page.tsx          # Cek status dengan nomor tiket
│   ├── tentang/
│   │   └── page.tsx          # Halaman tentang (opsional)
│   └── api/                  # Hanya jika nanti ada backend sungguhan
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── MobileMenu.tsx
│   │   └── Footer.tsx
│   ├── hero/
│   │   ├── Hero.tsx
│   │   └── CityCarousel.tsx  # Animasi Bundaran HI, Monas, Kota Tua
│   ├── landing/
│   │   ├── WhyCards.tsx      # Kenapa Lapor Balik ada
│   │   ├── GoalsList.tsx     # Tujuan aplikasi
│   │   ├── ServiceCards.tsx  # Layanan yang disediakan
│   │   ├── HowToReport.tsx   # Tutorial melapor 3 langkah
│   │   └── FinalCta.tsx
│   ├── report/
│   │   ├── StepPhoto.tsx     # Langkah 1: foto dan deskripsi
│   │   ├── StepCategory.tsx  # Langkah 2: kategori
│   │   ├── StepLocation.tsx  # Langkah 3: pin lokasi
│   │   └── ReportForm.tsx    # Wadah 3 langkah dan navigasinya
│   ├── status/
│   │   ├── TicketInput.tsx
│   │   └── StatusTimeline.tsx
│   └── ui/                   # Komponen dasar yang dipakai ulang
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx         # Status: diterima, diproses, selesai
│       └── DummyLabel.tsx    # Label "Data simulasi"
│
├── lib/
│   ├── tickets.ts            # Format nomor LB-YYMMDD-XXXX
│   ├── reports.ts            # Simpan dan baca laporan (localStorage)
│   ├── validation.ts         # Aturan deskripsi, kategori, lokasi
│   ├── duplicates.ts         # Cek laporan serupa (radius 50 m, 7 hari)
│   └── rateLimit.ts          # Pembatasan kirim sederhana
│
├── data/
│   ├── categories.ts         # 6 kategori laporan (satu sumber)
│   ├── cities.ts             # Foto hero dan label lokasinya
│   └── dummy-reports.json    # Data simulasi
│
├── types/
│   └── report.ts             # Tipe Report, Status, Category
│
├── public/
│   ├── images/
│   │   ├── hero/             # Bundaran HI, Monas, Kota Tua (sudah dikompres)
│   │   └── tutorial/         # Tangkapan layar tiga langkah
│   ├── patterns/
│   │   └── batik.svg         # Pola original, untuk footer dan CTA
│   └── icons/
│
├── docs/
│   ├── PRD-Landing-Page-Lapor-Balik-v0.2.md
│   ├── Lapor-Balik-Spec-MVP.md
│   └── PRD-Lapor-Balik.md
│
├── tests/                    # Opsional, untuk alur lapor dan validasi
├── .env.example
├── README.md
└── package.json
```

---

## 2. Fungsi Setiap Bagian

| Folder | Isi | Aturan |
|---|---|---|
| `app/` | Halaman (route) | `page.tsx` hanya menyusun komponen, tidak berisi logika berat |
| `components/layout/` | Navbar, menu HP, footer | Dipakai di semua halaman lewat `layout.tsx` |
| `components/hero/` | Hero dan animasi kota | Animasi berjalan sekali saat halaman dibuka |
| `components/landing/` | Bagian-bagian landing | Urutan mengikuti PRD |
| `components/report/` | Form lapor 3 langkah | Setiap langkah berdiri sendiri |
| `components/status/` | Input nomor tiket dan timeline | Dipakai di halaman `status` |
| `components/ui/` | Tombol, kartu, badge, label | Dipakai ulang di seluruh situs |
| `lib/` | Logika bisnis | Bisa diuji tanpa membuka halaman |
| `data/` | Kategori, kota, data simulasi | Satu sumber untuk setiap daftar |
| `types/` | Tipe data bersama | Dipakai di `lib/`, `components/`, dan `data/` |
| `public/` | Gambar, pola, ikon | Nama file huruf kecil dan pakai tanda hubung |
| `docs/` | PRD dan spec | Ikut berubah bersama kode |

---

## 3. Aturan Pemeliharaan

1. **Satu halaman, satu susunan komponen.** Ubah urutan atau hapus bagian landing cukup di `app/page.tsx`.
2. **Komponen per bagian.** Hero, layanan, dan tutorial tidak saling bergantung. Ubah satu tidak merusak yang lain.
3. **Data di satu tempat.** Kategori dipakai di form dan landing dari `data/categories.ts`. Tidak ada daftar yang ditulis dua kali.
4. **Logika di `lib/`, bukan di komponen.** Format tiket, validasi, dan cek duplikat ada di sana.
5. **Warna dan font di satu tempat.** Warna didefinisikan sebagai variabel di `globals.css`. Font dipasang lewat `next/font/google` di `layout.tsx`.
6. **Komponen `ui/` dipakai ulang.** Tombol kuning, badge status, dan label "Data simulasi" dibuat sekali.
7. **`"use client"` hanya untuk komponen interaktif.** Carousel, form, dan peta. Bagian statis seperti footer tetap server component.
8. **Nama file dan komponen konsisten.** Komponen memakai PascalCase (`Navbar.tsx`), file lib dan data memakai camelCase (`reports.ts`), dan aset memakai huruf kecil dengan tanda hubung.

---

## 4. Catatan Selama MVP

- Selama MVP masih memakai localStorage, form dan status berjalan di sisi klien. Folder `app/api/` boleh dikosongkan dulu.
- Kalau nanti ada backend sungguhan, `lib/reports.ts` cukup diganti ke pemanggilan API. Komponen tidak perlu diubah.
- Data simulasi di `data/dummy-reports.json` wajib diberi label "Data simulasi" di tampilan.

---

## 5. Keputusan yang Perlu Tim Ambil

- Pakai Tailwind CSS atau CSS biasa di `globals.css`?
- Peta untuk pin lokasi: Leaflet (gratis) atau Google Maps (perlu API key)?
- Perlu folder `tests/` di MVP atau dikerjakan setelah demo?
- Apakah halaman `tentang` masuk MVP?