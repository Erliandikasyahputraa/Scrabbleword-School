import { useEffect, useRef } from 'react';
import { useCrossword } from '../../hooks/useCrossword';
import { CrosswordCell } from './CrosswordCell';
import { useCrosswordTheme } from '../../providers/CrosswordThemeProvider';

export function CrosswordBoard() {
  const { data, handleKeyDown, isSubmitted } = useCrossword();
  const { activeTheme } = useCrosswordTheme();
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
      className={`relative flex justify-center items-center w-full max-w-full max-h-full mx-auto focus:outline-none focus:ring-4 focus:ring-primary/20 ${isSubmitted ? 'opacity-80 pointer-events-none' : ''}`}
      style={{ aspectRatio: `${data.grid.cols} / ${data.grid.rows}` }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Crossword Puzzle Board"
    >
      <div 
        className={`w-full h-full flex justify-center items-center transition-colors duration-300 ${activeTheme.background} rounded-lg`}
      >
        <div 
          className={`w-full h-full ${activeTheme.board}`} 
          style={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${data.grid.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${data.grid.rows}, minmax(0, 1fr))`
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
    </div>
  );
}
