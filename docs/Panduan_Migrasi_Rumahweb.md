# Panduan Migrasi Website Surya Pangan ke Hosting Rumahweb

Dokumen ini berisi langkah-langkah detail untuk memindahkan website Surya Pangan yang saat ini berada di Vercel (`surya-pangan-web.vercel.app`) ke hosting sendiri di **Rumahweb** dengan menggunakan domain utama **suryapangan.com**.

Goal akhir dari panduan ini adalah memastikan semua fitur yang berjalan saat ini (website, AI Chat, form kontak Formspree, multi-bahasa, dll.) tetap dapat berfungsi dengan normal di hosting yang baru tanpa kehilangan data atau fitur.

---

## 🛑 Tahap 0: Update URL / Meta Data (Penting untuk SEO)
Sebelum memindahkan file, kita perlu menyesuaikan URL yang ada di dalam kode website agar SEO dan link sharing (seperti di WhatsApp/Facebook) mengarah ke domain baru yang resmi, bukan lagi ke Vercel.

**Langkah-langkah:**
1. Buka file `index.html` di kode sumber (source code) Anda.
2. Cari semua baris yang mengandung teks `https://surya-pangan-web.vercel.app/`.
3. Ganti (Replace) semuanya menjadi **`https://suryapangan.com/`**.
   *(Perhatikan bagian `<link rel="canonical">`, `hreflang`, `og:url`, `og:image`, `twitter:url`, `twitter:image`, dan `application/ld+json`).*
4. Lakukan hal yang sama pada file `sitemap.xml` dan `robots.txt` jika ada penunjuk URL ke Vercel.
5. Simpan perubahan.

---

## 📦 Tahap 1: Mempersiapkan File Website (Proses Build)
Website Surya Pangan saat ini dikembangkan menggunakan **Vite** (berdasarkan file `package.json`), sehingga Anda tidak bisa sekadar meng-upload folder aslinya. Anda harus mem-build-nya (mengubahnya menjadi versi statis production yang sudah dioptimasi) terlebih dahulu.

1. Buka Terminal (Command Prompt / PowerShell / Terminal bawaan VS Code) lalu pastikan Anda berada di dalam folder project `surya-pangan-web`.
2. Jika ada paket / dependensi yang belum ter-install, jalankan perintah ini terlebih dahulu:
   ```bash
   npm install
   ```
3. Lakukan proses "build" production dengan menjalankan perintah:
   ```bash
   npm run build
   ```
4. Setelah proses selesai (biasanya hanya beberapa detik), akan muncul folder baru bernama **`dist`** di dalam folder project Anda.
5. Buka folder `dist` tersebut menggunakan File Explorer biasa.
6. **Blok / Pilih semua** file dan folder yang ada **di dalam** folder `dist` (termasuk `index.html`, folder `assets`, dll.).
7. Klik kanan pada file-file yang sudah diblok tersebut, lalu pilih opsi untuk mengompres / jadikan format **.zip** (Misal beri nama: `suryapangan-web.zip`).
   *(Catatan Penting: Jangan nge-zip folder `dist`-nya secara langsung dari luar, melainkan **isi** dari folder `dist`-nya agar saat diekstrak nanti di hosting, file `index.html` ada di posisi paling luar, bukan terjebak di dalam folder `dist`).*

---

## 🌐 Tahap 2: Login ke Panel Hosting Rumahweb (cPanel)
Langkah selanjutnya adalah mengakses panel kontrol hosting Anda (cPanel) di Rumahweb.

