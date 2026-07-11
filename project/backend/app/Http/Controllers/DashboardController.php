<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\User;
use App\Models\Material;
use App\Models\Submission;
use App\Services\LearningService;

class DashboardController extends Controller
{
    protected $learningService;

    public function __construct(LearningService $learningService)
    {
        $this->learningService = $learningService;
    }

    public function stats(Request $request)
    {
        $user = $request->user();
        
        if ($user->role === 'teacher') {
            $totalCourses = Course::where('teacher_id', $user->id)->count();
            
            // Get unique students enrolled in this teacher's courses
            $totalStudents = User::whereHas('enrolledCourses', function ($query) use ($user) {
                $query->where('teacher_id', $user->id);
            })->count();

            $totalMaterials = Material::whereHas('course', function ($query) use ($user) {
                $query->where('teacher_id', $user->id);
            })->count();

            $averageScore = Submission::whereHas('material.course', function ($query) use ($user) {
                $query->where('teacher_id', $user->id);
            })->whereNotNull('submitted_at')->avg('score') ?? 0;

            $studentsWithCompletedSubmission = Submission::whereHas('material.course', function ($query) use ($user) {
                $query->where('teacher_id', $user->id);
            })->whereNotNull('submitted_at')
              ->distinct('student_id')
              ->count('student_id');

            $completionRate = $totalStudents > 0 
                ? round(($studentsWithCompletedSubmission / $totalStudents) * 100) 
                : 0;

            return response()->json([
                'total_courses' => $totalCourses,
                'total_students' => $totalStudents,
                'total_materials' => $totalMaterials,
                'average_score' => round($averageScore, 1),
                'completion_rate' => $completionRate
            ]);
        } else if ($user->role === 'admin') {
            $totalCourses = Course::count();
            $totalStudents = User::where('role', 'student')->count();
            $totalTeachers = User::where('role', 'teacher')->count();
            $totalMaterials = Material::count();
            $averageScore = Submission::whereNotNull('submitted_at')->avg('score') ?? 0;
            
            $studentsWithCompletedSubmission = Submission::whereNotNull('submitted_at')
              ->distinct('student_id')
              ->count('student_id');
              
            $completionRate = $totalStudents > 0 
                ? round(($studentsWithCompletedSubmission / $totalStudents) * 100) 
                : 0;

            return response()->json([
                'total_courses' => $totalCourses,
                'total_students' => $totalStudents,
                'total_teachers' => $totalTeachers,
                'total_materials' => $totalMaterials,
                'average_score' => round($averageScore, 1),
                'completion_rate' => $completionRate
            ]);
        }

        // Student stats handled by LearningService
        return response()->json($this->learningService->getStudentDashboard($user->id));
    }
}
