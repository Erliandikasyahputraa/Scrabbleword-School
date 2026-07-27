<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Material;
use App\Models\Submission;
use App\Services\SubmissionService;

class SubmissionController extends Controller
{
    protected $submissionService;

    public function __construct(SubmissionService $submissionService)
    {
        $this->submissionService = $submissionService;
    }

    public function startRead(Request $request, $materialId)
    {
        $user = $request->user();
        $material = Material::findOrFail($materialId);

        if (!$user->enrolledCourses()->where('course_id', $material->course_id)->exists()) {
            return response()->json(['message' => 'Unauthorized: You are not enrolled in this course.'], 403);
        }

        $submission = $this->submissionService->startReading($user->id, $materialId);
        return response()->json(['message' => 'Started reading', 'submission' => $submission]);
    }

    public function markRead(Request $request, $materialId)
    {
        $user = $request->user();
        $material = Material::findOrFail($materialId);

        if (!$user->enrolledCourses()->where('course_id', $material->course_id)->exists()) {
            return response()->json(['message' => 'Unauthorized: You are not enrolled in this course.'], 403);
        }

        $submission = $this->submissionService->finishReading($user->id, $materialId);
        return response()->json(['message' => 'PDF marked as read', 'submission' => $submission]);
    }

    public function store(Request $request, $materialId)
    {
        $request->validate([
            'answers' => 'required|array'
        ]);

        $material = Material::findOrFail($materialId);
        $user = $request->user();
        
        if (!$user->enrolledCourses()->where('course_id', $material->course_id)->exists()) {
            return response()->json(['message' => 'Unauthorized: You are not enrolled in this course.'], 403);
        }

        // Service handles duplicates, calculations, and updates
        $submission = $this->submissionService->submitCrossword($user->id, $materialId, $request->answers);

        return response()->json([
            'message' => 'Crossword submitted successfully',
            'result' => [
                'score' => $submission->score,
                'correct_words' => $submission->correct_answers,
                'incorrect_words' => $submission->wrong_answers,
                'time_spent' => $submission->time_spent_seconds,
            ]
        ], 201);
    }

    public function history(Request $request)
    {
        $query = Submission::where('student_id', $request->user()->id)
            ->with(['material:id,title,course_id', 'material.course:id,name']);

        // Sorting
        $sort = $request->query('sort', 'newest');
        switch ($sort) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'highest_score':
                $query->orderBy('score', 'desc')->orderBy('created_at', 'desc');
                break;
            case 'lowest_score':
                $query->orderBy('score', 'asc')->orderBy('created_at', 'desc');
                break;
            case 'course':
                // For course sorting, we might need a join or just order by material_id for simplicity in Eloquent without joins.
                // To properly sort by course name, a join is required.
                $query->join('materials', 'submissions.material_id', '=', 'materials.id')
                      ->join('courses', 'materials.course_id', '=', 'courses.id')
                      ->orderBy('courses.name', 'asc')
                      ->select('submissions.*');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $submissions = $query->paginate(10);
        return response()->json($submissions);
    }

    public function mySubmission(Request $request, $materialId)
    {
        $submission = Submission::where('student_id', $request->user()->id)
            ->where('material_id', $materialId)
            ->first();
            
        if (!$submission) {
            return response()->json(null, 200);
        }
        
        return response()->json($submission);
    }
}

