import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCrossword } from '../../hooks/useCrossword';
import { Button } from '../ui/Button';
import { fetchApi } from '../../lib/api';
import { buildSubmissionPayload } from '../../utils/crossword.utils';
import { Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';

type SubmissionResult = {
  score: number;
  correct_words: number;
  incorrect_words: number;
};

export function CrosswordSubmit({ materialId }: { materialId: number }) {
  const { data, userAnswers, setSubmitted, isSubmitted, timeSpent } = useCrossword();
  const queryClient = useQueryClient();
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const submitMutation = useMutation({
    mutationFn: (payload: object) => 
      fetchApi(`/materials/${materialId}/submissions`, {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    onSuccess: (response) => {
      setResult(response.result);
      setSubmitted();
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    }
  });

  const handleSubmit = () => {
    const answers = buildSubmissionPayload(data, userAnswers);
    submitMutation.mutate({
      answers,
      time_spent: timeSpent,
      hints_used: data.metadata.max_hints - timeSpent, // approximate; will be exact once hints_used is tracked in context
    });
  };

  if (isSubmitted && result) {
    return (
      <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-center animate-in zoom-in duration-300">
        <CheckCircle className="mx-auto text-green-500 mb-3" size={32} />
        <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Crossword Completed!</h3>
        <p className="text-green-600 dark:text-green-400 mb-4">You scored {result.score} points.</p>
        <div className="flex justify-center gap-6 text-sm text-green-700 dark:text-green-500">
          <div><span className="font-bold">{result.correct_words}</span> Correct Words</div>
          <div><span className="font-bold">{result.incorrect_words}</span> Incorrect Words</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex justify-center">
      <Button 
        onClick={handleSubmit}
        disabled={submitMutation.isPending || isSubmitted}
        className="px-8 h-12 rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all gap-2"
      >
        <Send size={18} />
        {submitMutation.isPending ? 'Submitting...' : 'Submit Answers'}
      </Button>
    </div>
  );
}

