import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../../lib/api';
import { CrosswordBuilder } from '../crossword/builder/CrosswordBuilder';

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


export function MaterialFormModal({ isOpen, onClose, courseId, initialData }: MaterialFormModalProps) {
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [crosswordJson, setCrosswordJson] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setCrosswordJson(initialData.crossword_data ? JSON.stringify(initialData.crossword_data, null, 2) : '');
        setPdfFile(null); // Can't easily set file input value
      } else {
        setTitle('');
        setPdfFile(null);
        setCrosswordJson('');
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
            <div className="flex items-center justify-between mb-2">
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Interactive Puzzle (Optional)</label>
            </div>
            
            <CrosswordBuilder 
               initialData={crosswordJson ? JSON.parse(crosswordJson) : null}
               onChange={(data) => {
                 if (data) {
                    setCrosswordJson(JSON.stringify(data));
                 } else {
                    setCrosswordJson('');
                 }
               }} 
            />
          </div>
          <Button type="submit" fullWidth disabled={mutation.isPending} className="h-12 mt-4">
            {mutation.isPending ? 'Saving...' : 'Save Material & Crossword'}
          </Button>
        </form>
      </div>
    </div>
  );
}
