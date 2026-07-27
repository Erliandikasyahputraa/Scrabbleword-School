# Urutan Upload Deployment

Pastikan Anda mengikuti urutan ini secara ketat untuk mencegah error selama proses deployment:

1. **Upload core** - Upload folder `core/` ke root directory `/` di FTP Anda (sejajar dengan htdocs).
2. **Upload htdocs** - Upload **isi** dari folder `htdocs/` ke dalam folder `/htdocs` di FTP Anda.
3. **Import SQL** - Buka phpMyAdmin di InfinityFree dan import file `database.sql` Anda.
4. **Edit .env** - Buka file `core/.env` di server dan isi database credentials serta URL frontend.
5. **Test API** - Buka URL Backend Anda (contoh: `http://api.domain.com/api/courses`) di browser untuk memastikan koneksi database berhasil dan tidak ada error 500.
6. **Update Vercel** - Masuk ke setting environment Vercel dan update `VITE_API_URL` dengan URL Backend InfinityFree Anda.
7. **Redeploy** - Lakukan redeploy frontend di Vercel agar perubahan environment terbaru diterapkan.
8. **Smoke Test** - Buka frontend Anda, lakukan testing login, upload PDF, dan submit crossword.
