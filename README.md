# Lapor Balik

Lapor Balik adalah prototipe website untuk melaporkan masalah lingkungan di Jakarta dan memantau perkembangannya melalui nomor tiket. Proyek ini dibuat untuk Web In Action MIA 2026 dengan subtema _Civic Reporting & Accountability_.

## Tech stack

- Next.js 16 (App Router), React 19, dan TypeScript.
- CSS untuk tampilan dan animasi.
- `localStorage` browser untuk menyimpan data laporan pada tahap prototipe.
- ESLint dan Prettier untuk pemeriksaan kode dan format.

## Cara menjalankan

Pastikan Node.js dan npm sudah terpasang. Lalu jalankan:

```bash
git clone https://github.com/Mawannskie22/triocungpruy.git
cd triocungpruy
npm ci
npm run dev
```

Buka `http://localhost:3000`. Jika PowerShell memblokir `npm.ps1`, gunakan `npm.cmd ci` dan `npm.cmd run dev`.

## Progress saat ini

- **Landing page (`/`)** sudah menampilkan penjelasan layanan, cara melapor, dan tautan menuju form serta halaman cek status.
- **Buat laporan (`/lapor`)** sudah berjalan dalam tiga langkah: deskripsi, kategori, dan lokasi. Foto maksimal 1 MB dan akses GPS bersifat opsional. Setelah berhasil, warga mendapat nomor tiket.
- **Cek status (`/status`)** sudah dapat mencari tiket dan menampilkan detail laporan. Perubahan tahap `diterima` → `diproses` → `selesai` serta konfirmasi warga masih berupa simulasi.
- **Sitemap warga dan rencana dashboard petugas** sudah didokumentasikan di [docs/sitemap.md](docs/sitemap.md). Area petugas belum diimplementasikan.

## Alur demo

1. Buka `/lapor`, isi deskripsi, kategori, dan alamat. Foto dan GPS boleh dilewati.
2. Simpan nomor tiket `LB-YYMMDD-XXXX` setelah laporan dibuat.
3. Buka `/status` pada browser yang sama, cari tiket, lalu coba simulasi perubahan status dan konfirmasi warga.

## Batasan prototipe

Laporan hanya tersimpan di `localStorage` browser. Data dapat hilang jika penyimpanan browser dibersihkan, tidak tersedia di perangkat lain, dan belum dikirim ke instansi. Peta pin belum tersedia; lokasi diisi manual atau memakai koordinat GPS perangkat.

Hero memakai foto Bundaran HI yang sudah tersedia di proyek serta dua ilustrasi AI untuk Monas dan Kota Tua. Ilustrasi tersebut diberi label di tampilan.

## Struktur utama

- `app/`: landing page serta route `/lapor` dan `/status`.
- `components/`: bagian antarmuka dan interaksi.
- `data/`: daftar kategori laporan.
- `lib/`: pembuatan tiket, validasi, dan penyimpanan laporan.
- `types/`: tipe data bersama.
- `docs/`: kebutuhan produk, sitemap, struktur folder, dan standar kode.

## Pemeriksaan

```bash
npm run lint        # rapikan format dan perbaiki lint yang bisa diperbaiki otomatis
npm run lint:check  # periksa tanpa mengubah file
npm run build
```

`npm run format` tersedia jika hanya ingin merapikan format. Aset di `public/`, file hasil build, dan `package-lock.json` tidak ikut diformat.
