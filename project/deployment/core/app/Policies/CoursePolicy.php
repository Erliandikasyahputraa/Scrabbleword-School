<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Course;

class CoursePolicy
{
    public function update(User $user, Course $course): bool
    {
        return $user->id === $course->teacher_id;
    }

    public function delete(User $user, Course $course): bool
    {
        return $user->id === $course->teacher_id;
    }
}
