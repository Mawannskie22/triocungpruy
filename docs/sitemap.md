# Sitemap Lapor Balik

Sitemap ini memisahkan pengalaman warga yang sudah ada dalam prototipe dari area petugas yang direncanakan. Rute petugas di bawah adalah rancangan, bukan halaman yang saat ini bisa dibuka.

## Area warga — tersedia

| Halaman      | Rute      | Isi dan tindakan utama                                                                                                                 |
| ------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Beranda      | `/`       | Penjelasan layanan, cara melapor, tombol untuk membuat laporan dan mengecek status.                                                    |
| Buat laporan | `/lapor`  | Form tiga langkah: ceritakan masalah, pilih kategori, isi lokasi. Foto dan GPS opsional. Setelah berhasil, warga menerima nomor tiket. |
| Cek status   | `/status` | Cari laporan dengan nomor tiket, lihat detail dan tahap `diterima` → `diproses` → `selesai`, lalu konfirmasi warga setelah selesai.    |

Saat ini laporan tersimpan di `localStorage`. Pencarian tiket hanya bekerja pada browser yang sama. Tombol perubahan status di halaman warga adalah simulasi, belum berasal dari petugas atau instansi.

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
2. Petugas melihat laporan masuk di `/petugas/laporan`, membuka detail, lalu mencatat tindakan dan memperbarui status.
3. Warga mencari tiket di `/status` untuk melihat perkembangan yang sama dan memberi konfirmasi setelah tahap selesai.

Alur bersama pada langkah 2–3 memerlukan penyimpanan di server dan kontrol akses petugas. Keduanya belum tersedia dalam prototipe saat ini.
