# Pemisahan Pengelolaan Bahasa Berita

Memisahkan pengelolaan konten berita antara Bahasa Indonesia (ID) dan English (EN) agar menjadi dua menu terpisah di panel admin. Hal ini memudahkan tim marketing untuk fokus pada satu bahasa saja saat membuat berita.

## Perubahan yang Diusulkan

### Data & Konfigurasi

#### [NEW] [news_id.json](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/public/data/news_id.json)
- Berisi draf berita versi Bahasa Indonesia yang diekstrak dari `news.json`.

#### [NEW] [news_en.json](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/public/data/news_en.json)
- Berisi draf berita versi English yang diekstrak daripada `news.json`.

#### [MODIFY] [config.yml](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/public/admin/config.yml)
- Membagi koleksi berita menjadi dua:
    - **Berita (ID)**: Mengarah ke `news_id.json`.
    - **News (EN)**: Mengarah ke `news_en.json`.
- Menghapus struktur "Object" (pilihan bahasa di dalam satu form) dan menggantinya dengan input teks sederhana untuk masing-masing koleksi.

#### [DELETE] [news.json](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/public/data/news.json)
- File lama akan dihapus setelah data berhasil dipindahkan ke file baru.

### Frontend Logic

#### [MODIFY] [main.js](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/main.js)
- Memperbarui fungsi `renderNews(lang)` agar mengambil file yang sesuai (`news_id.json` atau `news_en.json`) berdasarkan bahasa yang aktif saat ini.

## Rencana Verifikasi

### Verifikasi Manual
1.  Buka panel admin dan pastikan ada dua menu: **Berita (ID)** dan **News (EN)**.
2.  Coba tambah berita di **Berita (ID)** dan pastikan hanya muncul saat website di-set ke Bahasa Indonesia.
3.  Coba tambah berita di **News (EN)** dan pastikan hanya muncul saat website di-set ke English.
4.  Pastikan gambar dan tanggal tetap berfungsi dengan benar.
