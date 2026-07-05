import { useCrossword } from '../../hooks/useCrossword';
import { Button } from '../ui/Button';
import { Lightbulb, Clock } from 'lucide-react';

export function CrosswordToolbar() {
  const { hintsRemaining, useHint, isSubmitted, timeSpent } = useCrossword();

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-t-2xl shadow-sm">
      <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-full font-mono text-sm">
        <Clock size={16} className="text-slate-400" />
        <span>{formatTime(timeSpent)}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={useHint}
          disabled={hintsRemaining === 0 || isSubmitted}
          className="border-slate-700 hover:bg-slate-800 text-white disabled:opacity-50 gap-2"
        >
          <Lightbulb size={16} className={hintsRemaining > 0 ? "text-yellow-400" : "text-slate-500"} />
          Hint ({hintsRemaining} left)
        </Button>
      </div>
    </div>
  );
}

