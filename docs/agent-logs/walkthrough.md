# Panduan Pengaturan Autentikasi CMS

Decap CMS sekarang telah dikonfigurasi dengan benar menggunakan GitHub OAuth melalui Vercel Serverless Functions. Ini memungkinkan Anda mengelola konten tanpa memerlukan layanan proxy pihak ketiga.

## Perubahan yang Dilakukan

### Konfigurasi CMS
- Menambahkan `site_url` ke [config.yml](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/public/admin/config.yml) untuk memastikan CMS memiliki konteks domain yang benar.
- Menghapus widget Netlify Identity dari [index.html](file:///c:/Users/Yuko/.gemini/antigravity/playground/surya-pangan-web/public/admin/index.html) karena tidak diperlukan untuk setup ini.
- **Memperbaiki Visibilitas Koleksi**: Memindahkan "Berita & Artikel" ke tingkat paling atas di sidebar. Sekarang menu ini tidak lagi tersembunyi di dalam menu "Data".
- **Memperbaiki Jalur Media**: Memperbarui jalur folder media agar gambar dapat muncul dengan benar di panel admin.

### Verifikasi Backend & Deployment
- Fungsi `api/auth.js` dan `api/callback.js` telah menangani aliran OAuth GitHub dengan benar.
- **Penting**: Semua perbaikan (termasuk penghapusan Netlify Identity dan perbaikan login) telah **diunggah (deploy)** ke repositori GitHub Anda. Hal ini memastikan situs live di Vercel menggunakan kode terbaru.

## Cara Mengetes
1.  **Tunggu 1 menit** agar Vercel selesai membangun (build) situs dengan kode terbaru.
2.  Buka kembali [https://surya-pangan-web.vercel.app/admin/](https://surya-pangan-web.vercel.app/admin/).
3.  Lakukan **Hard Refresh** (Tekan **Ctrl + Shift + R**).
4.  Klik tombol **Login with GitHub**.
3.  Jendela pop-up akan muncul, klik "Authorize" jika diminta, lalu akan muncul pesan "Authentication successful!".
4.  Jendela pop-up akan tertutup otomatis, dan panel admin utama akan menampilkan koleksi konten Anda.

## Panduan Tim Marketing

### 1. Menambahkan Pengguna (Tim Marketing)
Karena kita menggunakan GitHub sebagai database, akses pengguna dikelola langsung melalui GitHub:
1.  Minta tim Marketing Anda membuat akun **GitHub**.
2.  Buka repositori Anda di GitHub: [yuko-mlg/surya-pangan-web](https://github.com/yuko-mlg/surya-pangan-web).
3.  Pergi ke tab **Settings** -> **Collaborators**.
4.  Klik **Add people** dan masukkan username GitHub mereka.
5.  Pilih akses **"Write"** agar mereka bisa menyimpan perubahan.
6.  Setelah mereka menerima undangan via email, mereka bisa langsung login di [halaman admin](https://surya-pangan-web.vercel.app/admin/).

### 2. Membuat Draf & Penjadwalan (Editorial Workflow)
Saya telah mengaktifkan fitur **Workflow** untuk manajemen konten:
- **Draf**: Saat membuat berita baru, pilih **"Save as Draft"**. Berita ini tidak akan muncul di website sampai Anda menerbitkannya.
- **Workflow Tab**: Di bagian atas panel admin, sekarang ada tab **"Workflow"**. Di sana Anda bisa melihat berita yang sedang dalam status:
    - **Drafts**: Belum siap diterbitkan.
    - **In Review**: Sedang diperiksa.
    - **Ready**: Siap dipublikasikan.
- **Publish**: Untuk menerbitkan berita, klik berita tersebut di tab Workflow dan pilih **"Publish"**. Berita akan langsung muncul di website Surya Pangan.

### 3. Tombol WhatsApp Melayang "Fly"
Tombol kontak WhatsApp kini melayang di pojok kanan bawah dengan desain modern:
- **Animasi Pulsing**: Menarik perhatian secara halus.
- **Responsif**: Ukuran menyesuaikan layar handphone.
- **Auto-Fix**: Desain telah diperbaiki (encoding fixed) agar tampil konsisten di semua browser.

### 4. Fitur Terjemahan Berita Otomatis
Tim marketing kini tidak harus menulis berita dua kali:
- **Alur Kerja**: Marketing cukup mengisi berita di draf **Berita (ID)**.
- **Otomatisasi**: Jika draf **News (EN)** kosong, website akan otomatis menerjemahkan judul dan ringkasan berita ke Bahasa Inggris secara real-time.
- **Fleksibilitas**: Anda tetap bisa mengisi **News (EN)** secara manual jika ingin hasil terjemahan yang lebih spesifik. Website akan memprioritaskan draf manual jika tersedia.

---

## Panduan Pengguna Baru (Tim Marketing)

### Cara Menulis Berita dengan Terjemahan Otomatis
1.  Buka panel admin dan login melalui GitHub.
2.  Pilih menu **Berita (ID)**.
3.  Tambahkan entri berita baru dalam Bahasa Indonesia.
4.  Klik **Save** atau **Publish**.
5.  Cek website versi English. Berita tersebut akan otomatis muncul dalam Bahasa Inggris!

### Akses Panel Admin
1.  Buka [https://surya-pangan-web.vercel.app/admin/](https://surya-pangan-web.vercel.app/admin/)
2.  Klik tombol **"Login with GitHub"**.
3.  Anda akan diarahkan ke GitHub untuk otorisasi. Setelah berhasil, Anda akan masuk ke dashboard Decap CMS.

---

## Sinkronisasi Data (Penting untuk Developer)

### Mengambil Update dari Tim Marketing ke Lokal
Setiap kali tim Marketing menerbitkan berita, data akan tersimpan di GitHub. Untuk menyamakan data di komputer lokal Anda, jalankan:
```bash
git pull origin main
```

### Mengirim Update dari Lokal ke Hosting
Gunakan alur Git standar untuk mengirim perubahan kode atau data ke server:
```bash
git add .
git commit -m "update: catatan perubahan"
git push origin main
```
