import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { CrosswordData, CrosswordDirection, CrosswordWord } from '../../types/crossword';

export type Position = { row: number; col: number };

type CrosswordContextType = {
  data: CrosswordData;
  userAnswers: Record<string, string>;
  selectedCell: Position | null;
  currentDirection: CrosswordDirection;
  hintsRemaining: number;
  isSubmitted: boolean;
  timeSpent: number; // seconds elapsed since puzzle started

  // Actions
  handleCellClick: (row: number, col: number) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  useHint: () => void;
  setSubmitted: () => void;

  // Derived state/helpers
  isCellPlayable: (row: number, col: number) => boolean;
  isCellInActiveWord: (row: number, col: number) => boolean;
  getCellNumber: (row: number, col: number) => number | null;
  activeWord: CrosswordWord | null;
};

export const CrosswordContext = createContext<CrosswordContextType | null>(null);

export function CrosswordProvider({ children, data, initialSubmitted = false }: { children: ReactNode, data: CrosswordData, initialSubmitted?: boolean }) {
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [currentDirection, setCurrentDirection] = useState<CrosswordDirection>('across');
  const [hintsRemaining, setHintsRemaining] = useState(data.metadata.max_hints);
  const [isSubmitted, setIsSubmitted] = useState(initialSubmitted);
  const [timeSpent, setTimeSpent] = useState(0);

  // Timer — runs until puzzle is submitted
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => setTimeSpent(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  // Helper: Find all words that intersect a given cell
  const getWordsAt = useCallback((row: number, col: number) => {
    return data.words.filter(w => {
      if (w.direction === 'across') {
        return w.row === row && col >= w.col && col < w.col + w.length;
      } else {
        return w.col === col && row >= w.row && row < w.row + w.length;
      }
    });
  }, [data.words]);

  const isCellPlayable = useCallback((row: number, col: number) => {
    return getWordsAt(row, col).length > 0;
  }, [getWordsAt]);

  const getCellNumber = useCallback((row: number, col: number) => {
    const wordStartsHere = data.clues.find(c => {
      const w = data.words.find(w => w.id === c.id);
      return w?.row === row && w?.col === col;
    });
    return wordStartsHere ? wordStartsHere.number : null;
  }, [data.words, data.clues]);

  // Derived: Current active word
  const activeWord = (() => {
    if (!selectedCell) return null;
    const words = getWordsAt(selectedCell.row, selectedCell.col);
    if (words.length === 0) return null;
    return words.find(w => w.direction === currentDirection) || words[0];
  })();

  const isCellInActiveWord = useCallback((row: number, col: number) => {
    if (!activeWord) return false;
    if (activeWord.direction === 'across') {
      return activeWord.row === row && col >= activeWord.col && col < activeWord.col + activeWord.length;
    } else {
      return activeWord.col === col && row >= activeWord.row && row < activeWord.row + activeWord.length;
    }
  }, [activeWord]);

  // Click Handler
  const handleCellClick = (row: number, col: number) => {
    if (isSubmitted) return;
    if (!isCellPlayable(row, col)) return;

    if (selectedCell?.row === row && selectedCell?.col === col) {
      setCurrentDirection(prev => prev === 'across' ? 'down' : 'across');
    } else {
      setSelectedCell({ row, col });
      
      // Auto-set direction if cell only belongs to one word
      const wordsAtCell = getWordsAt(row, col);
      if (wordsAtCell.length === 1) {
        setCurrentDirection(wordsAtCell[0].direction);
      }
    }
  };

  // Focus management helpers
  const moveCursor = (dRow: number, dCol: number) => {
    if (!selectedCell) return;
    const newRow = selectedCell.row + dRow;
    const newCol = selectedCell.col + dCol;
    
    if (newRow >= 0 && newRow < data.grid.rows && newCol >= 0 && newCol < data.grid.cols) {
      if (isCellPlayable(newRow, newCol)) {
        setSelectedCell({ row: newRow, col: newCol });
      }
    }
  };

  const advanceCursorInWord = (forward: boolean) => {
    if (!selectedCell || !activeWord) return;
    const isAcross = currentDirection === 'across';
    const dRow = isAcross ? 0 : (forward ? 1 : -1);
    const dCol = isAcross ? (forward ? 1 : -1) : 0;
    
    const newRow = selectedCell.row + dRow;
    const newCol = selectedCell.col + dCol;

    if (isCellInActiveWord(newRow, newCol)) {
      setSelectedCell({ row: newRow, col: newCol });
    }
  };

  const jumpToNextClue = (forward: boolean) => {
    if (!activeWord) return;
    const activeIndex = data.clues.findIndex(c => c.id === activeWord.id);
    if (activeIndex === -1) return;
    
    const newIndex = (activeIndex + (forward ? 1 : -1) + data.clues.length) % data.clues.length;
    const newClue = data.clues[newIndex];
    const newWord = data.words.find(w => w.id === newClue.id);
    
    if (newWord) {
      setSelectedCell({ row: newWord.row, col: newWord.col });
      setCurrentDirection(newWord.direction);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isSubmitted || !selectedCell) return;

    const key = e.key;

    if (key === 'ArrowUp') {
      e.preventDefault();
      moveCursor(-1, 0);
    } else if (key === 'ArrowDown') {
      e.preventDefault();
      moveCursor(1, 0);
    } else if (key === 'ArrowLeft') {
      e.preventDefault();
      moveCursor(0, -1);
    } else if (key === 'ArrowRight') {
      e.preventDefault();
      moveCursor(0, 1);
    } else if (key === 'Tab') {
      e.preventDefault();
      jumpToNextClue(!e.shiftKey);
    } else if (key === 'Backspace') {
      e.preventDefault();
      const cellKey = `${selectedCell.row}-${selectedCell.col}`;
      if (userAnswers[cellKey]) {
        // Clear current if filled
        setUserAnswers(prev => {
          const next = { ...prev };
          delete next[cellKey];
          return next;
        });
      } else {
        // Move back and clear
        advanceCursorInWord(false);
      }
    } else if (key === 'Delete') {
      e.preventDefault();
      const cellKey = `${selectedCell.row}-${selectedCell.col}`;
      setUserAnswers(prev => {
        const next = { ...prev };
        delete next[cellKey];
        return next;
      });
    } else if (/^[a-zA-Z]$/.test(key)) {
      e.preventDefault();
      const cellKey = `${selectedCell.row}-${selectedCell.col}`;
      setUserAnswers(prev => ({ ...prev, [cellKey]: key.toUpperCase() }));
      advanceCursorInWord(true);
    }
  };

  const useHint = () => {
    if (hintsRemaining <= 0 || !activeWord || isSubmitted) return;

    // Reveal one random unrevealed letter in activeWord
    const unrevealed = [];
    for (let i = 0; i < activeWord.length; i++) {
      const r = activeWord.row + (activeWord.direction === 'down' ? i : 0);
      const c = activeWord.col + (activeWord.direction === 'across' ? i : 0);
      const cellKey = `${r}-${c}`;
      if (userAnswers[cellKey] !== activeWord.word[i].toUpperCase()) {
        unrevealed.push({ key: cellKey, letter: activeWord.word[i].toUpperCase() });
      }
    }

    if (unrevealed.length > 0) {
      const randomCell = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      setUserAnswers(prev => ({ ...prev, [randomCell.key]: randomCell.letter }));
      setHintsRemaining(prev => prev - 1);
    }
  };

  const setSubmitted = () => setIsSubmitted(true);

  // Initialize selected cell to first available word if not set
  useEffect(() => {
    if (!selectedCell && data.words.length > 0) {
      const w = data.words[0];
      setSelectedCell({ row: w.row, col: w.col });
      setCurrentDirection(w.direction);
    }
  }, [data.words, selectedCell]);

  return (
    <CrosswordContext.Provider
      value={{
        data,
        userAnswers,
        selectedCell,
        currentDirection,
        hintsRemaining,
        isSubmitted,
        timeSpent,
        handleCellClick,
        handleKeyDown,
        useHint,
        setSubmitted,
        isCellPlayable,
        isCellInActiveWord,
        getCellNumber,
        activeWord,
      }}
    >
      {children}
    </CrosswordContext.Provider>
  );
}
