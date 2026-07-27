<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Material;
use App\Models\Course;

class MaterialController extends Controller
{
    public function index(Request $request, $courseId)
    {
        $course = Course::findOrFail($courseId);
        $user = $request->user();

        if ($user->role === 'student' && !$user->enrolledCourses()->where('course_id', $courseId)->exists()) {
            return response()->json(['message' => 'Unauthorized: You are not enrolled in this course.'], 403);
        }
        if ($user->role === 'teacher' && $course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized: You do not own this course.'], 403);
        }

        $materials = Material::where('course_id', $courseId)->get();
        return response()->json($materials);
    }

    public function show(Request $request, $courseId, $id)
    {
        $course = Course::findOrFail($courseId);
        $user = $request->user();

        if ($user->role === 'student' && !$user->enrolledCourses()->where('course_id', $courseId)->exists()) {
            return response()->json(['message' => 'Unauthorized: You are not enrolled in this course.'], 403);
        }
        if ($user->role === 'teacher' && $course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized: You do not own this course.'], 403);
        }

        $material = Material::where('course_id', $courseId)->findOrFail($id);
        return response()->json($material);
    }

    public function store(Request $request, $courseId)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'pdf' => 'required|file|extensions:pdf|max:10240',
                'crossword_data' => 'nullable|json',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Illuminate\Support\Facades\Log::error('Validation failed: ' . json_encode($e->errors()));
            throw $e;
        }

        $course = Course::findOrFail($courseId);
        $user = $request->user();
        
        if ($user->role === 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($user->role === 'teacher' && $course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $path = $request->file('pdf')->store('materials', 'public');

        $material = $course->materials()->create([
            'title' => $request->title,
            'pdf_path' => $path,
            'crossword_data' => $request->crossword_data ? json_decode($request->crossword_data, true) : null,
        ]);

        return response()->json($material, 201);
    }

    public function update(Request $request, $courseId, $id)
    {
        $course = Course::findOrFail($courseId);
        $user = $request->user();

        if ($user->role === 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($user->role === 'teacher' && $course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $material = Material::where('course_id', $courseId)->findOrFail($id);

        try {
            $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'pdf' => 'sometimes|file|extensions:pdf|max:10240',
                'crossword_data' => 'nullable|json',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Illuminate\Support\Facades\Log::error('Validation failed: ' . json_encode($e->errors()));
            throw $e;
        }

        if ($request->has('title')) {
            $material->title = $request->title;
        }

        if ($request->hasFile('pdf')) {
            if ($material->pdf_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($material->pdf_path);
            }
            $material->pdf_path = $request->file('pdf')->store('materials', 'public');
        }

        if ($request->has('crossword_data')) {
            $material->crossword_data = $request->crossword_data ? json_decode($request->crossword_data, true) : null;
        }

        $material->save();
        return response()->json($material);
    }

    public function destroy(Request $request, $courseId, $id)
    {
        $material = Material::where('course_id', $courseId)->findOrFail($id);
        $user = $request->user();

        if ($user->role === 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($user->role === 'teacher') {
            $course = Course::findOrFail($courseId);
            if ($course->teacher_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        // Delete PDF from storage
        if ($material->pdf_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($material->pdf_path);
        }

        $material->delete();
        return response()->json(['message' => 'Material deleted']);
    }
    public function streamPdf(Request $request, $courseId, $id)
    {
        $course = Course::findOrFail($courseId);
        $user = $request->user();

        if ($user->role === 'student' && !$user->enrolledCourses()->where('course_id', $courseId)->exists()) {
            return response()->json(['message' => 'Unauthorized: You are not enrolled in this course.'], 403);
        }
        if ($user->role === 'teacher' && $course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized: You do not own this course.'], 403);
        }

        $material = Material::where('course_id', $courseId)->findOrFail($id);

        if (!$material->pdf_path || !\Illuminate\Support\Facades\Storage::disk('public')->exists($material->pdf_path)) {
            return response()->json(['message' => 'PDF not found.'], 404);
        }

        $path = \Illuminate\Support\Facades\Storage::disk('public')->path($material->pdf_path);
        
        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Access-Control-Allow-Origin' => '*',
        ]);
    }
}
