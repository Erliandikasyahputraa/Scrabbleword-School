import fs from 'fs';
import path from 'path';
import { generateCrosswordData } from '../src/lib/crosswordGenerator.js';
// We need to compile crosswordGenerator.ts or use ts-node to run this script.
// To avoid compilation issues in the script, I will write this script to run with `npx tsx` or `npx ts-node`.

const datasets = [
  {
    theme: "School",
    level: 1,
    words: [
      { word: "BUKU", clue: "Tempat membaca" },
      { word: "GURU", clue: "Orang yang mengajar" }
    ]
  },
  {
    theme: "Animals",
    level: 2,
    words: [
      { word: "KUCING", clue: "Hewan mengeong" },
      { word: "IKAN", clue: "Hewan yang berenang" },
      { word: "BURUNG", clue: "Hewan yang terbang" }
    ]
  },
  {
    theme: "Fruits",
    level: 3,
    words: [
      { word: "APEL", clue: "Buah merah bundar" },
      { word: "PISANG", clue: "Buah kuning melengkung" },
      { word: "MANGGA", clue: "Buah manis berdaging kuning atau oranye" },
      { word: "ANGGUR", clue: "Buah kecil bergerombol" }
    ]
  },
  {
    theme: "Transportation",
    level: 4,
    words: [
      { word: "MOBIL", clue: "Kendaraan roda empat" },
      { word: "MOTOR", clue: "Kendaraan roda dua" },
      { word: "KERETA", clue: "Kendaraan panjang di atas rel" },
      { word: "PESAWAT", clue: "Kendaraan di udara" },
      { word: "KAPAL", clue: "Kendaraan di air" }
    ]
  },
  {
    theme: "Profession",
    level: 5,
    words: [
      { word: "DOKTER", clue: "Mengobati orang sakit" },
      { word: "POLISI", clue: "Menjaga keamanan" },
      { word: "PETANI", clue: "Menanam padi" },
      { word: "NELAYAN", clue: "Mencari ikan di laut" },
      { word: "GURU", clue: "Mendidik siswa di sekolah" },
      { word: "PILOT", clue: "Mengemudikan pesawat" }
    ]
  },
  {
    theme: "Body Parts",
    level: 6,
    words: [
      { word: "KEPALA", clue: "Bagian atas tubuh manusia" },
      { word: "TANGAN", clue: "Digunakan untuk memegang" },
      { word: "KAKI", clue: "Digunakan untuk berjalan" },
      { word: "MATA", clue: "Digunakan untuk melihat" },
      { word: "TELINGA", clue: "Digunakan untuk mendengar" },
      { word: "HIDUNG", clue: "Digunakan untuk mencium bau" },
      { word: "MULUT", clue: "Digunakan untuk berbicara" }
    ]
  },
  {
    theme: "Religion",
    level: 7,
    words: [
      { word: "MASJID", clue: "Tempat ibadah umat Islam" },
      { word: "GEREJA", clue: "Tempat ibadah umat Kristen" },
      { word: "PURA", clue: "Tempat ibadah umat Hindu" },
      { word: "VIHARA", clue: "Tempat ibadah umat Buddha" },
      { word: "KLENTENG", clue: "Tempat ibadah umat Konghucu" },
      { word: "DOA", clue: "Permohonan kepada Tuhan" },
      { word: "PUASA", clue: "Menahan makan dan minum" },
      { word: "ZAKAT", clue: "Kewajiban berbagi harta" }
    ]
  },
  {
    theme: "Technology",
    level: 8,
    words: [
      { word: "KOMPUTER", clue: "Mesin penghitung elektronik" },
      { word: "INTERNET", clue: "Jaringan komputer global" },
      { word: "WEBSITE", clue: "Halaman di internet" },
      { word: "SOFTWARE", clue: "Perangkat lunak" },
      { word: "HARDWARE", clue: "Perangkat keras" },
      { word: "DATABASE", clue: "Basis data" },
      { word: "SERVER", clue: "Peladen pusat" },
      { word: "NETWORK", clue: "Jaringan komunikasi" },
      { word: "CODE", clue: "Instruksi pemrograman" }
    ]
  },
  {
    theme: "Computer Science",
    level: 9,
    words: [
      { word: "ALGORITMA", clue: "Urutan langkah logis" },
      { word: "VARIABEL", clue: "Penyimpan nilai" },
      { word: "FUNGSI", clue: "Blok kode yang dapat dipanggil ulang" },
      { word: "LOOPING", clue: "Perulangan instruksi" },
      { word: "ARRAY", clue: "Kumpulan data sejenis" },
      { word: "BOOLEAN", clue: "Tipe data benar atau salah" },
      { word: "STRING", clue: "Tipe data teks" },
      { word: "INTEGER", clue: "Tipe data bilangan bulat" },
      { word: "DEBUG", clue: "Mencari kesalahan kode" },
      { word: "COMPILE", clue: "Menerjemahkan kode" }
    ]
  },
  {
    theme: "English Vocabulary",
    level: 10,
    words: [
      { word: "BEAUTIFUL", clue: "Cantik (English)" },
      { word: "HANDSOME", clue: "Tampan (English)" },
      { word: "WONDERFUL", clue: "Menakjubkan (English)" },
      { word: "EXCELLENT", clue: "Sangat baik (English)" },
      { word: "IMPORTANT", clue: "Penting (English)" },
      { word: "DIFFICULT", clue: "Sulit (English)" },
      { word: "DANGEROUS", clue: "Berbahaya (English)" },
      { word: "EXPENSIVE", clue: "Mahal (English)" },
      { word: "DELICIOUS", clue: "Lezat (English)" },
      { word: "INTERESTING", clue: "Menarik (English)" }
    ]
  },
  {
    theme: "TOEFL Vocabulary",
    level: 10,
    words: [
      { word: "UBIQUITOUS", clue: "Present, appearing, or found everywhere." },
      { word: "EPHEMERAL", clue: "Lasting for a very short time." },
      { word: "ELOQUENT", clue: "Fluent or persuasive in speaking or writing." },
      { word: "METICULOUS", clue: "Showing great attention to detail." },
      { word: "OBSOLETE", clue: "No longer produced or used; out of date." },
      { word: "MITIGATE", clue: "Make less severe, serious, or painful." },
      { word: "PRAGMATIC", clue: "Dealing with things sensibly and realistically." },
      { word: "LUCID", clue: "Expressed clearly; easy to understand." },
      { word: "CANDID", clue: "Truthful and straightforward; frank." },
      { word: "ARDUOUS", clue: "Involving or requiring strenuous effort." }
    ]
  }
];

