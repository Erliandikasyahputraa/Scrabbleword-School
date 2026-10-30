import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCrossword } from '../../hooks/useCrossword';
import { Button } from '../ui/Button';
import { fetchApi } from '../../lib/api';
import { buildSubmissionPayload } from '../../utils/crossword.utils';
import { Send, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
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
    const totalWords = (result.correct_words || 0) + (result.incorrect_words || 0);
    const percentage = totalWords > 0 
      ? Math.round((result.correct_words / totalWords) * 100)
      : Math.min(100, Math.max(0, result.score || 0));

    // Evaluasi skor: Merah (<50%), Kuning (50% - 69%), Hijau (>=70%)
    const isLow = percentage < 50;
    const isMedium = percentage >= 50 && percentage < 70;

    const bannerConfig = isLow
      ? {
          wrapper: "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800",
          icon: <XCircle className="mx-auto text-red-500 mb-3" size={36} />,
          titleColor: "text-red-800 dark:text-red-300",
          title: "Perlu Latihan Lagi!",
          subColor: "text-red-600 dark:text-red-400",
          statsColor: "text-red-700 dark:text-red-400"
        }
      : isMedium
      ? {
          wrapper: "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800",
          icon: <AlertTriangle className="mx-auto text-amber-500 mb-3" size={36} />,
          titleColor: "text-amber-800 dark:text-amber-300",
          title: "Cukup Baik!",
          subColor: "text-amber-600 dark:text-amber-400",
          statsColor: "text-amber-700 dark:text-amber-400"
        }
      : {
          wrapper: "bg-green-50 dark:bg-green-950/40 border-green-300 dark:border-green-800",
          icon: <CheckCircle className="mx-auto text-green-500 mb-3" size={36} />,
          titleColor: "text-green-800 dark:text-green-300",
          title: "Luar Biasa, Selesai!",
          subColor: "text-green-600 dark:text-green-400",
          statsColor: "text-green-700 dark:text-green-400"
        };

    return (
      <div className={`mt-4 sm:mt-8 p-5 sm:p-6 border rounded-2xl text-center animate-in zoom-in duration-300 ${bannerConfig.wrapper}`}>
        {bannerConfig.icon}
        <h3 className={`text-xl font-bold mb-1 ${bannerConfig.titleColor}`}>
          {bannerConfig.title}
        </h3>
        <p className={`text-sm sm:text-base mb-3 ${bannerConfig.subColor}`}>
          Nilai Anda: <span className="font-extrabold text-lg">{percentage}%</span> ({result.score} poin)
        </p>
        <div className={`flex justify-center gap-6 text-sm font-medium ${bannerConfig.statsColor}`}>
          <div className="bg-white/60 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-current/10">
            <span className="font-bold text-base">{result.correct_words}</span> Kata Benar
          </div>
          <div className="bg-white/60 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-current/10">
            <span className="font-bold text-base">{result.incorrect_words}</span> Kata Salah
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted && !result) {
    return (
      <div className="mt-4 sm:mt-8 p-5 sm:p-6 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl text-center animate-in zoom-in duration-300">
        <CheckCircle className="mx-auto text-amber-500 mb-3" size={36} />
        <h3 className="text-xl font-bold text-amber-800 dark:text-amber-300 mb-2">Sudah Pernah Dikumpulkan</h3>
        <p className="text-amber-600 dark:text-amber-400 text-sm">Anda telah menyelesaikan dan mengumpulkan teka-teki silang materi ini.</p>
      </div>
    );
  }

  return (
    <div className="mt-2 sm:mt-6 flex flex-col items-center gap-3 w-full">
      {submitMutation.isError && (
        <div className="text-red-500 text-sm font-medium p-3 bg-red-50 dark:bg-red-900/20 rounded-xl w-full text-center border border-red-200 dark:border-red-800">
          {submitMutation.error?.message === 'You have already submitted this material.' 
            ? 'Anda sudah mengumpulkan materi ini sebelumnya.'
            : (submitMutation.error?.message || 'Terjadi kesalahan saat mengumpulkan jawaban.')}
        </div>
      )}
      <Button 
        onClick={handleSubmit}
        disabled={submitMutation.isPending || isSubmitted}
        className="w-full sm:w-auto px-8 h-12 rounded-full font-bold shadow-lg transition-all gap-2 text-white"
        style={{
          backgroundColor: 'var(--workspace-primary)',
          boxShadow: '0 4px 14px 0 var(--workspace-shadow)'
        }}
      >
        <Send size={18} />
        {submitMutation.isPending ? 'Mengumpulkan Jawaban...' : 'Kumpulkan Jawaban'}
      </Button>
    </div>
  );
}
