<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Admin
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'approved',
            ]
        );

        // 2. Guru (Teacher)
        User::firstOrCreate(
            ['email' => 'putri@gmail.com'],
            [
                'name' => 'Putri',
                'password' => Hash::make('ninjass123'),
                'role' => 'teacher',
                'status' => 'approved',
            ]
        );

        // 3. Siswa (Students) - X TKJ
        $students = [
            'Febri Gustianda Trisna Putra',
            'Alan Kusuma Widjaya',
            'Sutan Siregar',
            'Mhd Raihan P.W',
            'Haikal Sanjaya',
            'Yuda Prastya',
            'Mhd Bayu Kurniawan',
            'Mhd Nyomansyah',
            'David Prabowo',
            'Nanda Bayu Pangestu',
            'Budi Atmaja',
            'Melati Sukma',
            'Ayom Bela Winata',
            'Nur Raisa Putri Wardania',
            'Uswatun Habibah',
            'Maharani Putri Hariadi',
            'Mita Indriani',
            'Tri Puji Miranty',
            'Elya Raihan',
            'Sekar Anggrainin',
        ];

        foreach ($students as $index => $studentName) {
            $email = strtolower(str_replace([' ', '.'], ['', ''], $studentName)) . '@example.com';
            User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $studentName,
                    'password' => Hash::make('password'),
                    'role' => 'student',
                    'status' => 'approved',
                ]
            );
        }
    }
}
