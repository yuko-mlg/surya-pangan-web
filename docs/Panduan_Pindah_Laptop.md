# Panduan Lanjut Kerja di Laptop Baru (Mudik Edition) 🚗🌙

Boz yuko, ini panduan ringkas supaya Boz bisa langsung nyambung kerja di laptop mana pun.

## 1. Persiapan Awal (Satu Kali Saja)
Pastikan laptop baru sudah terinstall:
- **Git**: [Download di sini](https://git-scm.com/downloads)
- **Node.js**: [Download di sini](https://nodejs.org/) (Pilih versi LTS)

## 2. Cara Ambil Data dari GitHub
Buka Terminal atau PowerShell di laptop baru, lalu jalankan perintah ini:

```bash
# 1. Pindah ke folder tempat Boz mau simpan project (misal di Documents)
cd Documents

# 2. Ambil project dari GitHub
git clone https://github.com/yuko-mlg/surya-pangan-web.git

# 3. Masuk ke folder project
cd surya-pangan-web

# 4. Install mesin/dependencies website
npm install
```

## 3. Cara Kerja Sehari-hari (Biar Selalu Sinkron)

### A. SEBELUM Mulai Kerja (Tarik Update)
Selalu jalankan ini supaya file di laptop Boz sama dengan yang terakhir dikerjakan:
```bash
git pull origin main
```

### B. SESUDAH Selesai Kerja (Simpan & Kirim)
Jalankan ini supaya hasil kerjaan Boz masuk ke GitHub dan Vercel (Otomatis Live):
```bash
git add .
git commit -m "Update dari laptop mudik"
git push origin main
```

## 4. Cara Lihat Hasil (Preview)
Untuk melihat tampilan website di laptop secara lokal:
```bash
npm run dev
```
Lalu buka alamat yang muncul (biasanya `http://localhost:5173`) di browser.

---
**Catatan Penting**:
- **Vercel**: Tidak perlu disetting lagi. Setiap kali Boz melakukan `git push`, website yang LIVE akan otomatis update sendiri.
- **Antigravity**: Kalau Boz pakai AI ini di laptop baru, cukup bilang: *"Lanjut proyek Surya Pangan dari GitHub ya"*, saya akan otomatis sinkronisasi semuanya.

Selamat Mudik dan Liburan Pas Mantap, Boz! 🚀✨
