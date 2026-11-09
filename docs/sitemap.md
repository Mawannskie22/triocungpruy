# Sitemap Lapor Balik

Sitemap ini memisahkan pengalaman warga, panel petugas demo yang berjalan dalam browser yang sama, dan area petugas untuk sistem nyata yang masih direncanakan.

## Area warga — tersedia

| Halaman      | Rute      | Isi dan tindakan utama                                                                                                                 |
| ------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Beranda      | `/`       | Penjelasan layanan, cara melapor, tombol untuk membuat laporan dan mengecek status.                                                    |
| Buat laporan | `/lapor`  | Form tiga langkah: ceritakan masalah, pilih kategori, isi lokasi. Foto dan GPS opsional. Setelah berhasil, warga menerima nomor tiket. |
| Cek status   | `/status` | Cari laporan dengan nomor tiket, lihat empat tahap serta bukti penyelesaian bila tersedia, lalu konfirmasi setelah selesai.            |

Saat ini laporan tersimpan di `localStorage`. Pencarian tiket hanya bekerja pada browser yang sama. Warga dapat membaca perkembangan, sedangkan perubahan tahap dilakukan lewat panel petugas demo.

## Panel petugas demo — tersedia

| Halaman            | Rute            | Isi dan tindakan utama                                                                                                                 |
| ------------------ | --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Panel petugas demo | `/petugas/demo` | Lihat jumlah laporan per tahap, saring daftar, buka detail, catat tindak lanjut, majukan tahap, dan lampirkan foto bukti saat selesai. |

Panel ini tidak memiliki autentikasi dan hanya membaca data browser yang sama. Rute ini digunakan untuk memperagakan alur, bukan untuk penanganan laporan nyata.

## Area petugas — rencana pengembangan

| Halaman           | Rute rencana            | Isi dan tindakan utama                                                                                 |
| ----------------- | ----------------------- | ------------------------------------------------------------------------------------------------------ |
| Masuk petugas     | `/petugas/masuk`        | Autentikasi sebelum mengakses data laporan dan tindakan petugas.                                       |
| Dashboard         | `/petugas`              | Ringkasan jumlah laporan per status, laporan terbaru, dan pekerjaan yang perlu ditindaklanjuti.        |
| Daftar laporan    | `/petugas/laporan`      | Cari dan saring laporan berdasarkan nomor tiket, kategori, lokasi, dan status.                         |
| Detail laporan    | `/petugas/laporan/[id]` | Lihat isi laporan, verifikasi, catat tindak lanjut, perbarui status, dan lampirkan bukti penyelesaian. |
| Analitik          | `/petugas/analitik`     | Lihat tren laporan menurut waktu, kategori, dan lokasi.                                                |
| Riwayat aktivitas | `/petugas/aktivitas`    | Lihat siapa yang mengubah status atau catatan, beserta waktunya.                                       |

## Hubungan dua area

1. Warga membuat laporan di `/lapor` dan menerima nomor tiket.
2. Dalam demo, petugas membuka `/petugas/demo`, memilih laporan, lalu mencatat tindakan dan memperbarui tahap.
3. Warga mencari tiket di `/status` untuk melihat perkembangan yang sama dan memberi konfirmasi setelah tahap selesai.

Alur lintas perangkat dan petugas nyata memerlukan penyimpanan di server serta kontrol akses. Keduanya belum tersedia dalam prototipe saat ini.
