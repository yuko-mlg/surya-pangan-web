# Terjemahan Berita Otomatis

Fitur ini memungkinkan berita yang ditulis dalam Bahasa Indonesia (di menu "Berita ID") otomatis diterjemahkan ke Bahasa Inggris saat pengunjung membuka versi website English, jika draf versi Bahasa Inggris belum dibuat secara manual.

## Perubahan yang Diusulkan

### Frontend Logic

#### [MODIFY] [main.js](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/main.js)
- Menambahkan fungsi `translateText(text, targetLang)` yang memanggil Google Translate API (client-side).
- Memperbarui fungsi `renderNews(lang)`:
    1.  Jika `lang === 'en'`, sistem akan mencoba memuat `news_en.json`.
    2.  Jika `news_en.json` kosong atau gagal dimuat, sistem akan memuat `news_id.json`.
    3.  Setiap judul dan isi berita dari `news_id.json` akan diterjemahkan secara otomatis ke Bahasa Inggris sebelum ditampilkan.
- Menambahkan cache sederhana agar terjemahan tidak dilakukan berulang kali pada pemuatan halaman yang sama.

## Rencana Verifikasi

### Verifikasi Manual
1.  Hapus semua draf di menu **News (EN)** di panel admin.
2.  Pastikan ada berita di menu **Berita (ID)**.
3.  Buka website dan pindah ke Bahasa Inggris.
4.  Pastikan berita dari versi Indonesia muncul dalam Bahasa Inggris secara otomatis.
