<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\User;
use App\Models\Material;
use App\Models\Submission;

class DashboardController extends Controller
{
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

            // Average score of submissions for this teacher's materials
            $averageScore = Submission::whereHas('material.course', function ($query) use ($user) {
                $query->where('teacher_id', $user->id);
            })->avg('score') ?? 0;

            // Completion Rate: How many submissions are marked as completed vs total expected submissions?
            // Simplified logic: (Completed Submissions / Total Enrolled Students * Total Materials) * 100
            // Even simpler (since MVP): Ratio of students who have completed AT LEAST ONE submission
            
            $studentsWithCompletedSubmission = Submission::whereHas('material.course', function ($query) use ($user) {
                $query->where('teacher_id', $user->id);
            })->where('is_completed', true)
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
            $averageScore = Submission::avg('score') ?? 0;
            
            $studentsWithCompletedSubmission = Submission::where('is_completed', true)
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

        // Student stats
        $enrolledCourses = $user->enrolledCourses()->count();
        $completedSubmissions = $user->submissions()->where('is_completed', true)->count();
        
        $totalMaterialsForStudent = Material::whereHas('course.enrollments', function($q) use ($user) {
            $q->where('student_id', $user->id);
        })->count();

        $completionRate = $totalMaterialsForStudent > 0 
            ? round(($completedSubmissions / $totalMaterialsForStudent) * 100) 
            : 0;

        $averageScore = $user->submissions()->avg('score') ?? 0;

        return response()->json([
            'enrolled_courses' => $enrolledCourses,
            'completed_materials' => $completedSubmissions,
            'completion_rate' => $completionRate,
            'average_score' => round($averageScore, 1),
        ]);
    }
}
