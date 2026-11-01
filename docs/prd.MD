# PRD: Landing Page Lapor Balik

**Tema:** Designing Digital Futures – Powering Public Transparency
**Subtema:** Civic Reporting & Accountability
**Fokus dokumen:** Desain dan isi landing page (satu halaman)
**Versi:** 0.2 (update: hero dan identitas visual)
**Tanggal:** 24 Oktober 2026

---

## 1. Tujuan Landing Page

Landing page adalah pintu masuk website Lapor Balik. Dalam beberapa detik, pengunjung dan juri harus paham:

1. Apa itu Lapor Balik dan untuk siapa.
2. Kenapa aplikasi ini ada dan apa bedanya dengan aplikasi pelaporan yang sudah ada.
3. Cara melapor hanya dalam tiga langkah.
4. Di mana tombol untuk mulai melapor atau mengecek status.

**Aksi utama:** tekan **Lapor Sekarang**.
**Aksi kedua:** tekan **Cek Status Laporan**.

## 2. Identitas Visual

### 2.1 Latar dan motif

- **Latar utama:** motif batik sebagai pola dekoratif. Pola tidak dipakai di hero, yang tampil sebagai visual foto penuh. Pola dipakai di footer dan CTA akhir dengan opacity rendah, supaya teks tetap terbaca.
- **Motif:** buat pola original yang terinspirasi unsur Jakarta dan Betawi (misalnya bentuk ondel-ondel yang disederhanakan, atau pola kembang khas Betawi). Hindari menyalin motif batik tertentu secara utuh.
- **Visual kota:** foto nyata Jakarta (Monas, Kota Tua, jalan raya) dipakai sebagai latar hero atau kartu visual, dengan overlay gelap supaya kontras tetap aman.

### 2.2 Palet warna

| Peran       | Warna   | Contoh pemakaian                                |
| ----------- | ------- | ----------------------------------------------- |
| Kuning emas | #F5B700 | Tombol utama, aksen ikon, highlight             |
| Merah       | #C62828 | Status penting, peringatan, aksen batik         |
| Oranye      | #F57C00 | Tombol sekunder, hover, badge status "Diproses" |
| Hitam       | #1A1A1A | Teks utama, latar navbar, overlay foto          |
| Putih       | #FFFFFF | Teks di atas latar gelap, kartu konten          |

**Aturan pemakaian:**

- Tombol utama selalu kuning dengan teks hitam, supaya kontras aman.
- Merah hanya untuk hal yang perlu perhatian (status, peringatan), jangan dipakai untuk dekorasi besar.
- Latar hero gelap (hitam dengan foto dan overlay) agar warna kuning dan putih menonjol.

### 2.3 Tipografi

- Font utama: **Plus Jakarta Sans** (Google Fonts, gratis) untuk judul dan isi. Font ini dibuat oleh studio Indonesia dan sesuai dengan konteks Jakarta.
- Alternatif jika tim ingin kontras judul lebih tegas: Montserrat untuk judul hero, dan Plus Jakarta Sans untuk isi.
- Judul hero besar dan tebal, teks isi minimal 16 px di HP.

## 3. Pengguna Landing Page

| Pengguna                                          | Yang dicari di halaman ini                                          |
| ------------------------------------------------- | ------------------------------------------------------------------- |
| Warga Jakarta yang punya masalah di lingkungannya | Cara cepat melapor, dan apakah laporannya akan ditindak             |
| Warga yang ragu melapor karena takut privasi      | Penjelasan bahwa izin minimal dan identitas dijaga                  |
| Juri lomba                                        | Kejelasan tema, kegunaan, dan kualitas tampilan dalam waktu singkat |

## 4. Struktur Halaman

Urutan dari atas ke bawah:

1. Navbar
2. Hero
3. Kenapa Lapor Balik ada
4. Tujuan (goals) aplikasi
5. Layanan yang disediakan
6. Tutorial melapor
7. Ajakan bertindak (CTA) akhir
8. Footer

## 5. Spesifikasi per Bagian

### 5.1 Navbar

**Layout (dari kiri ke kanan):**

