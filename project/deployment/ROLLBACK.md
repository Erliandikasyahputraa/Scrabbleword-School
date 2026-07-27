# Prosedur Rollback

Jika proses deployment gagal dan aplikasi di production tidak bisa diakses, segera lakukan langkah rollback berikut untuk memulihkan sistem:

1. **Revert Frontend Vercel**
   - Buka dashboard Vercel.
   - Pergi ke tab **Deployments**.
   - Temukan deployment sebelumnya yang sukses (ditandai dengan titik hijau).
   - Klik tombol tiga titik (`...`) dan pilih **Promote to Production** atau **Redeploy**.
   - Ini akan mengembalikan URL VITE_API_URL ke backend lama (jika backend lama masih hidup).

2. **Bersihkan Server InfinityFree**
   - Jika backend InfinityFree menyebabkan error fatal (misalnya HTTP 500 terus-menerus).
   - Buka FileZilla dan hubungkan ke FTP Anda.
   - Masuk ke folder `/htdocs`, pilih semua file dan **Hapus (Delete)**. (Catatan: jangan hapus foldernya, hanya isinya).
   - Hapus juga folder `/core` dari root directory.
   - Dengan ini, backend InfinityFree menjadi kosong kembali dan Anda bisa mengulang proses upload pelan-pelan.

3. **Reset Database (Opsional)**
   - Jika terdapat error migrasi/tabel di database production:
   - Buka phpMyAdmin di InfinityFree.
   - Pilih database Anda, centang semua tabel, lalu pilih operasi **Drop**.
   - Setelah kosong, ulangi import file `.sql` Anda.
