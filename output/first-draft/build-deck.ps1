$ErrorActionPreference = 'Stop'

$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$out = $PSScriptRoot
$pptxPath = Join-Path $out 'WIA_FSDMIA2026_TrioCungpruy.pptx'
$pdfPath = Join-Path $out 'WIA_FSDMIA2026_TrioCungpruy.pdf'
$landingImage = Join-Path $out 'assets\landing.png'
$reportImage = Join-Path $out 'assets\lapor.png'
$cityImage = Join-Path $root 'public\landingpage.jpeg'

foreach ($generatedFile in @($pptxPath, $pdfPath)) {
  if (Test-Path -LiteralPath $generatedFile) { Remove-Item -LiteralPath $generatedFile -Force }
}

function Rgb([int]$r, [int]$g, [int]$b) { return ($r -bor ($g -shl 8) -bor ($b -shl 16)) }
$ink = Rgb 26 26 26
$cream = Rgb 249 247 241
$white = Rgb 255 255 255
$gold = Rgb 245 183 0
$muted = Rgb 96 91 82
$line = Rgb 211 205 191

function Add-Rect($slide, [double]$x, [double]$y, [double]$w, [double]$h, [int]$color, [int]$transparency = 0, [int]$stroke = -1) {
  $s = $slide.Shapes.AddShape(1, $x, $y, $w, $h)
  $s.Fill.ForeColor.RGB = $color
  $s.Fill.Transparency = [single]($transparency / 100)
  if ($stroke -ge 0) {
    $s.Line.Visible = -1
    $s.Line.ForeColor.RGB = $stroke
    $s.Line.Weight = 1
  } else { $s.Line.Visible = 0 }
  return $s
}

function Add-Line($slide, [double]$x1, [double]$y1, [double]$x2, [double]$y2, [int]$color, [double]$weight = 1.5) {
  $s = $slide.Shapes.AddLine($x1, $y1, $x2, $y2)
  $s.Line.ForeColor.RGB = $color
  $s.Line.Weight = $weight
  return $s
}

function Add-Text($slide, [string]$value, [double]$x, [double]$y, [double]$w, [double]$h, [double]$size, [int]$color, [bool]$bold = $false, [int]$align = 1) {
  $s = $slide.Shapes.AddTextbox(1, $x, $y, $w, $h)
  $s.TextFrame.MarginLeft = 0
  $s.TextFrame.MarginRight = 0
  $s.TextFrame.MarginTop = 0
  $s.TextFrame.MarginBottom = 0
  $s.TextFrame.WordWrap = -1
  $s.TextFrame.TextRange.Text = $value
  $s.TextFrame.TextRange.Font.Name = 'Arial'
  $s.TextFrame.TextRange.Font.Size = $size
  $s.TextFrame.TextRange.Font.Bold = $(if ($bold) { -1 } else { 0 })
  $s.TextFrame.TextRange.Font.Color.RGB = $color
  $s.TextFrame.TextRange.ParagraphFormat.Alignment = $align
  return $s
}

function Add-Image($slide, [string]$path, [double]$x, [double]$y, [double]$w, [double]$h) {
  return $slide.Shapes.AddPicture($path, 0, -1, $x, $y, $w, $h)
}

function New-Slide($deck, [int]$number, [int]$background = $cream) {
  $s = $deck.Slides.Add($number, 12)
  Add-Rect $s 0 0 960 540 $background | Out-Null
  return $s
}

function Add-Footer($slide, [int]$number, [bool]$dark = $false) {
  $c = $(if ($dark) { Rgb 219 210 188 } else { $muted })
  Add-Text $slide 'LAPOR BALIK  /  FIRST DRAFT' 52 508 500 17 10 $c $true | Out-Null
  Add-Text $slide ('{0:00}' -f $number) 865 508 43 17 10 $c $true 3 | Out-Null
}

