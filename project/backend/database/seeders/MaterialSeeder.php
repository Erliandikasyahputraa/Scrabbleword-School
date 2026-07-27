<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Material;
use Illuminate\Database\Seeder;

class MaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $course = Course::first();
        if (!$course) {
            return;
        }

        $tts1 = '{"metadata":{"title":"SOAL TTS PADA MATERI BAGIAN 1","difficulty":"Hard","estimated_time":900,"max_hints":7},"grid":{"rows":13,"cols":18},"words":[{"id":"1","word":"ORIENTASI","original_word":"ORIENTASI","row":0,"col":9,"direction":"down","length":9},{"id":"2","word":"LISAN","original_word":"LISAN","row":1,"col":1,"direction":"down","length":5},{"id":"3","word":"RESOLUSI","original_word":"RESOLUSI","row":1,"col":12,"direction":"down","length":8},{"id":"4","word":"HIKAYAH","original_word":"HIKAYAH","row":1,"col":14,"direction":"down","length":7},{"id":"5","word":"KETIGA","original_word":"KETIGA","row":2,"col":11,"direction":"across","length":6},{"id":"6","word":"KLIMAKS","original_word":"KLIMAKS","row":3,"col":4,"direction":"down","length":7},{"id":"7","word":"PENOKOHAN","original_word":"PENOKOHAN","row":4,"col":7,"direction":"across","length":9},{"id":"8","word":"ANONIM","original_word":"ANONIM","row":5,"col":0,"direction":"across","length":6},{"id":"9","word":"KODA","original_word":"KODA","row":6,"col":6,"direction":"down","length":4},{"id":"10","word":"BUDAYA","original_word":"BUDAYA","row":6,"col":11,"direction":"across","length":6},{"id":"11","word":"AGAMA","original_word":"AGAMA","row":6,"col":16,"direction":"down","length":5},{"id":"12","word":"TRITAGONIS","original_word":"TRITAGONIS","row":7,"col":0,"direction":"across","length":10},{"id":"13","word":"ISTANA","original_word":"ISTANA","row":9,"col":3,"direction":"across","length":6},{"id":"14","word":"ALUR","original_word":"ALUR","row":9,"col":8,"direction":"down","length":4},{"id":"15","word":"TEMA","original_word":"TEMA","row":9,"col":14,"direction":"across","length":4}],"clues":[{"id":"1","number":1,"direction":"down","clue":"Bagian struktur hikayat yang memperkenalkan tokoh, latar, waktu, dan situasi awal cerita."},{"id":"2","number":2,"direction":"down","clue":"Tradisi penyampaian hikayat dari satu generasi ke generasi berikutnya sebelum ditulis disebut tradisi."},{"id":"3","number":3,"direction":"down","clue":"Tahap dalam struktur hikayat yang berfungsi menyelesaikan konflik yang dialami tokoh utama."},{"id":"4","number":4,"direction":"down","clue":"Kata yang berasal dari bahasa Arab dan berarti “cerita” atau “kisah”, yang kemudian menjadi nama karya sastra Melayu Klasik."},{"id":"5","number":5,"direction":"across","clue":"Sudut pandang yang paling banyak digunakan dalam hikayat karena pengarang menceritakan tokoh dari luar cerita."},{"id":"6","number":6,"direction":"down","clue":"Tahapan alur ketika konflik mencapai titik paling menegangkan sebelum menuju penyelesaian."},{"id":"7","number":7,"direction":"across","clue":"Unsur intrinsik yang menggambarkan watak, sikap, dan karakter seorang tokoh disebut …"},{"id":"8","number":8,"direction":"across","clue":"Sifat hikayat yang menunjukkan bahwa nama pengarangnya tidak diketahui."},{"id":"9","number":9,"direction":"down","clue":"Bagian akhir hikayat yang berisi pesan, pelajaran, atau hikmah yang dapat dipetik pembaca."},{"id":"10","number":10,"direction":"across","clue":"Nilai yang mengajarkan pentingnya menghormati adat istiadat dan tradisi masyarakat."},{"id":"11","number":11,"direction":"down","clue":"Nilai yang mengajarkan hubungan manusia dengan Tuhan melalui ibadah, doa, dan rasa syukur."},{"id":"12","number":12,"direction":"across","clue":"Tokoh yang menjadi penengah antara tokoh protagonis dan antagonis disebut tokoh."},{"id":"13","number":13,"direction":"across","clue":"Ciri hikayat yang menjadikan lingkungan kerajaan sebagai pusat cerita disebut …. sentris."},{"id":"14","number":14,"direction":"down","clue":"Unsur intrinsik yang menunjukkan urutan peristiwa dari awal hingga akhir cerita."},{"id":"15","number":15,"direction":"across","clue":"Unsur intrinsik yang menjadi dasar atau ide pokok pengembangan seluruh isi cerita."}]}';

        $tts2 = '{"metadata":{"title":"TEKA-TEKI SILANG PERTEMUAN 2 (TTS HOTS)","difficulty":"Hard","estimated_time":900,"max_hints":7},"grid":{"rows":23,"cols":18},"words":[{"id":"1","word":"BUKTI","original_word":"BUKTI","row":0,"col":13,"direction":"across","length":5},{"id":"2","word":"KRITIS","original_word":"KRITIS","row":0,"col":15,"direction":"down","length":6},{"id":"3","word":"ANNOTASI","original_word":"ANNOTASI","row":4,"col":11,"direction":"down","length":8},{"id":"4","word":"INTENSIF","original_word":"INTENSIF","row":5,"col":10,"direction":"across","length":8},{"id":"5","word":"SUBJEKTIF","original_word":"SUBJEKTIF","row":8,"col":1,"direction":"down","length":9},{"id":"5","word":"SIMPULAN","original_word":"SIMPULAN","row":8,"col":1,"direction":"across","length":8},{"id":"6","word":"KLASIFIKASI","original_word":"KLASIFIKASI","row":11,"col":8,"direction":"down","length":11},{"id":"6","word":"KESIMPULAN","original_word":"KESIMPULAN","row":11,"col":8,"direction":"across","length":10},{"id":"7","word":"LOGIS","original_word":"LOGIS","row":11,"col":15,"direction":"down","length":5},{"id":"8","word":"ANALISIS","original_word":"ANALISIS","row":13,"col":6,"direction":"across","length":8},{"id":"9","word":"SISTEMATIS","original_word":"SISTEMATIS","row":15,"col":0,"direction":"across","length":10},{"id":"10","word":"TABEL","original_word":"TABEL","row":15,"col":3,"direction":"down","length":5},{"id":"11","word":"OBJEKTIVITAS","original_word":"OBJEKTIVITAS","row":17,"col":2,"direction":"across","length":12},{"id":"12","word":"ILMIAH","original_word":"ILMIAH","row":17,"col":10,"direction":"down","length":6},{"id":"13","word":"PERISTIWA","original_word":"PERISTIWA","row":20,"col":4,"direction":"across","length":9}],"clues":[{"id":"1","number":1,"direction":"across","clue":"Dasar utama yang harus digunakan untuk memperkuat hasil analisis agar dapat dipertanggungjawabkan adalah …."},{"id":"2","number":2,"direction":"down","clue":"Kemampuan menghubungkan informasi, memberikan alasan, dan menarik simpulan logis merupakan bentuk berpikir …."},{"id":"3","number":3,"direction":"down","clue":"Teknik membaca dengan memberi garis bawah, simbol, atau warna pada bagian penting teks dinamakan teknik …."},{"id":"4","number":4,"direction":"across","clue":"Kegiatan membaca yang dilakukan lebih dari satu kali agar memperoleh pemahaman yang mendalam terhadap isi hikayat disebut membaca secara …."},{"id":"5","number":5,"direction":"down","clue":"Analisis yang hanya didasarkan pada pendapat pribadi tanpa dukungan isi teks disebut bersifat …."},{"id":"5","number":5,"direction":"across","clue":"Tahap akhir setelah menyusun hasil analisis adalah menarik …."},{"id":"6","number":6,"direction":"down","clue":"Langkah mengelompokkan informasi yang memiliki kesamaan agar mudah dipahami disebut …."},{"id":"6","number":6,"direction":"across","clue":"Pernyataan yang dibuat berdasarkan keseluruhan hasil analisis dan menjadi penutup pembahasan disebut …."},{"id":"7","number":7,"direction":"down","clue":"Kemampuan menjelaskan alasan secara masuk akal berdasarkan fakta merupakan bentuk penalaran yang …."},{"id":"8","number":8,"direction":"across","clue":"Proses menguraikan isi hikayat secara sistematis untuk memperoleh pemahaman yang mendalam berdasarkan fakta dalam teks disebut …."},{"id":"9","number":9,"direction":"across","clue":"Langkah setelah mengumpulkan informasi penting dari teks adalah menyusun hasil analisis secara …."},{"id":"10","number":10,"direction":"down","clue":"Penyajian hasil analisis dalam bentuk baris dan kolom untuk mempermudah pembaca memahami informasi disebut …."},{"id":"11","number":11,"direction":"across","clue":"Sikap dalam menganalisis yang mengharuskan penilaian bebas dari prasangka, perasaan pribadi, dan keberpihakan disebut …."},{"id":"12","number":12,"direction":"down","clue":"Analisis yang baik harus menghasilkan pendapat yang dapat dipertanggungjawabkan secara …."},{"id":"13","number":13,"direction":"across","clue":"Bagian teks yang dijadikan dasar untuk membuktikan hasil analisis dapat berupa dialog maupun …."}]}';

        Material::firstOrCreate(
            [
                'course_id' => $course->id,
                'title' => 'Pertemuan 1 - Pengenalan Hikayat'
            ],
            [
                'pdf_path' => null, // Sesuai dengan instruksi ("untuk materi pdf saya masukin manual nanti")
                'crossword_data' => json_decode($tts1, true),
            ]
        );

        Material::firstOrCreate(
            [
                'course_id' => $course->id,
                'title' => 'Pertemuan 2 - Menganalisis Teks Hikayat'
            ],
            [
                'pdf_path' => null,
                'crossword_data' => json_decode($tts2, true),
            ]
        );
    }
}
