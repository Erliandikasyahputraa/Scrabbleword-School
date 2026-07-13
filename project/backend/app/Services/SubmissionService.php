<?php

namespace App\Services;

use App\Models\Submission;
use App\Models\Material;
use Illuminate\Support\Carbon;

class SubmissionService
{
    /**
     * Start reading a material.
     */
    public function startReading($studentId, $materialId)
    {
        $submission = Submission::where('student_id', $studentId)
            ->where('material_id', $materialId)
            ->first();

        if (!$submission) {
            return Submission::create([
                'student_id' => $studentId,
                'material_id' => $materialId,
                'started_at' => Carbon::now(),
                'is_completed' => false,
                'score' => 0
            ]);
        }

        if ($submission->started_at === null) {
            $submission->update(['started_at' => Carbon::now()]);
        }

        return $submission;
    }

    /**
     * Finish reading a material.
     */
    public function finishReading($studentId, $materialId)
    {
        $submission = Submission::where('student_id', $studentId)
            ->where('material_id', $materialId)
            ->first();

        if (!$submission) {
            return Submission::create([
                'student_id' => $studentId,
                'material_id' => $materialId,
                'started_at' => Carbon::now(),
                'reading_finished_at' => Carbon::now(),
                'is_completed' => false,
                'score' => 0
            ]);
        }

        if ($submission->reading_finished_at === null) {
            $submission->update(['reading_finished_at' => Carbon::now()]);
        }

        return $submission;
    }

    /**
     * Submit crossword and calculate score.
     */
    public function submitCrossword($studentId, $materialId, $studentAnswers)
    {
        $submission = Submission::where('student_id', $studentId)
            ->where('material_id', $materialId)
            ->first();

        // If they bypass, create a basic record but they shouldn't realistically
        if (!$submission) {
            $submission = Submission::create([
                'student_id' => $studentId,
                'material_id' => $materialId,
                'started_at' => Carbon::now(),
                'reading_finished_at' => Carbon::now(),
                'is_completed' => false,
                'score' => 0
            ]);
        }

        if ($submission->submitted_at !== null) {
            return $submission; // Already submitted
        }

        $material = Material::findOrFail($materialId);
        $crosswordData = $material->crossword_data;
        
        $correctWordsCount = 0;
        $totalWords = 0;
        
        if ($crosswordData && isset($crosswordData['words'])) {
            $totalWords = count($crosswordData['words']);
            foreach ($crosswordData['words'] as $wordObj) {
                $id = $wordObj['id'];
                $correctWord = strtoupper($wordObj['word']);
                $studentWord = strtoupper($studentAnswers[$id] ?? '');
                
                if ($studentWord === $correctWord) {
                    $correctWordsCount++;
                }
            }
        }

        $score = ($totalWords > 0) ? round(($correctWordsCount / $totalWords) * 100) : 0;
        $wrongAnswersCount = $totalWords - $correctWordsCount;

        $submission->update([
            'score' => $score,
            'is_completed' => true,
            'submitted_at' => Carbon::now(),
            'correct_answers' => $correctWordsCount,
            'wrong_answers' => $wrongAnswersCount
        ]);

        return $submission->refresh();
    }
}
