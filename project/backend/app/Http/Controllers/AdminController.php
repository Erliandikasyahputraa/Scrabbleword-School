<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function pendingUsers(Request $request)
    {
        $user = $request->user();
        
        if ($user->role === 'admin') {
            // Admin can see pending teachers and students
            $pendingUsers = User::where('status', 'pending')->get();
        } elseif ($user->role === 'teacher') {
            // Teachers can only see pending students
            $pendingUsers = User::where('status', 'pending')->where('role', 'student')->get();
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($pendingUsers);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $user = clone $request->user();
        $targetUser = User::findOrFail($id);

        if ($user->role === 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->role === 'teacher' && $targetUser->role !== 'student') {
            return response()->json(['message' => 'Teachers can only approve students'], 403);
        }

        $targetUser->update(['status' => $request->status]);

        return response()->json(['message' => 'User status updated successfully', 'user' => $targetUser]);
    }
}
