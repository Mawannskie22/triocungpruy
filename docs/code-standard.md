# Panduan Penulisan Kode: Lapor Balik (Next.js + TypeScript)

**Tujuan:** kode mudah dibaca, dipakai ulang, dan dirawat oleh tim all-role.
**Prinsip utama:** Single Responsibility Principle (SRP), yaitu setiap file, fungsi, dan komponen hanya punya satu alasan untuk berubah.
**Versi:** 0.1
**Tanggal:** 24 Oktober 2026

---

## 1. Prinsip Dasar

1. **Satu tanggung jawab per unit.** Satu komponen menampilkan satu hal. Satu fungsi di `lib/` mengerjakan satu tugas.
2. **Pisahkan tampilan dari logika.** Komponen menerima data dan menampilkannya. Aturan bisnis ada di `lib/`.
3. **Tulis untuk pembaca berikutnya.** Nama yang jelas lebih penting daripada kode yang pendek.
4. **Jangan tulis dua kali.** Kalau sama dipakai dua tempat, pindahkan ke satu modul bersama.
5. **Hindari kode yang belum dibutuhkan.** Tulis yang dipakai sekarang, bukan yang "mungkin nanti".

---

## 2. Penamaan

| Jenis                 | Format                          | Contoh                                         |
| --------------------- | ------------------------------- | ---------------------------------------------- |
| Komponen React        | PascalCase                      | `StepCategory.tsx`, `StatusTimeline`           |
| File lib, data, types | camelCase                       | `tickets.ts`, `duplicates.ts`                  |
| Fungsi dan variabel   | camelCase                       | `createTicketId`, `isWithinRadius`             |
| Konstanta             | UPPER_SNAKE_CASE                | `MAX_DESCRIPTION_LENGTH`, `DUPLICATE_RADIUS_M` |
| Tipe dan interface    | PascalCase                      | `Report`, `ReportStatus`                       |
| Aset (gambar, ikon)   | huruf kecil dengan tanda hubung | `hero-bundaran-hi.jpg`                         |
| Folder                | huruf kecil                     | `components/report/`                           |

**Aturan nama:**

- Gunakan kata kerja untuk fungsi (`saveReport`, `validateDescription`).
- Gunakan kata benda untuk data (`report`, `category`).
- Boolean diawali `is`, `has`, atau `can` (`isSubmitting`, `hasPhoto`).
- Hindari singkatan yang tidak umum. `desc` boleh, `dsc` tidak.

---

## 3. Single Responsibility di Komponen

Komponen dipecah berdasarkan tanggung jawab, bukan berdasarkan ukuran.

**Aturan:**

- Satu komponen menampilkan satu bagian UI.
- Komponen yang punya lebih dari satu alasan untuk berubah dipecah.
- Komponen presentasi (menampilkan data) dipisah dari komponen container (mengambil dan mengatur data).

**Contoh buruk:** satu komponen `ReportForm` mengatur tiga langkah, memvalidasi isian, menyimpan ke localStorage, dan membuat nomor tiket.

**Contoh baik:**

```tsx
// components/report/ReportForm.tsx
// Hanya mengatur langkah aktif dan navigasi
export function ReportForm() {
  const { step, next, back, draft, updateDraft, submit } = useReportDraft();

  return (
    <FormLayout step={step}>
      {step === 1 && <StepPhoto draft={draft} onChange={updateDraft} onNext={next} />}
      {step === 2 && (
        <StepCategory draft={draft} onChange={updateDraft} onNext={next} onBack={back} />
      )}
      {step === 3 && (
        <StepLocation draft={draft} onChange={updateDraft} onSubmit={submit} onBack={back} />
      )}
    </FormLayout>
  );
}
```

Validasi, penyimpanan, dan pembuatan tiket tidak ada di sini. Semuanya di `lib/`.

---

## 4. Pemisahan Logika dan Tampilan

| Lapisan       | Lokasi               | Tugas                          | Boleh berisi                                |
| ------------- | -------------------- | ------------------------------ | ------------------------------------------- |
| Tampilan      | `components/`        | Menampilkan data               | JSX, class CSS, event handler sederhana     |
| Hook          | `hooks/` atau `lib/` | Mengelola state dan efek       | `useState`, `useEffect`, pemanggilan `lib/` |
| Logika bisnis | `lib/`               | Aturan dan perhitungan         | Fungsi murni, tanpa JSX                     |
| Data          | `data/`              | Daftar tetap dan data simulasi | Konstanta, JSON                             |
| Tipe          | `types/`             | Bentuk data                    | `type` dan `interface`                      |

**Aturan:** file di `lib/` tidak boleh mengimpor komponen React. Dengan begitu, logika bisa diuji tanpa membuka halaman.

**Contoh fungsi murni di `lib/tickets.ts`:**

```ts
// lib/tickets.ts
export function createTicketId(date: Date, randomCode: string): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `LB-${yy}${mm}${dd}-${randomCode}`;
}
```

