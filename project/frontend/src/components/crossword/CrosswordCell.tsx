import { useCrossword } from '../../hooks/useCrossword';

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

  const isPlayable = isCellPlayable(row, col);
  
  if (!isPlayable) {
    return <div className="w-full aspect-square bg-transparent"></div>;
  }

  const number = getCellNumber(row, col);
  const isSelected = selectedCell?.row === row && selectedCell?.col === col;
  const inActiveWord = isCellInActiveWord(row, col);
  const answer = userAnswers[`${row}-${col}`] || '';
  const isFilled = answer.length > 0;

  // Determine cell classes based on strict visual states
  let cellStyle = "bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100";
  
  if (isSelected) {
    // Selected Cell (Cursor Focus): Theme primary focus ring
    cellStyle = "bg-white dark:bg-slate-900 border-[var(--workspace-primary)] ring-2 ring-[var(--workspace-primary)] shadow-sm z-20 text-slate-900 dark:text-slate-100";
  } else if (inActiveWord) {
    // Active Cell (in Active Word): Theme accent outline, glow, slight elevation. DO NOT DARKEN.
    cellStyle = "bg-white dark:bg-slate-900 border-[var(--workspace-accent)] shadow-[0_0_8px_var(--workspace-shadow)] z-10 text-slate-900 dark:text-slate-100";
  } else if (isFilled) {
    // Filled Cell
    cellStyle = "bg-white dark:bg-slate-900 border-slate-400 dark:border-slate-500 font-bold text-slate-900 dark:text-slate-100";
  }

  return (
    <div 
      className={`relative w-full aspect-square flex items-center justify-center cursor-pointer select-none transition-all duration-150 ${cellStyle}`}
      onClick={() => handleCellClick(row, col)}
      tabIndex={isSelected ? 0 : -1} 
      aria-label={`Cell row ${row + 1}, column ${col + 1}`}
    >
      {number && (
        <span 
          className="absolute top-[2%] left-[4%] text-slate-600 dark:text-slate-400 leading-none font-semibold select-none"
          style={{ fontSize: 'clamp(9px, 2.5cqw, 12px)' }}
        >
          {number}
        </span>
      )}
      <span 
        className={`uppercase select-none ${isFilled ? 'font-bold' : 'font-normal'}`}
        style={{ fontSize: 'clamp(14px, 5cqw, 28px)' }}
      >
        {answer}
      </span>
    </div>
  );
}
