<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Material;
use App\Models\Enrollment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 0. Create Super Admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'approved',
        ]);

        // 1. Create Teacher
        $teacher = User::create([
            'name' => 'Teacher Budi',
            'email' => 'teacher@example.com',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'status' => 'approved',
        ]);

        // 2. Create Students
        $students = [];
        for ($i = 1; $i <= 5; $i++) {
            $students[] = User::create([
                'name' => "Student $i",
                'email' => "student$i@example.com",
                'password' => Hash::make('password'),
                'role' => 'student',
                'status' => 'approved',
            ]);
        }

        // 3. Create Courses
        $courseNames = [
            'Basic English Vocabulary',
            'Advanced Grammar Mastery',
            'TOEFL Preparation Guide',
            'Daily Conversational English',
            'Business English Communication'
        ];

        $courses = [];
        foreach ($courseNames as $name) {
            $courses[] = Course::create([
                'name' => $name,
                'description' => "This is a comprehensive guide to $name. It includes PDF materials and interactive crosswords.",
                'teacher_id' => $teacher->id,
            ]);
        }

        $dummyCrossword = [
            'metadata' => [
                'title' => 'Web Development Basics',
                'difficulty' => 'Easy',
                'estimated_time' => 5,
                'max_hints' => 3
            ],
            'grid' => [
                'rows' => 4,
                'cols' => 5
            ],
            'words' => [
                ['id' => '1-across', 'word' => 'REACT', 'row' => 0, 'col' => 0, 'direction' => 'across', 'length' => 5],
                ['id' => '2-down', 'word' => 'API', 'row' => 0, 'col' => 2, 'direction' => 'down', 'length' => 3],
                ['id' => '3-across', 'word' => 'GIT', 'row' => 2, 'col' => 1, 'direction' => 'across', 'length' => 3],
            ],
            'clues' => [
                ['id' => '1-across', 'number' => 1, 'direction' => 'across', 'clue' => 'A popular JavaScript library for building user interfaces.'],
                ['id' => '2-down', 'number' => 2, 'direction' => 'down', 'clue' => 'An interface that allows two applications to talk to each other (Abbrev).'],
                ['id' => '3-across', 'number' => 3, 'direction' => 'across', 'clue' => 'A popular distributed version control system.'],
            ]
        ];

        // 4. Create Materials
        foreach ($courses as $course) {
            $numMaterials = rand(1, 3);
            for ($j = 1; $j <= $numMaterials; $j++) {
                Material::create([
                    'course_id' => $course->id,
                    'title' => "Chapter $j: Introduction to " . $course->name,
                    'pdf_path' => 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf', // Dummy PDF
                    'crossword_data' => $dummyCrossword,
                ]);
            }
        }

        // 5. Create Enrollments and Dummy Submissions
        foreach ($students as $student) {
            // Enroll each student in 2-4 random courses
            $enrolledCourses = fake()->randomElements($courses, rand(2, 4));
            foreach ($enrolledCourses as $enrolledCourse) {
                Enrollment::create([
                    'student_id' => $student->id,
                    'course_id' => $enrolledCourse->id,
                ]);

                // Give 50% chance to have a completed submission for the first material
                if (rand(0, 1) === 1) {
                    $firstMaterial = Material::where('course_id', $enrolledCourse->id)->first();
                    if ($firstMaterial) {
                        \App\Models\Submission::create([
                            'student_id' => $student->id,
                            'material_id' => $firstMaterial->id,
                            'score' => rand(60, 100),
                            'is_completed' => true,
                        ]);
                    }
                }
            }
        }
    }
}
