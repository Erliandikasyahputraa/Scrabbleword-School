<div align="center">
  <br />
  <img src="https://i.ibb.co/3s2R5zZ/tekateki-logo.png" alt="Teka Teki Silang Logo" width="150" />
  <h1>🎓 Scrabbleword School (Teka Teki Silang)</h1>
  <p>
    <strong>Interactive learning platform with PDF Viewer and Auto-Scored Crossword Exercises.</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Backend-Laravel%2011-FF2D20?style=flat-square&logo=laravel" alt="Laravel" />
    <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind" />
  </p>
</div>

---

## 🌟 Tentang Proyek Ini
**Scrabbleword School** (atau platform *Teka Teki Silang*) adalah sebuah Minimum Viable Product (MVP) untuk platform edukasi interaktif. Siswa dapat membaca materi pelajaran dari PDF yang diunggah oleh guru, lalu menguji pemahaman mereka dengan mengisi Teka-Teki Silang (Crossword) yang ter-generate otomatis dan memiliki sistem penilaian langsung (*Auto Score*).

## ✨ Fitur (MVP Scope)
- 🔐 **Autentikasi & Keamanan**: Login/Register untuk *Teacher* dan *Student*.
- 📊 **Dashboard & Course**: Manajemen kelas dan materi pembelajaran.
- 📄 **PDF Viewer**: Baca materi langsung di dalam aplikasi (integrasi `pdf.js`).
- 🧩 **Teka-Teki Silang**: Mesin *Crossword* yang dibuat dari daftar *clues* dan jawaban dari Guru.
- 💯 **Auto Score & History**: Penilaian otomatis dan rekaman jejak belajar siswa.

---

## 🚀 Cara Menjalankan Proyek secara Lokal

Proyek ini terbagi menjadi dua bagian: **Backend (Laravel)** dan **Frontend (React)**.

### Persiapan (Prerequisites)
Pastikan Anda sudah menginstal:
- **PHP 8.2+** & **Composer**
- **Node.js** (v18+)
- **MySQL / MariaDB** (Bisa menggunakan [Laragon](https://laragon.org/) atau XAMPP)

### 1. Menjalankan Backend (Laravel)
1. Buka aplikasi Laragon, lalu klik **Start All** (Pastikan Apache/Nginx dan MySQL menyala).
2. Buka terminal (atau terminal Laragon), lalu masuk ke folder backend:
   ```bash
   cd project/backend
   ```
3. Salin file `.env`:
   ```bash
   cp .env.example .env
   ```
4. Sesuaikan konfigurasi *Database* di dalam file `.env` (misal, buat database `scrabblewordseser` di Laragon phpMyAdmin/HeidiSQL, lalu samakan nama DB di `.env`).
5. Install dependensi dan jalankan migrasi:
   ```bash
   composer install
   php artisan key:generate
   php artisan migrate
   ```
6. Jalankan server lokal:
   ```bash
   php artisan serve
   ```
   *(Backend akan berjalan di `http://localhost:8000`)*

### 2. Menjalankan Frontend (React + Vite)
1. Buka tab terminal baru, lalu masuk ke folder frontend:
   ```bash
   cd project/frontend
   ```
2. Install dependensi:
   ```bash
   npm install
   ```
3. Jalankan server lokal:
   ```bash
   npm run dev
   ```
   *(Frontend akan berjalan di `http://localhost:5173`)*

4. Buka `http://localhost:5173` di browser Anda!

---

## 🌍 Rekomendasi Hosting Gratis (Deployment)

Jika Anda ingin mempublikasikan (hosting) aplikasi ini agar bisa diakses secara publik (gratis), berikut adalah rekomendasi layanan yang bisa Anda gunakan:

### 1. Frontend (React/Vite)
Karena frontend kita berupa SPA (*Single Page Application*) statis, Anda bisa men-deploynya secara gratis dan mudah di:
- **[Vercel](https://vercel.com/)** (Paling direkomendasikan, sangat cepat dan integrasi Github mulus).
- **[Netlify](https://netlify.com/)**
- **[Cloudflare Pages](https://pages.cloudflare.com/)**

### 2. Backend (Laravel)
Hosting PHP/Laravel gratis cukup langka, namun beberapa tempat ini menyediakan opsi gratis:
- **[InfinityFree](https://infinityfree.net/)**: Menyediakan hosting PHP dan MySQL gratis tanpa batas waktu (cocok untuk tugas/MVP, tapi ada limit resource).
- **[000webhost](https://000webhost.com/)**: Opsi klasik untuk hosting PHP gratis.
- **[Render](https://render.com/)**: Anda bisa mendeploy web service Dockerized Laravel secara gratis (bisa sedikit lebih rumit di awal).
- *Alternatif Murah*: Gunakan VPS murah (seperti Niagahoster, Hostinger, atau DigitalOcean ukuran terkecil jika untuk jangka panjang).

*(Jangan lupa menyesuaikan `API_URL` di frontend agar menunjuk ke domain backend yang sudah di-hosting).*

---
<div align="center">
  <i>Dibuat dengan ❤️ untuk Scrabbleword School.</i>
</div>