$ppt = $null
$deck = $null
try {
  $ppt = New-Object -ComObject PowerPoint.Application
  $ppt.Visible = -1
  $deck = $ppt.Presentations.Add()
  $deck.PageSetup.SlideWidth = 960
  $deck.PageSetup.SlideHeight = 540

  # 1. Cover
  $s = New-Slide $deck 1 $ink
  Add-Image $s $cityImage 0 0 960 540 | Out-Null
  Add-Rect $s 0 0 960 540 $ink 46 | Out-Null
  Add-Rect $s 52 58 47 4 $gold | Out-Null
  Add-Text $s 'WEB IN ACTION  /  MIA 2026' 52 79 430 25 15 $gold $true | Out-Null
  Add-Text $s 'Lapor Balik' 52 160 760 90 62 $white $true | Out-Null
  Add-Text $s 'Laporan warga dengan jejak tindak lanjut yang bisa dipantau.' 55 264 600 75 25 $white | Out-Null
  Add-Text $s 'Trio Cungpruy' 55 445 400 29 17 $gold $true | Out-Null
  Add-Text $s 'First Draft  /  1 November 2026' 55 475 500 24 13 $white | Out-Null

  # 2. Problem
  $s = New-Slide $deck 2 $ink
  Add-Text $s 'Masalah yang kami angkat' 52 48 800 40 17 $gold $true | Out-Null
  Add-Text $s "Warga bisa melapor.`nLalu bagaimana tahu`napa yang terjadi?" 52 111 830 220 42 $white $true | Out-Null
  Add-Line $s 52 362 908 362 $gold 2 | Out-Null
  Add-Text $s 'Laporan perlu punya nomor yang dapat dicari, status yang jelas, dan kesempatan bagi warga untuk memastikan masalah benar-benar selesai.' 52 383 825 80 21 $white | Out-Null
  Add-Footer $s 2 $true

  # 3. Concept and goals
  $s = New-Slide $deck 3
  Add-Text $s 'Konsep' 52 45 600 38 17 $muted $true | Out-Null
  Add-Text $s 'Lapor Balik' 52 89 730 70 47 $ink $true | Out-Null
  Add-Text $s 'Warga Jakarta membuat laporan tanpa login, menyimpan nomor tiket, lalu memantau perkembangannya di halaman status.' 52 178 660 95 24 $ink | Out-Null
  Add-Line $s 52 309 910 309 $line 2 | Out-Null
  Add-Text $s '01  Kirim laporan' 52 340 245 36 21 $ink $true | Out-Null
  Add-Text $s '02  Simpan tiket' 352 340 245 36 21 $ink $true | Out-Null
  Add-Text $s '03  Cek status' 652 340 245 36 21 $ink $true | Out-Null
  Add-Text $s 'Tujuan: membuat tindak lanjut lebih mudah dilihat dan dipahami warga.' 52 430 790 42 18 $muted | Out-Null
  Add-Footer $s 3

  # 4. Citizen sitemap: implemented routes
  $s = New-Slide $deck 4
  Add-Text $s 'Sitemap: warga' 52 48 660 60 42 $ink $true | Out-Null
  Add-Text $s 'Halaman yang sudah tersedia' 52 104 650 30 18 $muted | Out-Null
  Add-Rect $s 358 159 244 60 $ink | Out-Null
  Add-Text $s 'Beranda  /' 378 175 204 34 23 $white $true 2 | Out-Null
  Add-Line $s 480 219 480 271 $gold 3 | Out-Null
  Add-Line $s 243 271 717 271 $gold 3 | Out-Null
  Add-Line $s 243 271 243 302 $gold 3 | Out-Null
  Add-Line $s 717 271 717 302 $gold 3 | Out-Null
  Add-Rect $s 92 302 302 100 $white 0 $line | Out-Null
  Add-Rect $s 566 302 302 100 $white 0 $line | Out-Null
  Add-Text $s 'Buat laporan  /lapor' 112 324 262 31 22 $ink $true 2 | Out-Null
  Add-Text $s 'Form tiga langkah' 112 360 262 28 15 $muted $false 2 | Out-Null
  Add-Text $s 'Cek status  /status' 586 324 262 31 22 $ink $true 2 | Out-Null
  Add-Text $s 'Cari laporan dengan tiket' 586 360 262 28 15 $muted $false 2 | Out-Null
  Add-Text $s 'Ketiga halaman sudah tersedia dalam prototipe.' 52 453 740 30 18 $muted | Out-Null
  Add-Footer $s 4

  # 5. Officer sitemap: planned routes
  $s = New-Slide $deck 5 $ink
  Add-Text $s 'Sitemap: petugas' 52 42 780 61 40 $white $true | Out-Null
  Add-Text $s 'Rencana pengembangan. Belum tersedia dalam prototipe.' 52 99 855 29 17 $gold $true | Out-Null
  Add-Rect $s 52 149 265 61 (Rgb 47 47 47) 0 $muted | Out-Null
  Add-Text $s 'Masuk petugas' 67 160 235 27 21 $white $true | Out-Null
  Add-Text $s '/petugas/masuk' 67 187 235 19 13 $gold | Out-Null
  Add-Line $s 317 180 349 180 $gold 2.5 | Out-Null
  Add-Rect $s 349 149 559 61 (Rgb 47 47 47) 0 $gold | Out-Null
  Add-Text $s 'Dashboard' 365 158 214 29 22 $white $true | Out-Null
  Add-Text $s '/petugas' 575 159 314 23 15 $gold | Out-Null
  Add-Text $s 'Ringkasan status dan laporan terbaru' 575 183 314 20 13 $white | Out-Null
  Add-Line $s 628 210 628 240 $gold 2 | Out-Null
  Add-Line $s 188 240 772 240 $gold 2 | Out-Null
  Add-Line $s 188 240 188 259 $gold 2 | Out-Null
  Add-Line $s 480 240 480 259 $gold 2 | Out-Null
  Add-Line $s 772 240 772 259 $gold 2 | Out-Null
  Add-Rect $s 52 259 272 92 (Rgb 47 47 47) 0 $muted | Out-Null
  Add-Rect $s 344 259 272 92 (Rgb 47 47 47) 0 $muted | Out-Null
  Add-Rect $s 636 259 272 92 (Rgb 47 47 47) 0 $muted | Out-Null
  Add-Text $s 'Daftar laporan' 67 271 242 26 20 $white $true | Out-Null
  Add-Text $s '/petugas/laporan' 67 299 242 20 13 $gold | Out-Null
  Add-Text $s 'Cari dan saring laporan' 67 323 242 22 13 $white | Out-Null
  Add-Text $s 'Analitik' 359 271 242 26 20 $white $true | Out-Null
  Add-Text $s '/petugas/analitik' 359 299 242 20 13 $gold | Out-Null
  Add-Text $s 'Tren kategori dan lokasi' 359 323 242 22 13 $white | Out-Null
  Add-Text $s 'Riwayat aktivitas' 651 271 242 26 20 $white $true | Out-Null
  Add-Text $s '/petugas/aktivitas' 651 299 242 20 13 $gold | Out-Null
  Add-Text $s 'Jejak perubahan status' 651 323 242 22 13 $white | Out-Null
  Add-Line $s 188 351 188 380 $gold 2 | Out-Null
  Add-Rect $s 52 380 856 90 (Rgb 47 47 47) 0 $muted | Out-Null
  Add-Text $s 'Detail laporan' 67 392 265 31 22 $white $true | Out-Null
  Add-Text $s '/petugas/laporan/[id]' 334 398 320 22 14 $gold | Out-Null
  Add-Text $s 'Verifikasi, catat tindak lanjut, perbarui status, dan lampirkan bukti.' 67 436 819 24 16 $white | Out-Null
  Add-Footer $s 5 $true

  # 6. Editable wireframe
  $s = New-Slide $deck 6
  Add-Text $s 'Wireframe halaman utama' 52 42 790 55 39 $ink $true | Out-Null
  Add-Text $s 'Susunan informasi dan jalan masuk ke dua tugas utama warga.' 52 94 800 30 17 $muted | Out-Null
  Add-Rect $s 85 143 790 297 $white 0 $line | Out-Null
  Add-Rect $s 85 143 790 38 $ink | Out-Null
  Add-Text $s 'LAPOR BALIK' 104 154 240 22 12 $white $true | Out-Null
  Add-Text $s 'Beranda     Layanan     Cara Melapor' 480 154 360 22 12 $white | Out-Null
  Add-Rect $s 85 181 790 132 (Rgb 225 218 202) | Out-Null
  Add-Text $s "Kotamu punya cerita.`nSuaramu punya arti." 112 204 470 75 25 $ink $true | Out-Null
  Add-Rect $s 112 279 124 23 $gold | Out-Null
  Add-Text $s 'Lapor Sekarang' 119 283 111 16 9 $ink $true 2 | Out-Null
  Add-Rect $s 245 279 124 23 $white 0 $ink | Out-Null
  Add-Text $s 'Cek Status' 255 283 103 16 9 $ink $true 2 | Out-Null
  Add-Rect $s 105 336 228 75 $cream 0 $line | Out-Null
  Add-Rect $s 365 336 228 75 $cream 0 $line | Out-Null
  Add-Rect $s 625 336 228 75 $cream 0 $line | Out-Null
  Add-Text $s 'Kenapa ada' 129 357 175 30 17 $ink $true 2 | Out-Null
  Add-Text $s 'Layanan' 388 357 180 30 17 $ink $true 2 | Out-Null
  Add-Text $s 'Cara melapor' 646 357 185 30 17 $ink $true 2 | Out-Null
  Add-Footer $s 6

  # 7. Features and status
  $s = New-Slide $deck 7
  Add-Text $s 'Fitur utama' 52 48 710 60 42 $ink $true | Out-Null
  Add-Text $s 'Yang sudah berjalan dalam prototipe' 52 106 800 30 18 $muted | Out-Null
  $items = @(
    @('01', 'Buat laporan', 'Deskripsi, kategori, alamat, serta foto dan GPS opsional.'),
    @('02', 'Nomor tiket', 'Tiket dibuat saat laporan berhasil disimpan.'),
    @('03', 'Pantau status', 'Cari tiket, lihat tahap penanganan, lalu beri konfirmasi warga.')
  )
  $yy = 161
  foreach ($item in $items) {
    Add-Line $s 52 ($yy - 10) 908 ($yy - 10) $line 1.3 | Out-Null
    Add-Text $s $item[0] 52 $yy 75 38 23 $gold $true | Out-Null
    Add-Text $s $item[1] 143 $yy 265 38 23 $ink $true | Out-Null
    Add-Text $s $item[2] 422 $yy 470 67 17 $ink | Out-Null
    $yy += 98
  }
  Add-Rect $s 52 454 856 37 (Rgb 233 226 211) | Out-Null
  Add-Text $s 'Saat ini data tersimpan di browser. Status berubah lewat tombol simulasi.' 67 464 825 22 14 $ink | Out-Null
  Add-Footer $s 7

  # 8. Screenshot landing page
  $s = New-Slide $deck 8 $ink
  Add-Text $s 'Halaman yang sudah jadi' 42 43 510 40 17 $gold $true | Out-Null
  Add-Text $s 'Landing page' 42 112 265 112 38 $white $true | Out-Null
  Add-Text $s 'Menjelaskan tujuan Lapor Balik dan mengarahkan warga ke form laporan atau pencarian status.' 42 242 260 159 18 $white | Out-Null
  Add-Image $s $landingImage 325 91 593 371 | Out-Null
  Add-Footer $s 8 $true

  # 9. Screenshot report form
  $s = New-Slide $deck 9 $ink
  Add-Text $s 'Halaman yang sudah jadi' 42 43 510 40 17 $gold $true | Out-Null
  Add-Text $s 'Buat laporan' 42 112 265 112 38 $white $true | Out-Null
  Add-Text $s 'Form mengumpulkan cerita, kategori, dan lokasi. Foto serta akses GPS bersifat opsional.' 42 242 260 159 18 $white | Out-Null
  Add-Image $s $reportImage 325 91 593 371 | Out-Null
  Add-Footer $s 9 $true

  # 10. Progress and next step
  $s = New-Slide $deck 10
  Add-Text $s 'Progress dan langkah berikutnya' 52 48 850 102 40 $ink $true | Out-Null
  Add-Line $s 52 159 908 159 $gold 3 | Out-Null
  Add-Text $s 'Sudah ada' 52 193 310 39 24 $ink $true | Out-Null
  Add-Text $s 'Landing page, form laporan tiga langkah, nomor tiket, halaman cek status, dan konfirmasi warga dalam demo.' 52 241 371 157 20 $ink | Out-Null
  Add-Text $s 'Menuju final submission' 505 193 403 39 24 $ink $true | Out-Null
  Add-Text $s 'Bangun dashboard petugas dan penyimpanan bersama, lalu uji alur laporan di ponsel. Integrasi ke instansi masih menjadi rencana pengembangan.' 505 241 390 180 20 $ink | Out-Null
  Add-Text $s 'Repository: github.com/Mawannskie22/triocungpruy' 52 455 780 31 15 $muted | Out-Null
  Add-Footer $s 10

  $deck.SaveAs($pptxPath, 24)
  $deck.SaveAs($pdfPath, 32)
  Write-Output "PPTX=$pptxPath"
  Write-Output "PDF=$pdfPath"
  Write-Output "SLIDES=$($deck.Slides.Count)"
}
finally {
  if ($deck) { $deck.Close() }
  if ($ppt) { $ppt.Quit() }
}
