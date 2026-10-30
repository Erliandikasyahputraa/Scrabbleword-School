import { useRef, useEffect } from 'react';
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
    getCellNumber,
    isSubmitted,
    setUserAnswers,
    advanceCursorInWord,
    handleKeyDown
  } = useCrossword() as any;

  const inputRef = useRef<HTMLInputElement>(null);
  const isPlayable = isCellPlayable(row, col);

  const number = isPlayable ? getCellNumber(row, col) : null;
  const isSelected = selectedCell?.row === row && selectedCell?.col === col;
  const inActiveWord = isPlayable && isCellInActiveWord(row, col);
  const answer = userAnswers[`${row}-${col}`] || '';
  const isFilled = answer.length > 0;

  // Auto-focus the input whenever this cell becomes selected
  useEffect(() => {
    if (isSelected && !isSubmitted && inputRef.current) {
      inputRef.current.focus();
      // Select text so typing immediately replaces it
      inputRef.current.select();
    }
  }, [isSelected, isSubmitted]);

  if (!isPlayable) {
    return <div className="w-full aspect-square bg-transparent"></div>;
  }

  // Visual state styling
  let cellStyle = "bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100";
  
  if (isSelected) {
    cellStyle = "bg-white dark:bg-slate-900 border-[var(--workspace-primary)] ring-2 ring-[var(--workspace-primary)] shadow-sm z-20 text-slate-900 dark:text-slate-100";
  } else if (inActiveWord) {
    cellStyle = "bg-white dark:bg-slate-900 border-[var(--workspace-accent)] shadow-[0_0_8px_var(--workspace-shadow)] z-10 text-slate-900 dark:text-slate-100";
  } else if (isFilled) {
    cellStyle = "bg-white dark:bg-slate-900 border-slate-400 dark:border-slate-500 font-bold text-slate-900 dark:text-slate-100";
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isSubmitted) return;

    if (val.length > 0) {
      const char = val.slice(-1);
      if (/^[a-zA-Z]$/.test(char)) {
        const cellKey = `${row}-${col}`;
        setUserAnswers((prev: Record<string, string>) => ({
          ...prev,
          [cellKey]: char.toUpperCase()
        }));
        advanceCursorInWord(true);
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isSubmitted) return;

    if (e.key === 'Backspace') {
      const cellKey = `${row}-${col}`;
      if (userAnswers[cellKey]) {
        e.preventDefault();
        setUserAnswers((prev: Record<string, string>) => {
          const next = { ...prev };
          delete next[cellKey];
          return next;
        });
      } else {
        e.preventDefault();
        advanceCursorInWord(false);
      }
    } else {
      handleKeyDown(e as any);
    }
  };

  return (
    <div 
      className={`relative w-full aspect-square flex items-center justify-center cursor-pointer select-none transition-all duration-150 ${cellStyle}`}
      onClick={() => {
        handleCellClick(row, col);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }}
      aria-label={`Cell row ${row + 1}, column ${col + 1}`}
    >
      {number && (
        <span 
          className="absolute top-[2%] left-[4%] text-slate-600 dark:text-slate-400 leading-none font-semibold select-none pointer-events-none z-10"
          style={{ fontSize: 'clamp(8px, 2cqw, 11px)' }}
        >
          {number}
        </span>
      )}

      {/* Real HTML input element inside cell - Guarantees mobile keyboard popup */}
      <input
        ref={inputRef}
        type="text"
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        maxLength={1}
        value={answer}
        disabled={isSubmitted}
        onChange={handleChange}
        onKeyDown={handleInputKeyDown}
        onFocus={() => {
          if (!isSelected) {
            handleCellClick(row, col);
          }
        }}
        className="w-full h-full text-center uppercase font-bold bg-transparent outline-none cursor-pointer focus:cursor-text caret-transparent selection:bg-transparent"
        style={{ fontSize: 'clamp(12px, 4cqw, 24px)' }}
        aria-label={`Input for row ${row + 1}, column ${col + 1}`}
      />
    </div>
  );
}
