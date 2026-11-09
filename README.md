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
- **Cek status (`/status`)** menampilkan empat tahap, catatan dan waktu tindak lanjut baru, serta foto bukti bila dilampirkan. Warga dapat memberi konfirmasi setelah tahap selesai.
- **Panel petugas demo (`/petugas/demo`)** menampilkan laporan dari browser yang sama. Petugas simulasi dapat menambahkan catatan, memajukan tahap `diterima` → `diverifikasi` → `diproses` → `selesai`, dan melampirkan foto bukti penyelesaian.
- **Pencegahan kiriman berulang** membatasi satu laporan per menit dan menolak laporan dengan kategori, alamat, serta deskripsi identik dalam 24 jam pada browser yang sama.
- **Sitemap warga, panel demo, dan rencana dashboard petugas** didokumentasikan di [docs/sitemap.md](docs/sitemap.md).

## Alur demo

1. Buka `/lapor`, isi deskripsi, kategori, dan alamat. Foto dan GPS boleh dilewati.
2. Simpan nomor tiket `LB-YYMMDD-XXXX` setelah laporan dibuat.
3. Buka `/petugas/demo` pada browser yang sama, pilih laporan, isi catatan, lalu majukan status sampai selesai. Foto bukti penyelesaian bersifat opsional.
4. Kembali ke `/status`, cari tiket, lihat riwayat dan bukti, lalu beri konfirmasi warga.

## Batasan prototipe

Laporan hanya tersimpan di `localStorage` browser. Data dapat hilang jika penyimpanan browser dibersihkan, tidak tersedia di perangkat lain, dan belum dikirim ke instansi. Panel petugas demo tidak memiliki login dan hanya mengubah data pada browser ini. Jeda serta pemeriksaan duplikat di browser dapat dilewati dengan membersihkan penyimpanan; sistem nyata memerlukan pembatasan di server dan autentikasi petugas. Peta pin belum tersedia; lokasi diisi manual atau memakai koordinat GPS perangkat.

Hero memakai foto Bundaran HI yang sudah tersedia di proyek serta dua ilustrasi AI untuk Monas dan Kota Tua. Ketiganya memiliki versi potret hasil olahan AI untuk layar mobile agar landmark tidak terpotong. Ilustrasi tersebut diberi label di tampilan.

## Struktur utama

- `app/`: landing page serta route `/lapor`, `/status`, dan `/petugas/demo`.
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
