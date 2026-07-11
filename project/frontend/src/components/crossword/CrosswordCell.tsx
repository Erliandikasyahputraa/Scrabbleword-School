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
    return <div className="w-full aspect-square bg-black dark:bg-black"></div>;
  }

  const number = getCellNumber(row, col);
  const isSelected = selectedCell?.row === row && selectedCell?.col === col;
  const inActiveWord = isCellInActiveWord(row, col);
  const answer = userAnswers[`${row}-${col}`] || '';

  return (
    <div 
      className={`relative w-full aspect-square flex items-center justify-center transition-colors cursor-pointer select-none
        ${isSelected ? 'bg-primary/20 text-primary font-bold shadow-[inset_0_0_0_2px_rgba(37,99,235,0.5)] z-10' : 
          inActiveWord ? 'bg-blue-50 dark:bg-blue-900/30' : 
          'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }
      `}
      onClick={() => handleCellClick(row, col)}
    >
      {number && (
        <span className="absolute top-0.5 left-1 text-[8px] sm:text-[10px] md:text-xs font-semibold text-slate-800 dark:text-slate-300 leading-none">
          {number}
        </span>
      )}
      <span className="text-sm sm:text-lg md:text-xl lg:text-2xl uppercase font-bold text-slate-900 dark:text-slate-50">
        {answer}
      </span>
    </div>
  );
}
