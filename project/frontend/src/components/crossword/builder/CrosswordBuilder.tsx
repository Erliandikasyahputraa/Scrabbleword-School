import { useState, useEffect } from 'react';
import { type CrosswordInputWord, generateCrosswordData } from '../../../lib/crosswordGenerator';
import { CrosswordWordInput } from './CrosswordWordInput';
import { CrosswordWordList } from './CrosswordWordList';
import { CrosswordPreview } from './CrosswordPreview';
import { Button } from '../../ui/Button';
import { RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { CrosswordData } from '../../../types/crossword';

interface CrosswordBuilderProps {
  initialData?: CrosswordData | null;
  onChange: (data: CrosswordData | null) => void;
}

export function CrosswordBuilder({ initialData, onChange }: CrosswordBuilderProps) {
  const [words, setWords] = useState<CrosswordInputWord[]>([]);
  const [generatedData, setGeneratedData] = useState<CrosswordData | null>(null);
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load existing words if editing
  useEffect(() => {
    if (initialData && initialData.words && initialData.clues) {
      const loadedWords = initialData.words.map(w => {
        const clue = initialData.clues.find(c => c.id === w.id);
        return {
          word: w.word,
          clue: clue ? clue.clue : ''
        };
      });
      setWords(loadedWords);
      setGeneratedData(initialData);
    }
  }, [initialData]);

  const handleAddWord = (word: string, clue: string) => {
    if (words.some(w => w.word === word)) {
      setError(`The word "${word}" has already been added.`);
      return;
    }
    setError('');
    setWords([...words, { word, clue }]);
    setGeneratedData(null); // invalidate current layout
    onChange(null);
  };

  const handleRemoveWord = (index: number) => {
    const newWords = [...words];
    newWords.splice(index, 1);
    setWords(newWords);
    setGeneratedData(null);
    onChange(null);
    setError('');
  };

  const handleGenerate = () => {
    if (words.length < 2) {
      setError('Please add at least 2 words to generate a puzzle.');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    // Reset previous layout state immediately to avoid stale grid reuse
    setGeneratedData(null);
    onChange(null);
    
    // Simulate slight delay for better UX feeling of "generation"
    setTimeout(() => {
      try {
        const data = generateCrosswordData(words);
        setGeneratedData(data);
        onChange(data);
      } catch (err: any) {
        setError(err.message || 'Failed to generate layout. Try adding more crossing letters.');
        setGeneratedData(null);
        onChange(null);
      } finally {
        setIsGenerating(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Interactive Puzzle Builder</h2>
        <p className="text-sm text-slate-500 mt-1">Add words and clues, then generate the layout automatically.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Words Management */}
        <div className="space-y-4">
          <CrosswordWordInput onAddWord={handleAddWord} disabled={isGenerating} />
          <CrosswordWordList words={words} onRemoveWord={handleRemoveWord} disabled={isGenerating} />
          
          <Button 
            type="button" 
            onClick={handleGenerate} 
            fullWidth 
            disabled={words.length < 2 || isGenerating}
            className="h-12 mt-4 shadow-md bg-slate-900 hover:bg-slate-800 dark:bg-primary dark:hover:bg-primary/90 text-white"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2"><RefreshCw size={18} className="animate-spin" /> Generating...</span>
            ) : (
              <span className="flex items-center gap-2"><RefreshCw size={18} /> {generatedData ? 'Regenerate Layout' : 'Generate Crossword'}</span>
            )}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
               <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
               <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">{error}</p>
            </div>
          )}
        </div>

        {/* Right Col: Preview */}
        <div>
          {generatedData ? (
            <div className="animate-in fade-in zoom-in-95 duration-300">
               <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                  <CheckCircle2 size={18} />
                  <span className="font-semibold text-sm">Layout Generated Successfully</span>
               </div>
               <CrosswordPreview data={generatedData} />
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-900/30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
               <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <RefreshCw size={24} className="text-slate-400" />
               </div>
               <h3 className="text-slate-900 dark:text-white font-medium mb-2">No Preview Available</h3>
               <p className="text-sm text-slate-500 max-w-[250px]">
                  Add your words and click Generate to see the crossword layout here.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
