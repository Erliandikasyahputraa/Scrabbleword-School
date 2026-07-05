<?php

namespace App\Repositories;

use App\Models\Submission;

class SubmissionRepository
{
    public function getStudentHistory($studentId)
    {
        return Submission::where('student_id', $studentId)->get();
    }
}