1. Buka browser dan login ke **Client Area Rumahweb** (https://clientzone.rumahweb.com/).
2. Masukkan alamat email dan kata sandi akun Rumahweb Anda.
3. Setelah berhasil masuk dasbor, cari dan klik menu **Services (Layanan)** > **My Services**.
4. Klik pada paket hosting aktif yang terhubung dengan domain `suryapangan.com`.
5. Di panel informasi hosting (biasanya di sebelah kiri atau deretan menu atas), cari dan klik tombol **"Login to cPanel"**. Anda akan diarahkan ke halaman Control Panel.

---

## 📁 Tahap 3: Upload File Website ke File Manager
cPanel adalah antarmuka web untuk mengelola file dan pengaturan hosting Anda. Di tahap ini, kita akan mengupload file website (format `.zip`) yang sudah dibuat di Tahap 1 ke server publik.

1. Di dalam dashboard **cPanel**, scroll ke bawah cari bagian/kategori "Files", lalu klik ikon **File Manager**.
2. Di struktur direktori sebelah kiri, cari dan klik folder bernama **`public_html`**. (Ini adalah akar folder (root document) tempat file website Anda harus diletakkan agar bisa diakses publik secara online).
3. Jika di dalam folder `public_html` sudah ada file atau folder bawaan (misalnya `default.html`, `index.php` berisikan landing page default Rumahweb, atau folder `cgi-bin`), **hapus / delete** file HTML/PHP default tersebut agar tidak bentrok dengan website kita. (Folder `cgi-bin` boleh dibiarkan).
4. Klik tombol **Upload** yang berada di deretan icon menu bagian atas. Tab browser baru akan terbuka khusus untuk upload.
5. Klik tombol **Select File** lalu cari dan pilih file `suryapangan-web.zip` (file yang kita siapkan di Tahap 1 dari PC lokal Anda).
6. Tunggu hingga bar progress upload mencapai 100% dan berubah menjadi warna hijau.
7. Setelah sukses, tutup tab upload tersebut dan kembali ke tab **File Manager** sebelumnya.
8. Klik tombol **Reload** di menu bagian atas (jika file `.zip` belum muncul di daftar file `public_html`).
9. Klik kanan pada file `suryapangan-web.zip`, lalu pilih opsi **Extract**.
10. Akan muncul pop-up konfirmasi lokasi. Pastikan path/tujuannya adalah `/public_html`. Lalu klik tombol **Extract File(s)**.
11. Setelah proses ekstrak selesai, klik Close. Anda akan melihat file `index.html`, folder `assets`, dll berada langsung terurai di dalam folder `public_html`.
12. (Opsional) File `.zip` tadi sudah tidak dipakai lagi. Anda bisa klik lalu menghapusnya (Delete) untuk menghemat kapasitas storage hosting Anda.

---

## 🔒 Tahap 4: Aktivasi Keamanan SSL (HTTPS)
Sangat penting agar website `suryapangan.com` bisa diakses dengan ikon gembok aman (`https://`), bukan `http://` yang akan memunculkan peringatan "Not Secure" di browser pengunjung. Rumahweb menyediakan SSL/TLS gratis (Let's Encrypt / AutoSSL).

1. Kembali ke halaman utama dasbor **cPanel** (Anda bisa mengklik logo cPanel di sudut kiri atas File Manager).
2. Scroll dan cari kategori "Security" (Keamanan), lalu klik icon **Let's Encrypt SSL** atau **SSL/TLS Status**.
3. Cari nama domain Anda di daftar (biasanya tertulis `suryapangan.com` dan `www.suryapangan.com`).
4. Klik tombol/link **Issue** di deretan sebelah domain tersebut. (Jika menggunakan antarmuka Let's Encrypt SSL).
5. Pada halaman issue, biarkan pengaturannya default (pastikan metode validasi `http-01` tercentang jika ditanya), lalu tekan tombol **Issue** berwarna biru di bawah.
6. Tunggu proses loading beberapa detik sampai muncul pesan pop-up/notifikasi sukses berwarna hijau.
7. Sekarang, domain Anda sudah dienkripsi dan memiliki sertifikat keamanan HTTPS yang aktif secara otomatis.

---

## ⚙️ Tahap 5: Pengecekan Akhir & Testing URL
Sekarang, website seharusnya sudah bisa dikunjungi menggunakan domain suryapangan.com. 

1. Buka tab baru di browser Anda dan ketikkan alamat: **`https://suryapangan.com`** (atau `https://www.suryapangan.com`).
2. Periksa hal-hal krusial berikut untuk memastikan semua perpindahan berjalan sempurna:
   - **Tampilan Keseluruhan:** Pastikan gambar logo, background hero, kartu brand, produk, dan gambar mascot chef muncul semua. Jika ada gambar yang terlihat "pecah" atau hilang, itu berarti ada kesalahan link lokasi aset saat proses build, namun jika build benar hasilnya pasti akan sama persis.
   - **Interaksi & Animasi:** Pastikan saat di-scroll, navigasi menu berubah style dengan halus dan section bisa diklik/dipindahkan sesuai anchor link.
   - **Fitur Chatbot AI (Chef Surya):** Klik ikon berang-berang menggemaskan/robot chat di pojok kanan bawah, dan tes mengirimkan satu pesan testing (Misal: "Halo"). AI Chat yang di-develop sebelumnya harus tetap bisa menjawab kueri Anda seputar bahan kue dengan baik dan akurat.
   - **Formulir Kontak Email (Formspree):** Scroll turun ke bagian 'Hubungi Kami'. Isi form dengan data uji coba, ikuti verifikasi "Pertanyaan Keamanan" 3+4=?, lalu klik kirim. Silakan periksa inbox/kotak masuk Formspree email Anda untuk melihat apakah notifikasi pesan baru berhasil diterima.

---

### Info / Catatan Tambahan Terkait Sistem:
- **Konfigurasi API Panel (Pihak Ketiga):** Skrip pintar seperti AI Chat, form kontak, Google Analytics (gtag), widget pergantian bahasa (ID/EN) dan pop-up Cookie Modal di website Surya Pangan dieksekusi secara otomatis dari sisi Front-End (Client-side JavaScript). Skrip-skrip ini terhitung mandiri, sehingga **pemindahan sisi hosting sama sekali tidak akan merusak fungsinya**, ia akan otomatis tetap berjalan sempurna selama pengunjung memiliki koneksi internet yang stabil saat membuka site.
- **Masalah Routing Halaman:** Karena untuk saat ini struktur website merupakan *Single Page Application (SPA)* sederhana yang utamanya hanya mengandalkan pergeseran jangkar halaman (misal: `#about`, `#products`, `#contact`), pemindahan ke sistem cPanel tradisional tidak memerlukan konfigurasi server khusus atau file `.htaccess` custom mod rewrite seperti yang dibutuhkan oleh framework React atau Vue Router. Sistem langsung siap pakai.

> *Apabila semua langkah rinci dari Tahap 0 sampai 5 dipraktikkan dengan teliti, website modern PT. Surya Pangan Bali akan live seutuhnya dan beroperasi secara independen di server Rumahweb dengan performa akses yang stabil dan cepat.* 🚀
