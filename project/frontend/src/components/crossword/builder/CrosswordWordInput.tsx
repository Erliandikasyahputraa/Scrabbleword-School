import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/Button';

interface CrosswordWordInputProps {
  onAddWord: (word: string, clue: string) => void;
  disabled?: boolean;
}

export function CrosswordWordInput({ onAddWord, disabled }: CrosswordWordInputProps) {
  const [word, setWord] = useState('');
  const [clue, setClue] = useState('');
  const [error, setError] = useState('');

  // Automatically trim leading/trailing whitespace, collapse multiple spaces
  const rawWord = word.replace(/\s+/g, ' ');
  // Convert to uppercase and remove spaces for grid generation (the normalized value)
  const normalizedWord = word.replace(/\s+/g, '').toUpperCase();
  
  const rawClue = clue.replace(/\s+/g, ' ');

  const handleAdd = () => {
    setError('');

    if (!normalizedWord) {
      setError('Word cannot be empty.');
      return;
    }
    
    if (normalizedWord.length < 2) {
      setError('Word must be at least 2 characters long.');
      return;
    }

    if (normalizedWord.length > 50) {
      setError('Word cannot exceed 50 characters.');
      return;
    }

    if (!/^[A-Z]+$/.test(normalizedWord)) {
      setError('Word can only contain alphabet characters.');
      return;
    }

    if (!rawClue.trim()) {
      setError('Clue cannot be empty.');
      return;
    }

    if (rawClue.trim().length < 5) {
      setError('Clue must be at least 5 characters long.');
      return;
    }

    if (rawClue.trim().length > 300) {
      setError('Clue cannot exceed 300 characters.');
      return;
    }

    // Pass the raw formatted word for teacher editing
    onAddWord(rawWord.trim(), rawClue.trim());
    setWord('');
    setClue('');
  };

  const isSaveDisabled = disabled || !normalizedWord || normalizedWord.length < 2 || normalizedWord.length > 50 || rawClue.trim().length < 5 || rawClue.trim().length > 300;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Add New Word</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 space-y-1">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="WORD (e.g. Artificial Intelligence)"
            disabled={disabled}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white text-sm"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          />
          {word.length > 0 && (
            <div className="text-xs text-slate-500 font-medium px-1 flex justify-between">
              <span>Preview: <span className="text-primary font-bold tracking-widest">{normalizedWord}</span></span>
              <span className={normalizedWord.length > 40 ? 'text-orange-500 font-bold' : normalizedWord.length > 50 ? 'text-red-500 font-bold' : ''}>
                {normalizedWord.length}/50
              </span>
            </div>
          )}
        </div>
        
        <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-3">
          <div className="flex-1 space-y-1">
            <input
              type="text"
              value={clue}
              onChange={(e) => setClue(e.target.value)}
              placeholder="CLUE (e.g. Field of computer science)"
              disabled={disabled}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white text-sm"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
            />
            {clue.length > 0 && (
              <div className="text-xs text-slate-500 font-medium px-1 flex justify-end">
                <span className={clue.length > 250 ? 'text-orange-500 font-bold' : clue.length > 300 ? 'text-red-500 font-bold' : ''}>
                  {clue.length}/300
                </span>
              </div>
            )}
          </div>
          <div className="shrink-0" title={isSaveDisabled ? "Please check word and clue limits to save" : ""}>
            <Button 
              type="button" 
              onClick={handleAdd} 
              disabled={isSaveDisabled}
              className="w-full md:w-auto h-10 rounded-lg gap-2"
            >
              <Plus size={18} />
              Add Word
            </Button>
          </div>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
