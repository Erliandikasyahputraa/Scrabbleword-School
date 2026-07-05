<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = ['student_id', 'material_id', 'score', 'is_completed'];

    protected $casts = [
        'is_completed' => 'boolean',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}