---

## 5. Fungsi

- Maksimal sekitar 20 baris. Kalau lebih, pecah menjadi fungsi kecil.
- Maksimal tiga parameter. Lebih dari itu, kirim satu objek.
- Satu jalur keluar yang jelas. Gunakan `return` awal untuk kondisi gagal.
- Hindari efek samping tersembunyi. Fungsi yang menyimpan data harus punya nama yang menyebutkannya (`saveReport`, bukan `process`).

```ts
// Buruk
function handle(r: any) {
  /* ... */
}

// Baik
function validateReport(input: ReportInput): ValidationResult {
  /* ... */
}
```

---

## 6. Reuse: Kapan Memindahkan Kode

Pindahkan ke modul bersama jika:

- Kode yang sama muncul di dua tempat atau lebih.
- Aturan bisnis perlu konsisten (misalnya format nomor tiket).
- Komponen tampilan dipakai di lebih dari satu halaman.

Jangan dipindahkan jika baru dipakai sekali. Tunggu sampai ada kebutuhan kedua.

**Komponen `ui/` yang wajib dibuat sekali:**

- `Button` (varian utama kuning dan sekunder)
- `Card`
- `Badge` (diterima, diproses, selesai)
- `DummyLabel` ("Data simulasi")
- `Input` dan `Textarea` dengan label dan pesan error

---

## 7. Konstanta dan Data

- Jangan menulis angka ajaib di kode. Beri nama.

```ts
// Buruk
if (description.length < 10) {
  /* ... */
}

// Baik
// lib/validation.ts
export const MIN_DESCRIPTION_LENGTH = 10;
export const MAX_DESCRIPTION_LENGTH = 500;
```

- Daftar kategori hanya ada di `data/categories.ts`. Form dan landing membacanya dari sana.
- Teks yang tampil ke pengguna sebaiknya dikumpulkan di satu tempat (misalnya `data/copy.ts`) supaya mudah diedit dan diperiksa.

---

## 8. Penanganan Error

- Setiap fungsi yang bisa gagal mengembalikan hasil yang jelas, misalnya `{ ok: true, data }` atau `{ ok: false, error }`.
- Pesan error ditulis di satu tempat dan dipakai ulang.
- Pesan error harus memberi cara perbaikan, sesuai PRD. Contoh: "Foto gagal diunggah. Ukuran maksimal 5 MB, coba foto lain."

---

## 9. TypeScript

- Aktifkan mode `strict`.
- Hindari `any`. Gunakan `unknown` jika tipe belum diketahui, lalu persempit.
- Tipe data didefinisikan di `types/` dan diimpor ke mana pun dibutuhkan.
- Gunakan union untuk status dan kategori:

```ts
// types/report.ts
export type ReportStatus = "diterima" | "diproses" | "selesai";
export type ReportCategory =
  "jalan-rusak" | "lampu-mati" | "sampah" | "genangan" | "parkir-liar" | "lainnya";
```

---

## 10. Komponen React

- Props didefinisikan dengan tipe eksplisit.
- Komponen tidak mengambil data sendiri jika bisa menerimanya dari luar.
- Hindari prop drilling yang terlalu dalam. Jika lebih dari dua level, pertimbangkan hook atau context.
- `"use client"` hanya di komponen yang memakai state, efek, atau event browser.
- Gunakan `key` yang stabil. Jangan pakai indeks array untuk daftar yang bisa berubah urutan.

---

## 11. Gaya Kode dan Alat Bantu

- **Format otomatis:** Prettier dengan aturan yang sama untuk semua anggota tim.
- **Pemeriksaan:** ESLint dengan konfigurasi bawaan Next.js.
- **Commit:** pesan singkat dan jelas, contoh: `feat: tambah validasi deskripsi laporan`.
- **Komentar:** tulis mengapa, bukan apa. Kode yang jelas tidak butuh komentar tentang apa yang dilakukannya.
- **Tanpa kode mati:** hapus kode yang dikomentari dan import yang tidak dipakai.

---

## 12. Checklist Sebelum Merge

- [ ] Setiap file punya satu tanggung jawab yang jelas.
- [ ] Tidak ada logika bisnis di dalam komponen.
- [ ] Tidak ada angka atau teks yang ditulis langsung tanpa nama.
- [ ] Tidak ada `any` dan tidak ada kode yang dikomentari.
- [ ] Fungsi di `lib/` bisa dijalankan tanpa browser.
- [ ] Pesan error menjelaskan cara memperbaikinya.
- [ ] Tampilan sudah dicek di lebar 360 px dan laptop.

---

## 13. Keputusan yang Perlu Tim Ambil

- Pakai Vitest atau Jest untuk menguji fungsi di `lib/`?
- Pakai Zod untuk validasi, atau cukup fungsi manual di `lib/validation.ts`?
- Konvensi commit: mengikuti Conventional Commits atau bebas?
