<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Material;
use App\Models\Submission;
use App\Models\Enrollment;
use Illuminate\Support\Facades\DB;

class LearningService
{
    /**
     * Get student dashboard progress across all enrolled courses.
     */
    public function getStudentDashboard($studentId)
    {
        $enrolledCourseIds = Enrollment::where('student_id', $studentId)->pluck('course_id');
        
        $allMaterials = Material::whereIn('course_id', $enrolledCourseIds)->get();
        $totalMaterials = $allMaterials->count();
        
        $submissions = Submission::where('student_id', $studentId)
            ->whereIn('material_id', $allMaterials->pluck('id'))
            ->get();
            
        $completedMaterials = $submissions->whereNotNull('submitted_at')->count();
        $progressPercentage = $totalMaterials > 0 ? round(($completedMaterials / $totalMaterials) * 100) : 0;
        
        $recentMaterialId = $submissions->sortByDesc('updated_at')->first()?->material_id;
        $continueLearning = $allMaterials->first(function ($material) use ($submissions) {
            $sub = $submissions->firstWhere('material_id', $material->id);
            return !$sub || $sub->submitted_at === null;
        });
        
        if (!$continueLearning && $recentMaterialId) {
            $continueLearning = $allMaterials->firstWhere('id', $recentMaterialId);
        }

        // Categorize materials (limit to 5 for dashboard)
        $completedList = $submissions->whereNotNull('submitted_at')->pluck('material_id');
        $inProgressList = $submissions->whereNull('submitted_at')->whereNotNull('started_at')->pluck('material_id');
        
        return [
            'overall_progress' => $progressPercentage,
            'completed_count' => $completedMaterials,
            'total_materials' => $totalMaterials,
            'estimated_remaining' => max(0, $totalMaterials - $completedMaterials),
            'continue_learning' => $continueLearning ? $continueLearning->load('course:id,name') : null,
            'recent' => Material::whereIn('id', $submissions->sortByDesc('updated_at')->take(5)->pluck('material_id'))->with('course:id,name')->get(),
            'in_progress' => Material::whereIn('id', $inProgressList)->take(5)->with('course:id,name')->get(),
            'completed' => Material::whereIn('id', $completedList)->take(5)->with('course:id,name')->get(),
            'not_started' => $allMaterials->whereNotIn('id', $submissions->pluck('material_id'))->take(5)->load('course:id,name')->values(),
            'is_fully_completed' => $totalMaterials > 0 && $completedMaterials === $totalMaterials
        ];
    }

    /**
     * Get Teacher statistics for a specific course.
     */
    public function getCourseTeacherStats($courseId)
    {
        $totalStudents = Enrollment::where('course_id', $courseId)->count();
        $materialIds = Material::where('course_id', $courseId)->pluck('id');
        $materialCount = $materialIds->count();
        
        $submissions = Submission::whereIn('material_id', $materialIds)->get();
        
        $completedSubmissions = $submissions->whereNotNull('submitted_at');
        
        $totalExpected = $totalStudents * $materialCount;
        $completionRate = $totalExpected > 0 ? round(($completedSubmissions->count() / $totalExpected) * 100) : 0;
        
        $studentsCompleted = 0;
        if ($materialCount > 0) {
            $studentsCompleted = $completedSubmissions->groupBy('student_id')
                ->filter(function($studentSubmissions) use ($materialCount) {
                    return $studentSubmissions->count() == $materialCount;
                })->count();
        }

        $avgScore = $completedSubmissions->avg('score') ?? 0;

        return [
            'students_enrolled' => $totalStudents,
            'students_completed' => $studentsCompleted,
            'completion_rate' => $completionRate,
            'average_score' => round($avgScore, 1),
            // Kept for backward compatibility
            'ready' => $submissions->whereNull('submitted_at')->whereNotNull('reading_finished_at')->count(),
            'reading' => $submissions->whereNull('reading_finished_at')->whereNotNull('started_at')->count(),
        ];
    }
}
