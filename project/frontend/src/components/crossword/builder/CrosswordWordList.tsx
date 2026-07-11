import { Trash2 } from 'lucide-react';
import type { CrosswordInputWord } from '../../../lib/crosswordGenerator';

interface CrosswordWordListProps {
  words: CrosswordInputWord[];
  onRemoveWord: (index: number) => void;
  disabled?: boolean;
}

export function CrosswordWordList({ words, onRemoveWord, disabled }: CrosswordWordListProps) {
  if (words.length === 0) {
    return (
      <div className="text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No words added yet. Add at least two words to generate a puzzle.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 pr-2">
      {words.map((item, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg group hover:border-primary/50 transition-colors"
        >
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
            <span className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider w-32 shrink-0 truncate">
              {item.word}
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400 truncate">
              {item.clue}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onRemoveWord(index)}
            disabled={disabled}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0 disabled:opacity-50"
            aria-label="Remove word"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
