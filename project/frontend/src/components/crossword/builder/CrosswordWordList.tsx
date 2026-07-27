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
    <div className="space-y-3 pr-2">
      {words.map((item, index) => {
        // Normalize the current word
        const normalizedWord = item.word.replace(/\s+/g, '').toUpperCase();
        
        // Get all other normalized words
        const otherWords = words
          .filter((_, i) => i !== index)
          .map(w => w.word.replace(/\s+/g, '').toUpperCase());
          
        // Set of all letters available in other words
        const otherLetters = new Set(otherWords.join(''));
        
        // Count how many letters in this word can potentially intersect
        let intersections = 0;
        for (const char of normalizedWord) {
          if (otherLetters.has(char)) {
            intersections++;
          }
        }
        
        const hasNoIntersections = words.length > 1 && intersections === 0;

        return (
          <div 
            key={index} 
            className={`flex items-start justify-between p-3 bg-white dark:bg-slate-900 border ${hasNoIntersections ? 'border-orange-300 dark:border-orange-800/50' : 'border-slate-200 dark:border-slate-800'} rounded-xl group hover:border-primary/50 transition-colors gap-3`}
          >
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider truncate">
                  {item.word}
                </span>
                {words.length > 1 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 ${hasNoIntersections ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                    {hasNoIntersections ? (
                      <>⚠️ 0 intersections</>
                    ) : (
                      <>✓ {intersections} intersections</>
                    )}
                  </span>
                )}
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400 truncate">
                {item.clue}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onRemoveWord(index)}
              disabled={disabled}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0 disabled:opacity-50 mt-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              aria-label="Remove word"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