- Logo dan nama **Lapor Balik** (kiri).
- Menu di tengah: Beranda, Layanan, Cara Melapor, Tentang.
- Di kanan: ikon cari (opsional), avatar atau ikon akun (opsional, untuk petugas nanti), dan ikon menu.
- Tombol **Lapor Sekarang** berwarna kuning di kanan navbar.

**Perilaku:**

- Latar hitam transparan, tetap di atas saat digulir (sticky).
- Di HP, menu tengah berubah menjadi ikon hamburger. Tombol Lapor Sekarang tetap terlihat.
- Setiap menu melompat ke bagian yang sesuai (anchor).

**Kriteria penerimaan:** tombol Lapor Sekarang bisa diakses tanpa menggulir ke atas.

### 5.2 Hero

Hero mengikuti referensi yang sudah disepakati: teks di kiri, kumpulan kartu foto bertumpuk di kanan.

**Sisi kiri (teks):**

- Judul besar dua baris, contoh: **"Laporkan masalah kotamu, pantau sampai beres."**
- Subjudul satu kalimat: "Warga Jakarta bisa melapor jalan rusak, lampu mati, sampah, dan genangan, lalu melihat statusnya sampai selesai."
- Tombol utama kuning: **Lapor Sekarang** dengan ikon panah.
- Tombol sekunder (garis putih): **Cek Status Laporan**.
- Keterangan kecil: "Tanpa login untuk melapor."

**Sisi kanan (visual):**

- Visual kota ditampilkan satu per satu, bukan sekaligus. Urutan dan waktunya:
  1. Slide pertama: Bundaran HI (langsung tampil).
  2. Slide kedua: Monumen Nasional, muncul 0,5 detik setelah slide pertama.
  3. Slide ketiga: Kota Tua, muncul 0,5 detik setelah slide kedua.
- Setiap foto ditampilkan penuh di seluruh latar hero, dengan label nama lokasi di sudut bawah.
- Transisi antar foto memakai fade halus, bukan geser, supaya tidak mengganggu teks di kiri.
- Animasi berjalan sekali saat halaman dibuka, lalu berhenti di foto terakhir. Pengguna bisa menekan titik navigasi kecil (1, 2, 3) untuk melihat foto tertentu.
- Maksimal tiga foto supaya ringan.

**Latar hero:**

- Hero berupa visual foto penuh (full-bleed) Jakarta, tanpa pola batik.
- Overlay gradasi dari hitam ke transparan di sisi kiri supaya teks tetap terbaca.

**Perilaku responsif:**

- Di HP, teks di atas, lalu kartu foto ditampilkan satu per satu dengan geser (swipe). Tombol Lapor Sekarang tetap satu layar dengan judul.
- Di laptop, dua kolom seperti referensi.

**Kriteria penerimaan:**

- Judul dan tombol utama terlihat tanpa menggulir di HP maupun laptop.
- Teks tetap terbaca di atas foto (kontras minimal sesuai standar).

### 5.3 Kenapa Lapor Balik Ada

Tiga kartu singkat dengan ikon kuning:

1. **Lapor sering terasa sia-sia.** Warga melapor tapi tidak tahu apakah ditindak.
2. **Izin terasa berlebihan.** Banyak aplikasi meminta akses lokasi dan foto yang tidak perlu.
3. **Klaim "selesai" tidak bisa dicek.** Warga belum punya cara memastikan laporannya beres.

**Catatan konten:** jangan mengutip angka atau nama aplikasi lain secara langsung di halaman.

### 5.4 Tujuan (Goals) Aplikasi

Tiga tujuan dengan ikon dan satu kalimat pendukung:

1. **Mempermudah warga melapor** dalam tiga langkah.
2. **Membuat tindak lanjut terlihat** lewat nomor tiket dan status yang jelas.
3. **Memberi warga suara** untuk memastikan laporan benar-benar selesai.

### 5.5 Layanan yang Disediakan

Maksimal empat kartu:

| Layanan          | Deskripsi singkat                               | Status di MVP |
| ---------------- | ----------------------------------------------- | ------------- |
| Lapor masalah    | Kirim laporan dengan foto, kategori, dan lokasi | Ada           |
| Cek status       | Pantau laporan dengan nomor tiket               | Ada           |
| Konfirmasi warga | Tandai laporan sudah beres atau belum           | Pelengkap     |
| Peta laporan     | Lihat laporan di sekitar kamu                   | Pelengkap     |

**Aturan:** layanan yang ditampilkan harus berjalan di prototipe. Layanan pelengkap diberi label "Segera hadir" atau disembunyikan.

Kategori laporan ditampilkan sebagai ikon kecil di kartu Lapor masalah: Jalan rusak, Lampu mati, Sampah, Genangan, Parkir liar, Lainnya.

### 5.6 Tutorial Melapor

Tiga langkah bernomor dengan ilustrasi atau tangkapan layar:

1. **Foto dan ceritakan.** Ambil foto (opsional) dan tulis deskripsi singkat.
2. **Pilih kategori.** Pilih jenis masalah dari daftar.
3. **Tandai lokasi dan kirim.** Gunakan GPS atau geser pin, lalu kirim. Simpan nomor tiket.

Tambahan: penjelasan "Lokasi hanya dipakai untuk menandai titik laporan. Kamu bisa mengisi lokasi secara manual." Tombol **Mulai Lapor** di akhir bagian.

### 5.7 CTA Akhir

- Judul pendek: "Ada masalah di lingkunganmu? Laporkan sekarang."
- Latar merah atau kuning dengan pola batik tipis.
- Tombol **Lapor Sekarang** dan tautan kecil **Cek Status**.

### 5.8 Footer

- Latar hitam dengan pola batik tipis berwarna kuning atau merah.
- Logo, nama, dan satu kalimat tujuan.
- Kolom tautan: Beranda, Layanan, Cara Melapor, Cek Status, Tentang.
- Kolom bantuan: kebijakan privasi, syarat penggunaan, dan kontak (placeholder email).
- Keterangan: "Data di halaman ini adalah data simulasi untuk keperluan demo."
- Hak cipta dan tahun.

## 6. Konten dan Nada Bahasa

- Bahasa Indonesia santai tapi jelas.
- Kalimat pendek, satu ide per kalimat.
- Jangan mengklaim fitur yang belum berjalan di prototipe.
- Label "Data simulasi" wajib muncul di bagian yang menampilkan contoh laporan.

## 7. Responsif

| Ukuran layar             | Perilaku                                                    |
| ------------------------ | ----------------------------------------------------------- |
| HP (360 px)              | Satu kolom, menu hamburger, kartu foto digeser              |
| Tablet (768 px)          | Dua kolom untuk kartu layanan                               |
| Laptop (1280 px ke atas) | Hero full visual foto, teks di kiri, animasi foto berurutan |

## 8. Kebutuhan Non-Fungsional

- Halaman awal tampil dalam 3 detik di koneksi standar. Foto hero dikompres.
- Semua gambar punya teks alternatif.
- Navigasi bisa dilakukan dengan keyboard.
- Pola batik dan foto latar tidak menghalangi pembacaan teks.
- Tidak ada captcha atau login di landing page.

## 9. Kriteria Keberhasilan

- Pengunjung bisa menjelaskan apa itu Lapor Balik dalam 10 detik.
- Tombol Lapor Sekarang terlihat di layar pertama.
- Palet warna konsisten di semua bagian.
- Semua layanan yang ditampilkan bisa diklik dan berfungsi.
- Tidak ada teks atau tombol yang terpotong di HP.

## 10. Di Luar Scope Landing Page

- Form lapor dan halaman cek status (PRD terpisah).
- Login petugas dan admin.
- Analitik pengunjung.

## 11. Keputusan yang Perlu Tim Ambil

- Pola batik: buat sendiri atau pakai pola berlisensi bebas.
- Foto Jakarta: pakai foto milik tim sendiri atau foto berlisensi bebas.
- Font: Plus Jakarta Sans sebagai font utama (sudah disepakati), dan apakah Montserrat dipakai untuk judul hero.
- Alamat email kontak di footer.
- Apakah layanan pelengkap ditampilkan sebagai "Segera hadir" atau disembunyikan.
