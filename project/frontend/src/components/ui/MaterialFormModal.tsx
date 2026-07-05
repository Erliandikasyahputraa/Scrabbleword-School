import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../../lib/api';
import { CrosswordProvider } from '../crossword/CrosswordProvider';
import { CrosswordBoard } from '../crossword/CrosswordBoard';

type MaterialFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  courseId: string | number;
  initialData?: {
    id: number;
    title: string;
    crossword_data?: any;
  } | null;
};

function validateCrosswordJson(jsonStr: string): string | null {
  if (!jsonStr.trim()) return null;
  
  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e: any) {
    return e.message || "Invalid JSON syntax.";
  }

  if (!parsed.grid || typeof parsed.grid.rows !== 'number' || typeof parsed.grid.cols !== 'number') {
    return "Missing or invalid 'grid' configuration. Needs 'rows' and 'cols'.";
  }

  if (!Array.isArray(parsed.words)) {
    return "Missing or invalid 'words' array.";
  }

  const rows = parsed.grid.rows;
  const cols = parsed.grid.cols;

  for (let i = 0; i < parsed.words.length; i++) {
    const w = parsed.words[i];
    if (typeof w.row !== 'number' || typeof w.col !== 'number') {
      return `Word at index ${i} is missing 'row' or 'col'.`;
    }
    if (w.direction !== 'across' && w.direction !== 'down') {
      return `Word at index ${i} has invalid direction. Must be 'across' or 'down'.`;
    }
    
    // length can be implicit from 'word' property or explicit
    const length = w.length || (w.word ? w.word.length : 0);
    if (!length) {
       return `Word at index ${i} is missing 'word' or 'length'.`;
    }

    if (w.row < 0 || w.col < 0 || w.row >= rows || w.col >= cols) {
       return `Word '${w.word || w.id}' starts outside the grid boundaries.`;
    }

    if (w.direction === 'across' && w.col + length > cols) {
       return `Word '${w.word || w.id}' (across) exceeds grid width. Grid cols: ${cols}, Word ends at: ${w.col + length}.`;
    }
    
    if (w.direction === 'down' && w.row + length > rows) {
       return `Word '${w.word || w.id}' (down) exceeds grid height. Grid rows: ${rows}, Word ends at: ${w.row + length}.`;
    }
  }

  return null;
}

export function MaterialFormModal({ isOpen, onClose, courseId, initialData }: MaterialFormModalProps) {
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [crosswordJson, setCrosswordJson] = useState('');
  const [jsonError, setJsonError] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setCrosswordJson(initialData.crossword_data ? JSON.stringify(initialData.crossword_data, null, 2) : '');
        setPdfFile(null); // Can't easily set file input value
        setJsonError('');
      } else {
        setTitle('');
        setPdfFile(null);
        setCrosswordJson('');
        setJsonError('');
      }
    }
  }, [isOpen, initialData]);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const isEdit = !!initialData;
      const url = isEdit 
        ? `/courses/${courseId}/materials/${initialData.id}` 
        : `/courses/${courseId}/materials`;
      
      // For Laravel PUT with FormData, we need to use POST and add _method=PUT
      if (isEdit) {
        formData.append('_method', 'PUT');
      }

      return fetchApi(url, {
        method: 'POST',
        body: formData,
        // Let fetch automatically set multipart/form-data boundary
        headers: new Headers({
            'Accept': 'application/json'
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', String(courseId)] });
      onClose();
    },
    onError: (error: any) => {
      let msg = error.message;
      if (error.errors) {
         const details = Object.values(error.errors).flat().join('\n');
         msg += '\n\n' + details;
      }
      alert(`Error: ${msg}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    if (!initialData && !pdfFile) {
        alert("PDF File is required for new material.");
        return;
    }
    
    if (crosswordJson.trim()) {
        const error = validateCrosswordJson(crosswordJson);
        if (error) {
            setJsonError(error);
            return;
        }
    }

    const formData = new FormData();
    formData.append('title', title);
    if (pdfFile) {
      formData.append('pdf', pdfFile);
    }
    if (crosswordJson.trim()) {
      formData.append('crossword_data', crosswordJson);
    }

    mutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {initialData ? 'Edit Material' : 'Add New Material'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white"
              placeholder="e.g. Chapter 1: Introduction"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              PDF Document {initialData && '(Leave empty to keep current)'}
            </label>
            <input
              type="file"
              accept="application/pdf"
              required={!initialData}
              onChange={e => setPdfFile(e.target.files?.[0] || null)}
              className="w-full h-12 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Crossword Data (JSON) [Optional]</label>
            <textarea
              value={crosswordJson}
              onChange={e => {
                const val = e.target.value;
                setCrosswordJson(val);
                setJsonError(validateCrosswordJson(val) || '');
              }}
              className={`w-full p-4 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 font-mono text-sm resize-y ${
                jsonError 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900 dark:text-red-100' 
                  : 'border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary/20 text-slate-900 dark:text-white'
              }`}
              rows={8}
              placeholder='{"words": [{"id": "1", "word": "HELLO", "clue": "Greeting", "row": 0, "col": 0, "direction": "across"}]}'
            />
            {jsonError && <p className="text-red-500 text-sm mt-1">{jsonError}</p>}
            
            {!jsonError && crosswordJson.trim() && (
              <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                <span className="font-semibold text-sm text-slate-700 dark:text-slate-300 block mb-2">Preview: Valid JSON.</span>
                <div className="w-full overflow-hidden border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 pointer-events-none transform scale-75 origin-top-left" style={{ height: '300px', width: '133%' }}>
                   {(() => {
                       try {
                           const parsed = JSON.parse(crosswordJson);
                           return (
                               <div className="p-4 flex justify-center">
                                  <CrosswordProvider data={parsed}>
                                      <CrosswordBoard />
                                  </CrosswordProvider>
                               </div>
                           );
                       } catch(e) {
                           return null;
                       }
                   })()}
                </div>
              </div>
            )}
          </div>
          <Button type="submit" fullWidth disabled={mutation.isPending} className="h-12 mt-4">
            {mutation.isPending ? 'Saving...' : 'Save Material'}
          </Button>
        </form>
      </div>
    </div>
  );
}
