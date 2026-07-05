<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\EnrollmentController;

// Auth Routes (public)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Dashboard Stats (role-conditional logic inside controller)
    Route::get('/dashboard/stats', [\App\Http\Controllers\DashboardController::class, 'stats']);

    // Approval Routes (admin + teacher access — checked inside AdminController)
    // NOTE: These MUST appear before apiResource('users') to avoid {user} wildcard capturing /users/pending
    Route::get('/users/pending', [\App\Http\Controllers\AdminController::class, 'pendingUsers']);
    Route::put('/users/{id}/status', [\App\Http\Controllers\AdminController::class, 'updateStatus']);

    // User Management CRUD (admin only — enforced by middleware AND controller)
    Route::apiResource('users', \App\Http\Controllers\UserController::class)->middleware('admin');

    // Course & Material Routes
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    // Both teacher and admin can create/delete courses (admin enforced inside controller too)
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

    Route::get('/courses/{course}/enrollments', [EnrollmentController::class, 'index']);
    Route::post('/courses/{course}/enrollments', [EnrollmentController::class, 'toggle']);

    Route::get('/courses/{courseId}/materials', [MaterialController::class, 'index']);
    Route::get('/courses/{courseId}/materials/{id}', [MaterialController::class, 'show']);
    Route::get('/courses/{courseId}/materials/{id}/pdf', [MaterialController::class, 'streamPdf']);
    Route::post('/courses/{courseId}/materials', [MaterialController::class, 'store']);
    Route::put('/courses/{courseId}/materials/{id}', [MaterialController::class, 'update']);
    Route::delete('/courses/{courseId}/materials/{id}', [MaterialController::class, 'destroy']);

    // Submissions (student only — enforced by middleware AND controller)
    Route::post('/materials/{materialId}/submissions', [SubmissionController::class, 'store'])->middleware('student');
    Route::post('/materials/{materialId}/read', [SubmissionController::class, 'markRead'])->middleware('student');
    Route::get('/materials/{materialId}/my-submission', [SubmissionController::class, 'mySubmission'])->middleware('student');
    Route::get('/submissions/history', [SubmissionController::class, 'history'])->middleware('student');
    // Submission stats for teacher/admin
    Route::get('/materials/{materialId}/submission-stats', [SubmissionController::class, 'stats']);
});

