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
            ['title' => 'Bahasa Indonesia Kelas X TKJ'],
            [
                'teacher_id' => $teacher->id,
                'description' => 'Mata pelajaran Bahasa Indonesia untuk kelas X TKJ SMK.',
                'image_url' => 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop',
                'status' => 'published',
            ]
        );

        // Enroll all students
        $students = User::where('role', 'student')->pluck('id');
        $course->students()->syncWithoutDetaching($students);
    }
}
