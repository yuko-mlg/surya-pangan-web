# Tambah Tombol WhatsApp Melayang (Floating)

Menambahkan tombol WhatsApp yang modern dan interaktif di pojok kanan bawah layar untuk memudahkan pengunjung menghubungi Surya Pangan secara langsung.

## Perubahan yang Diusulkan

### UI & Styling

#### [MODIFY] [index.html](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/index.html)
- Menambahkan elemen `<a>` untuk tombol WhatsApp sebelum tag penutup `</body>`.

#### [MODIFY] [style.css](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/style.css)
- Menambahkan gaya CSS untuk posisi `fixed`, warna hijau khas WhatsApp, animasi "pulsing", dan hover effects agar terlihat premium.

## Rencana Verifikasi

### Verifikasi Manual
1.  Buka website di browser.
2.  Pastikan tombol WhatsApp muncul di pojok kanan bawah.
3.  Uji tombol tersebut untuk memastikan ia membuka link chat WhatsApp dengan nomor yang benar (`+628176335737`).
4.  Cek responsivitas pada tampilan mobile.
