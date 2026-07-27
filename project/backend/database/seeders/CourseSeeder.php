<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teacher = User::where('role', 'teacher')->first();
        
        if (!$teacher) {
            return;
        }

        $course = Course::firstOrCreate(
            ['name' => 'Bahasa Indonesia Kelas X TKJ'],
            [
                'teacher_id' => $teacher->id,
                'description' => 'Mata pelajaran Bahasa Indonesia untuk kelas X TKJ SMK.',
            ]
        );

        // Enroll all students
        $students = User::where('role', 'student')->pluck('id');
        $course->students()->syncWithoutDetaching($students);
    }
}
