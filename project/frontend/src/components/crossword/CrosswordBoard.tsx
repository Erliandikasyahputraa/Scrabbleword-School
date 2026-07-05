import { useEffect, useRef } from 'react';
import { useCrossword } from '../../hooks/useCrossword';
import { CrosswordCell } from './CrosswordCell';

export function CrosswordBoard() {
  const { data, handleKeyDown, isSubmitted } = useCrossword();
  const boardRef = useRef<HTMLDivElement>(null);

  // Auto-focus the board when it mounts so keyboard nav works immediately
  useEffect(() => {
    if (boardRef.current && !isSubmitted) {
      boardRef.current.focus();
    }
  }, [isSubmitted]);

  return (
    <div 
      ref={boardRef}
      className={`relative inline-flex flex-col gap-1 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/20 ${isSubmitted ? 'opacity-80 pointer-events-none' : ''}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Crossword Puzzle Board"
    >
      {Array.from({ length: data.grid.rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {Array.from({ length: data.grid.cols }).map((_, colIndex) => (
            <CrosswordCell 
              key={`${rowIndex}-${colIndex}`} 
              row={rowIndex} 
              col={colIndex} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}
