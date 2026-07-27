<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add missing unique constraint so that updateOrCreate in SubmissionController
     * is enforced at the database level, preventing duplicate submissions from
     * concurrent requests.
     */
    public function up(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->unique(['student_id', 'material_id'], 'submissions_student_material_unique');
        });
    }

    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropUnique('submissions_student_material_unique');
        });
    }
};
