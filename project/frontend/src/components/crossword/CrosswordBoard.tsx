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
      className={`w-full max-w-2xl mx-auto p-4 md:p-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/20 ${isSubmitted ? 'opacity-80 pointer-events-none' : ''}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Crossword Puzzle Board"
    >
      <div 
        className="w-full bg-black dark:bg-white/20 gap-[1px] border-2 border-black dark:border-white/20 p-[1px]" 
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${data.grid.cols}, minmax(0, 1fr))`
        }}
      >
        {Array.from({ length: data.grid.rows }).map((_, rowIndex) => (
          Array.from({ length: data.grid.cols }).map((_, colIndex) => (
            <CrosswordCell 
              key={`${rowIndex}-${colIndex}`} 
              row={rowIndex} 
              col={colIndex} 
            />
          ))
        ))}
      </div>
    </div>
  );
}
