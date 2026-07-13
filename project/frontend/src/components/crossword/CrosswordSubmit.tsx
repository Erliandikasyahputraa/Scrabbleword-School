import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCrossword } from '../../hooks/useCrossword';
import { Button } from '../ui/Button';
import { fetchApi } from '../../lib/api';
import { buildSubmissionPayload } from '../../utils/crossword.utils';
import { Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type SubmissionResult = {
  score: number;
  correct_words: number;
  incorrect_words: number;
};

export function CrosswordSubmit({ materialId }: { materialId: number }) {
  const { t } = useTranslation('courses');
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
    },
    onError: (error: any) => {
      if (error?.message === 'You have already submitted this material.') {
         setSubmitted(); // Lock the UI since it's already submitted
      }
    }
  });

  const handleSubmit = () => {
    const answers = buildSubmissionPayload(data, userAnswers);
    submitMutation.mutate({
      answers,
      time_spent: timeSpent,
      hints_used: data.metadata.max_hints - timeSpent,
    });
  };

  if (isSubmitted && result) {
    return (
      <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-center animate-in zoom-in duration-300">
        <CheckCircle className="mx-auto text-green-500 mb-3" size={32} />
        <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">{t('crosswordCompleted')}</h3>
        <p className="text-green-600 dark:text-green-400 mb-4">{t('youScoredPoints', { score: result.score })}</p>
        <div className="flex justify-center gap-6 text-sm text-green-700 dark:text-green-500">
          <div><span className="font-bold">{result.correct_words}</span> {t('correctWords')}</div>
          <div><span className="font-bold">{result.incorrect_words}</span> {t('incorrectWords')}</div>
        </div>
      </div>
    );
  }

  if (isSubmitted && !result) {
      return (
        <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-center animate-in zoom-in duration-300">
          <CheckCircle className="mx-auto text-amber-500 mb-3" size={32} />
          <h3 className="text-xl font-bold text-amber-800 dark:text-amber-300 mb-2">{t('alreadySubmitted')}</h3>
          <p className="text-amber-600 dark:text-amber-400 mb-4">{t('alreadySubmittedDesc')}</p>
        </div>
      );
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      {submitMutation.isError && (
          <div className="text-red-500 text-sm font-medium p-3 bg-red-50 dark:bg-red-900/20 rounded-lg w-full text-center max-w-sm border border-red-200 dark:border-red-800">
              {submitMutation.error?.message || t('errorSubmission')}
          </div>
      )}
      <Button 
        onClick={handleSubmit}
        disabled={submitMutation.isPending || isSubmitted}
        className="px-8 h-12 rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all gap-2"
      >
        <Send size={18} />
        {submitMutation.isPending ? t('submitting') : t('submitAnswers')}
      </Button>
    </div>
  );
}

