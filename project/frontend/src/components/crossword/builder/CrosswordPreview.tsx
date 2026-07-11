import type { CrosswordData } from '../../../types/crossword';
import { CrosswordProvider } from '../CrosswordProvider';
import { CrosswordBoard } from '../CrosswordBoard';
import { Hash, Maximize, Clock, BrainCircuit } from 'lucide-react';

interface CrosswordPreviewProps {
  data: CrosswordData;
}

export function CrosswordPreview({ data }: CrosswordPreviewProps) {
  return (
    <div className="flex flex-col h-full space-y-4">
      {/* HERO COMPONENT: The Crossword Board */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 overflow-hidden flex flex-col relative w-full h-auto min-h-[350px] flex-1 shadow-inner items-center justify-center">
        <div className="w-full h-full flex justify-center items-center">
          <div 
             className="pointer-events-none origin-center w-full max-w-full flex justify-center"
             style={{
               aspectRatio: '1 / 1',
               maxHeight: '100%'
             }}
          >
            <CrosswordProvider data={data}>
              <CrosswordBoard />
            </CrosswordProvider>
          </div>
        </div>
      </div>

      {/* SECONDARY COMPONENT: Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
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
    </div>
  );
}
