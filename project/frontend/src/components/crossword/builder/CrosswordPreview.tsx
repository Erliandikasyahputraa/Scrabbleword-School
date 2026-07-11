import type { CrosswordData } from '../../../types/crossword';
import { CrosswordProvider } from '../CrosswordProvider';
import { CrosswordBoard } from '../CrosswordBoard';
import { Hash, Maximize, Clock, BrainCircuit } from 'lucide-react';

interface CrosswordPreviewProps {
  data: CrosswordData;
}

export function CrosswordPreview({ data }: CrosswordPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-500">
             <Hash size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Words</p>
            <p className="font-bold text-slate-900 dark:text-white">{data.words.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg text-indigo-500">
             <Maximize size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Grid Size</p>
            <p className="font-bold text-slate-900 dark:text-white">{data.grid.cols} x {data.grid.rows}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-orange-500">
             <BrainCircuit size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Difficulty</p>
            <p className="font-bold text-slate-900 dark:text-white">{data.metadata.difficulty}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-green-500">
             <Clock size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Est. Time</p>
            <p className="font-bold text-slate-900 dark:text-white">{Math.ceil(data.metadata.estimated_time / 60)} min</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 overflow-hidden">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Layout Preview</h3>
        <div className="w-full overflow-hidden flex justify-center pointer-events-none transform scale-90 origin-top">
          <CrosswordProvider data={data}>
            <CrosswordBoard />
          </CrosswordProvider>
        </div>
      </div>
    </div>
  );
}
