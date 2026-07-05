<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'admin') {
            // Admin sees ALL courses with full stats
            $courses = Course::withCount(['materials', 'students'])->get();
        } elseif ($user->role === 'teacher') {
            $courses = $user->taughtCourses()->withCount('students')->withCount('materials')->get();
        } else {
            // Students see only enrolled courses
            $courses = $user->enrolledCourses()->withCount('materials')->get();
            
            // Calculate progress for each course
            foreach ($courses as $course) {
                if ($course->materials_count == 0) {
                    $course->progress = 0;
                } else {
                    $completedMaterials = \App\Models\Submission::where('student_id', $user->id)
                        ->whereIn('material_id', $course->materials()->pluck('id'))
                        ->where('is_completed', true)
                        ->count();
                    $course->progress = round(($completedMaterials / $course->materials_count) * 100);
                }
            }
        }
        return response()->json($courses);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        // Only teacher and admin can create courses
        if (!in_array($user->role, ['teacher', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Admin creates courses without a teacher assigned (or optionally with a teacher_id param)
        $teacherId = ($user->role === 'admin')
            ? ($request->input('teacher_id', $user->id))
            : $user->id;

        $course = Course::create([
            'name' => $request->name,
            'description' => $request->description,
            'teacher_id' => $teacherId,
        ]);

        return response()->json($course, 201);
    }

    public function show(Request $request, $id)
    {
        $course = Course::with(['materials', 'teacher:id,name'])->findOrFail($id);
        
        $user = $request->user();
        
        if ($user->role === 'teacher' && $course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized: You do not own this course.'], 403);
        }

        $courseData = $course->toArray();
        $courseData['teacher_name'] = $course->teacher?->name;

        if ($user->role === 'student') {
            if (!$user->enrolledCourses()->where('course_id', $id)->exists()) {
                return response()->json(['message' => 'Unauthorized: You are not enrolled in this course.'], 403);
            }
            
            // Calculate progress
            $materialsCount = $course->materials()->count();
            if ($materialsCount == 0) {
                $courseData['progress'] = 0;
            } else {
                $completedMaterials = \App\Models\Submission::where('student_id', $user->id)
                    ->whereIn('material_id', $course->materials()->pluck('id'))
                    ->where('is_completed', true)
                    ->count();
                $courseData['progress'] = round(($completedMaterials / $materialsCount) * 100);
            }
            
            // Append Material status
            $mySubmissions = \App\Models\Submission::where('student_id', $user->id)
                ->whereIn('material_id', $course->materials()->pluck('id'))
                ->get()
                ->keyBy('material_id');
                
            foreach ($courseData['materials'] as &$mat) {
                if ($mySubmissions->has($mat['id'])) {
                    $mat['status'] = $mySubmissions[$mat['id']]->is_completed ? 'COMPLETED' : 'IN_PROGRESS';
                } else {
                    $mat['status'] = 'NOT_STARTED';
                }
            }
        }

        return response()->json($courseData);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $user = $request->user();

        if ($user->role === 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($user->role === 'teacher' && $course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized: You do not own this course.'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $course->update($request->only(['name', 'description']));
        return response()->json($course);
    }

    public function destroy(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $user = $request->user();

        if ($user->role === 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($user->role === 'teacher' && $course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized: You do not own this course.'], 403);
        }
        
        $course->delete();
        return response()->json(['message' => 'Course deleted']);
    }
}

