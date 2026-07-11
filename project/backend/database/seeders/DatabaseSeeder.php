<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Material;
use App\Models\Enrollment;
use App\Models\Submission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Super Admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'approved',
        ]);

        // 2. Create Teacher
        $teacher = User::create([
            'name' => 'Teacher Budi',
            'email' => 'teacher@example.com',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'status' => 'approved',
        ]);

        // 3. Create Students
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

        // 4. Create Subjects and Courses
        // 7 Subjects x 2 Courses each = 14 Courses
        $subjects = [
            'Mathematics' => ['Algebra Fundamentals', 'Geometry Basics'],
            'Science' => ['Solar System & Astronomy', 'Human Respiratory System'],
            'Social Studies' => ['World War II History', 'Geography and Continents'],
            'English' => ['Daily Activities Conversation', 'Advanced Verb Tenses'],
            'Indonesian' => ['Sastra dan Puisi Lama', 'Tata Bahasa Baku'],
            'Civics' => ['Pancasila and Constitution', 'Democracy Principles'],
            'Informatics' => ['Introduction to Algorithms', 'Web Development Basics']
        ];

        $courses = [];
        foreach ($subjects as $subject => $courseList) {
            foreach ($courseList as $courseName) {
                $courses[] = Course::create([
                    'name' => "$subject: $courseName",
                    'description' => "This is a comprehensive course covering $courseName. It includes reading materials and interactive crossword puzzles to test your understanding.",
                    'teacher_id' => $teacher->id,
                ]);
            }
        }

        // Dummy crossword data generated using our CrosswordGenerator algorithm logic
        $dummyCrossword = [
            'metadata' => [
                'title' => 'Topic Review',
                'difficulty' => 'Medium',
                'estimated_time' => 300,
                'max_hints' => 2
            ],
            'grid' => [
                'rows' => 5,
                'cols' => 6
            ],
            'words' => [
                ['id' => '1', 'word' => 'LEARN', 'row' => 0, 'col' => 0, 'direction' => 'across', 'length' => 5],
                ['id' => '2', 'word' => 'READ', 'row' => 0, 'col' => 2, 'direction' => 'down', 'length' => 4],
                ['id' => '3', 'word' => 'DATA', 'row' => 3, 'col' => 2, 'direction' => 'across', 'length' => 4],
                ['id' => '4', 'word' => 'ART', 'row' => 2, 'col' => 5, 'direction' => 'down', 'length' => 3],
            ],
            'clues' => [
                ['id' => '1', 'number' => 1, 'direction' => 'across', 'clue' => 'To acquire knowledge or skill.'],
                ['id' => '2', 'number' => 2, 'direction' => 'down', 'clue' => 'To look at and comprehend the meaning of written matter.'],
                ['id' => '3', 'number' => 3, 'direction' => 'across', 'clue' => 'Facts and statistics collected together for reference or analysis.'],
                ['id' => '4', 'number' => 4, 'direction' => 'down', 'clue' => 'The expression or application of human creative skill and imagination.'],
            ]
        ];

        // 5. Create Materials
        // 2 Materials per course
        foreach ($courses as $course) {
            for ($j = 1; $j <= 2; $j++) {
                Material::create([
                    'course_id' => $course->id,
                    'title' => "Chapter $j: Core Concepts of " . explode(': ', $course->name)[1],
                    'pdf_path' => 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf', // Dummy PDF
                    'crossword_data' => $j === 1 ? $dummyCrossword : null, // 1st material gets the crossword
                ]);
            }
        }

        // 6. Enroll Students & Generate Submissions
        // Enroll all students in all courses for maximum dashboard data
        foreach ($students as $student) {
            foreach ($courses as $course) {
                Enrollment::create([
                    'student_id' => $student->id,
                    'course_id' => $course->id,
                ]);

                // Simulate random progress
                $materials = Material::where('course_id', $course->id)->get();
                foreach ($materials as $material) {
                    $chance = rand(1, 100);
                    if ($chance <= 70) {
                        // 70% chance they started or finished it
                        $isCompleted = rand(1, 100) <= 80; // Of those, 80% finished
                        $score = $isCompleted && $material->crossword_data ? rand(60, 100) : 0;
                        
                        Submission::create([
                            'student_id' => $student->id,
                            'material_id' => $material->id,
                            'score' => $score,
                            'is_completed' => $isCompleted,
                        ]);
                    }
                }
            }
        }
    }
}
