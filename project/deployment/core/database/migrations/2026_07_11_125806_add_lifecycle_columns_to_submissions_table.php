<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->timestamp('started_at')->nullable()->after('is_completed');
            $table->timestamp('reading_finished_at')->nullable()->after('started_at');
            $table->timestamp('submitted_at')->nullable()->after('reading_finished_at');
            $table->integer('correct_answers')->default(0)->after('submitted_at');
            $table->integer('wrong_answers')->default(0)->after('correct_answers');
        });

        // Migrate existing data
        \Illuminate\Support\Facades\DB::table('submissions')->update([
            'started_at' => \Illuminate\Support\Facades\DB::raw('created_at'),
            'submitted_at' => \Illuminate\Support\Facades\DB::raw('CASE WHEN is_completed = 1 THEN updated_at ELSE NULL END'),
            'reading_finished_at' => \Illuminate\Support\Facades\DB::raw('CASE WHEN is_completed = 0 THEN updated_at ELSE updated_at END'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropColumn([
                'started_at',
                'reading_finished_at',
                'submitted_at',
                'correct_answers',
                'wrong_answers',
            ]);
        });
    }
};
