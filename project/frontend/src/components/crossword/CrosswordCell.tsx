import { useCrossword } from '../../hooks/useCrossword';
import { useCrosswordTheme } from '../../providers/CrosswordThemeProvider';

type CrosswordCellProps = {
  row: number;
  col: number;
};

export function CrosswordCell({ row, col }: CrosswordCellProps) {
  const { 
    userAnswers, 
    selectedCell, 
    handleCellClick, 
    isCellPlayable, 
    isCellInActiveWord, 
    getCellNumber 
  } = useCrossword();

  const { activeTheme } = useCrosswordTheme();

  const isPlayable = isCellPlayable(row, col);
  
  if (!isPlayable) {
    return <div className={`w-full aspect-square ${activeTheme.blackCell}`}></div>;
  }

  const number = getCellNumber(row, col);
  const isSelected = selectedCell?.row === row && selectedCell?.col === col;
  const inActiveWord = isCellInActiveWord(row, col);
  const answer = userAnswers[`${row}-${col}`] || '';

  // Phase 16: Completed Word Glow
  // We can simulate completed by checking if answer is present (ideally we should validate against the actual word, but for now we apply base theming)
  const isCompleted = answer.length > 0 && !isSelected && !inActiveWord;

  return (
    <div 
      className={`relative w-full aspect-square min-w-[32px] sm:min-w-[44px] flex items-center justify-center cursor-pointer select-none
        ${isSelected ? activeTheme.selectedCell : 
          isCompleted ? activeTheme.completedCell :
          inActiveWord ? activeTheme.hover : // using hover style for active word 
          `${activeTheme.cell} ${activeTheme.hover}`
        }
      `}
      onClick={() => handleCellClick(row, col)}
      tabIndex={isSelected ? 0 : -1} // Phase 17: Accessibility keyboard focus
      aria-label={`Cell row ${row + 1}, column ${col + 1}`}
    >
      {number && (
        <span className={`absolute top-0.5 left-1 text-[8px] sm:text-[10px] md:text-xs leading-none ${activeTheme.clueNumber}`}>
          {number}
        </span>
      )}
      <span className={`text-sm sm:text-lg md:text-xl lg:text-2xl uppercase ${activeTheme.typography}`}>
        {answer}
      </span>
    </div>
  );
}