// Provide some extra fallbacks in case generation fails
const fallbacks = [
  {
    theme: "Colors",
    level: 1,
    words: [
      { word: "MERAH", clue: "Warna darah" },
      { word: "PUTIH", clue: "Warna susu" }
    ]
  },
  {
    theme: "Shapes",
    level: 2,
    words: [
      { word: "KOTAK", clue: "Empat sisi sama panjang" },
      { word: "BULAT", clue: "Bentuk seperti bola" },
      { word: "SEGITIGA", clue: "Memiliki tiga sudut" }
    ]
  }
];

const allSets = [...datasets, ...fallbacks];

const successfulData = [];

for (const set of allSets) {
  try {
    const data = generateCrosswordData(set.words, `${set.theme} (Level ${set.level})`);
    successfulData.push({
      theme: set.theme,
      level: set.level,
      data: data
    });
    console.log(`✅ Generated: ${set.theme} (Level ${set.level})`);
  } catch (e: any) {
    console.error(`❌ Failed: ${set.theme} (Level ${set.level}) - ${e.message}`);
  }
}

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Write to a JSON file in the backend database path
const outPath = path.resolve(__dirname, '../../backend/database/seeders/datasets.json');
fs.writeFileSync(outPath, JSON.stringify(successfulData, null, 2));
console.log(`\nSuccessfully wrote ${successfulData.length} valid crossword datasets to ${outPath}`);
