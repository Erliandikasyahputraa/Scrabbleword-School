<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Submission;
use Illuminate\Database\Eloquent\Builder;
use App\Services\LearningService;

class CourseController extends Controller
{
    protected $learningService;

    public function __construct(LearningService $learningService)
    {
        $this->learningService = $learningService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Course::with('teacher:id,name')->withCount('materials', 'students');

        // Base Role Restrictions
        if ($user->role === 'teacher') {
            $query->where('teacher_id', $user->id);
        } elseif ($user->role === 'student') {
            $query->whereHas('enrollments', function (Builder $q) use ($user) {
                $q->where('student_id', $user->id);
            });
        }

        // Search
        if ($search = $request->query('search')) {
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('teacher', function (Builder $q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('materials', function (Builder $q2) use ($search) {
                      $q2->where('title', 'like', "%{$search}%");
                  });
            });
        }

        // Filters (Admin/Teacher)
        if ($teacherId = $request->query('teacher_id')) {
            if ($user->role === 'admin') {
                $query->where('teacher_id', $teacherId);
            }
        }

        // Student Filters (Status: completed, in_progress, not_started)
        if ($user->role === 'student' && $status = $request->query('status')) {
            if ($status === 'completed') {
                // Course where all materials have a submitted_at for this student
                // We'll compute this post-pagination to keep Eloquent query simple
            }
        }

        // Sort
        $sort = $request->query('sort', 'newest');
        switch ($sort) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $courses = $query->paginate(10);
        
        // Append dynamic attributes
        $courses->getCollection()->transform(function ($course) use ($user) {
            $course->teacher_name = $course->teacher?->name;
            $course->teacher_avatar_initial = $course->teacher_name ? strtoupper(substr($course->teacher_name, 0, 1)) : '?';
            
            if ($user->role === 'student') {
                $submissions = Submission::where('student_id', $user->id)
                    ->whereIn('material_id', $course->materials()->pluck('id'))
                    ->whereNotNull('submitted_at')
                    ->count();
                $course->progress = $course->materials_count > 0 ? round(($submissions / $course->materials_count) * 100) : 0;
            } elseif (in_array($user->role, ['teacher', 'admin'])) {
                // Completion rate for course
                $totalExpected = $course->students_count * $course->materials_count;
                if ($totalExpected > 0) {
                    $completed = Submission::whereIn('material_id', $course->materials()->pluck('id'))
                        ->whereNotNull('submitted_at')->count();
                    $course->completion_rate = round(($completed / $totalExpected) * 100);
                } else {
                    $course->completion_rate = 0;
                }
            }
            
            return $course;
        });

        // If student filtered by status, we must filter the collection (MVP simplification, ideally in SQL)
        if ($user->role === 'student' && $status = $request->query('status')) {
            $filtered = $courses->getCollection()->filter(function ($course) use ($status) {
                if ($status === 'completed') return $course->progress === 100;
                if ($status === 'in_progress') return $course->progress > 0 && $course->progress < 100;
                if ($status === 'not_started') return $course->progress === 0;
                return true;
            })->values();
            $courses->setCollection($filtered);
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
        $courseData['teacher_avatar_initial'] = $course->teacher?->name ? strtoupper(substr($course->teacher->name, 0, 1)) : '?';

        if ($user->role === 'student') {
            if (!$user->enrolledCourses()->where('course_id', $id)->exists()) {
                return response()->json(['message' => 'Unauthorized: You are not enrolled in this course.'], 403);
            }
            
            $materialsCount = $course->materials()->count();
            if ($materialsCount == 0) {
                $courseData['progress'] = 0;
            } else {
                $completedMaterials = \App\Models\Submission::where('student_id', $user->id)
                    ->whereIn('material_id', $course->materials()->pluck('id'))
                    ->whereNotNull('submitted_at')
                    ->count();
                $courseData['progress'] = round(($completedMaterials / $materialsCount) * 100);
            }
            
            $mySubmissions = \App\Models\Submission::where('student_id', $user->id)
                ->whereIn('material_id', $course->materials()->pluck('id'))
                ->get()
                ->keyBy('material_id');
                
            foreach ($courseData['materials'] as &$mat) {
                if ($mySubmissions->has($mat['id'])) {
                    $mat['status'] = $mySubmissions[$mat['id']]->status;
                } else {
                    $mat['status'] = 'NOT_STARTED';
                }
            }
        } elseif (in_array($user->role, ['teacher', 'admin'])) {
            $courseData['analytics'] = $this->learningService->getCourseTeacherStats($id);
        }

        return response()->json($courseData);
    }

    public function monitoring(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role === 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $course = Course::findOrFail($id);
        if ($user->role === 'teacher' && $course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized: You do not own this course.'], 403);
        }

        $materialIds = $course->materials()->pluck('id');
        
        $query = \App\Models\Submission::with(['student:id,name,email', 'material:id,title'])
            ->whereIn('material_id', $materialIds);

        // Sort by
        $sort = $request->query('sort', 'newest');
        if ($sort === 'oldest') {
            $query->orderBy('created_at', 'asc');
        } elseif ($sort === 'score_high') {
            $query->orderBy('score', 'desc');
        } elseif ($sort === 'score_low') {
            $query->orderBy('score', 'asc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return response()->json($query->paginate(10));
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

