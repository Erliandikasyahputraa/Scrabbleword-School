<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = [
        'student_id', 
        'material_id', 
        'score', 
        'is_completed',
        'started_at',
        'reading_finished_at',
        'submitted_at',
        'correct_answers',
        'wrong_answers'
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'started_at' => 'datetime',
        'reading_finished_at' => 'datetime',
        'submitted_at' => 'datetime',
    ];

    protected $appends = ['status', 'time_spent_seconds'];

    public function getStatusAttribute()
    {
        if ($this->submitted_at !== null) {
            return \App\Enums\SubmissionStatus::COMPLETED;
        }
        if ($this->reading_finished_at !== null) {
            return \App\Enums\SubmissionStatus::READY_FOR_CROSSWORD;
        }
        if ($this->started_at !== null) {
            return \App\Enums\SubmissionStatus::READING;
        }
        return \App\Enums\SubmissionStatus::NOT_STARTED;
    }

    public function getTimeSpentSecondsAttribute()
    {
        if ($this->started_at && $this->submitted_at) {
            return $this->submitted_at->diffInSeconds($this->started_at);
        }
        return 0;
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}