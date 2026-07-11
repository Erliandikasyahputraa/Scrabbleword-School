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

  const handleAdd = () => {
    setError('');
    const cleanWord = word.trim().toUpperCase();
    const cleanClue = clue.trim();

    if (!cleanWord) {
      setError('Word cannot be empty.');
      return;
    }
    
    if (cleanWord.length < 2) {
      setError('Word must be at least 2 characters long.');
      return;
    }

    if (!/^[A-Z]+$/.test(cleanWord)) {
      setError('Word can only contain alphabet characters without spaces.');
      return;
    }

    if (!cleanClue) {
      setError('Clue cannot be empty.');
      return;
    }

    onAddWord(cleanWord, cleanClue);
    setWord('');
    setClue('');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Add New Word</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value.toUpperCase())}
            placeholder="WORD (e.g. REACT)"
            disabled={disabled}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white text-sm uppercase"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          />
        </div>
        <div className="col-span-1 md:col-span-2 flex gap-2">
          <input
            type="text"
            value={clue}
            onChange={(e) => setClue(e.target.value)}
            placeholder="Clue (e.g. A popular UI library)"
            disabled={disabled}
            className="flex-1 h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white text-sm"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          />
          <Button type="button" onClick={handleAdd} disabled={disabled || !word || !clue} className="shrink-0 h-10 gap-1 px-4">
            <Plus size={16} /> Add
          </Button>
        </div>
      </div>
      
      {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
    </div>
  );
}
