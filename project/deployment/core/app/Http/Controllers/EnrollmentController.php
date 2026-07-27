<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\User;
use App\Models\Enrollment;

class EnrollmentController extends Controller
{
    /**
     * Get all students with their enrollment status for a specific course.
     */
    public function index(Request $request, $courseId)
    {
        $course = Course::findOrFail($courseId);
        $user = $request->user();

        // Only teacher who owns the course, or admin
        if ($user->role === 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($user->role === 'teacher' && $course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $enrolledStudentIds = Enrollment::where('course_id', $courseId)->pluck('student_id')->toArray();
        
        $students = User::where('role', 'student')->where('status', 'approved')->get()->map(function($student) use ($enrolledStudentIds) {
            return [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'is_enrolled' => in_array($student->id, $enrolledStudentIds)
            ];
        });

        return response()->json($students);
    }

    /**
     * Toggle enrollment status for a student in a course.
     */
    public function toggle(Request $request, $courseId)
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
            'is_enrolled' => 'required|boolean'
        ]);

        $course = Course::findOrFail($courseId);
        $user = $request->user();

        // Only teacher who owns the course, or admin
        if ($user->role === 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($user->role === 'teacher' && $course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $studentId = $request->student_id;
        $shouldEnroll = $request->is_enrolled;

        if ($shouldEnroll) {
            Enrollment::firstOrCreate([
                'course_id' => $courseId,
                'student_id' => $studentId
            ]);
        } else {
            Enrollment::where('course_id', $courseId)->where('student_id', $studentId)->delete();
        }

        return response()->json(['message' => 'Enrollment updated successfully.']);
    }
}
