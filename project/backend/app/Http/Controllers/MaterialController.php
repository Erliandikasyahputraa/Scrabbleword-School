<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Material;
use App\Models\Course;

class MaterialController extends Controller
{
    public function index($courseId)
    {
        $materials = Material::where('course_id', $courseId)->get();
        return response()->json($materials);
    }

    public function show($courseId, $id)
    {
        $material = Material::where('course_id', $courseId)->findOrFail($id);
        return response()->json($material);
    }

    public function store(Request $request, $courseId)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'pdf' => 'required|file|mimes:pdf|max:10240',
            'crossword_data' => 'nullable|json',
        ]);

        $course = Course::findOrFail($courseId);
        $user = $request->user();
        
        // Authorization: teacher must own the course; admin can manage any course
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
}
