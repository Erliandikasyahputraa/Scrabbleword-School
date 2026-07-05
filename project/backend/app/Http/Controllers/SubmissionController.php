<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Material;
use App\Models\Submission;
use App\Models\User;

class SubmissionController extends Controller
{
    public function store(Request $request, $materialId)
    {
        $request->validate([
            'answers' => 'required|array',
            'time_spent' => 'required|integer',
            'hints_used' => 'required|integer',
        ]);

        $material = Material::findOrFail($materialId);
        $studentAnswers = $request->answers;
        $crosswordData = $material->crossword_data;
        
        if (!$crosswordData || !isset($crosswordData['words'])) {
            return response()->json(['message' => 'Material does not contain a crossword.'], 400);
        }

        $correctWordsCount = 0;
        $totalWords = count($crosswordData['words']);
        
        foreach ($crosswordData['words'] as $wordObj) {
            $id = $wordObj['id'];
            $correctWord = strtoupper($wordObj['word']);
            $studentWord = strtoupper($studentAnswers[$id] ?? '');
            
            if ($studentWord === $correctWord) {
                $correctWordsCount++;
            }
        }

        $score = ($totalWords > 0) ? round(($correctWordsCount / $totalWords) * 100) : 0;
        $incorrectWordsCount = $totalWords - $correctWordsCount;
        
        $submission = Submission::updateOrCreate(
            ['student_id' => $request->user()->id, 'material_id' => $materialId],
            ['score' => $score, 'is_completed' => true]
        );

        return response()->json([
            'message' => 'Crossword submitted successfully',
            'result' => [
                'score' => $score,
                'correct_words' => $correctWordsCount,
                'incorrect_words' => $incorrectWordsCount,
                'time_spent' => $request->time_spent,
                'hints_used' => $request->hints_used,
            ]
        ], 201);
    }

    /**
     * Submission history for the authenticated student.
     */
    public function history(Request $request)
    {
        $submissions = Submission::where('student_id', $request->user()->id)
            ->with('material:id,title,course_id')
            ->orderBy('updated_at', 'desc')
            ->get();
        return response()->json($submissions);
    }

    /**
     * Submission statistics for a material (teacher/admin only).
     */
    public function stats(Request $request, $materialId)
    {
        $user = $request->user();
        
        // Authorization: only teacher who owns the course, or admin
        $material = Material::with('course:id,teacher_id')->findOrFail($materialId);
        
        if ($user->role === 'teacher' && $material->course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        if ($user->role === 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $submissions = Submission::where('material_id', $materialId)->get();
        
        // Total enrolled students for this course
        $totalEnrolled = \App\Models\Enrollment::where('course_id', $material->course_id)->count();
        $completed = $submissions->where('is_completed', true)->count();
        $averageScore = $submissions->where('is_completed', true)->avg('score') ?? 0;

        return response()->json([
            'total' => $totalEnrolled,
            'completed' => $completed,
            'pending' => max(0, $totalEnrolled - $completed),
            'average_score' => round($averageScore, 1),
        ]);
    }
}

