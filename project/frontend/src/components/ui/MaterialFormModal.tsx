import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../../lib/api';
import { CrosswordBuilder } from '../crossword/builder/CrosswordBuilder';
import { toast } from 'react-hot-toast';

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setCrosswordJson(initialData.crossword_data ? JSON.stringify(initialData.crossword_data, null, 2) : '');
        setPdfFile(null);
      } else {
        setTitle('');
        setPdfFile(null);
        setCrosswordJson('');
      }
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    if (!initialData && !pdfFile) {
        toast.error("PDF File is required for new material.");
        return;
    }

    if (pdfFile && pdfFile.size > 10 * 1024 * 1024) {
        toast.error("Maximum PDF size is 10 MB.");
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

    const isEdit = !!initialData;
    const url = isEdit 
      ? `${API_URL}/courses/${courseId}/materials/${initialData.id}` 
      : `${API_URL}/courses/${courseId}/materials`;
    
    if (isEdit) {
      formData.append('_method', 'PUT');
    }

    setIsUploading(true);
    setUploadProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Accept', 'application/json');
    const token = localStorage.getItem('auth_token');
    if (token) {
       xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        toast.success(isEdit ? 'Material updated successfully' : 'Material added successfully');
        queryClient.invalidateQueries({ queryKey: ['course', String(courseId)] });
        onClose();
      } else {
        let msg = 'Failed to save material.';
        try {
          const errorData = JSON.parse(xhr.responseText);
          msg = errorData.message || msg;
          if (errorData.errors) {
            const details = Object.values(errorData.errors).flat().join('\n');
            msg += '\n\n' + details;
          }
        } catch (e) {}
        toast.error(`Error: ${msg}`);
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      toast.error('Network error during upload');
    };

    xhr.send(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          disabled={isUploading}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white disabled:opacity-50"
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
              disabled={isUploading}
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white disabled:opacity-50"
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
              disabled={isUploading}
              required={!initialData}
              onChange={e => setPdfFile(e.target.files?.[0] || null)}
              className="w-full h-12 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white disabled:opacity-50"
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
          
          {isUploading && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                   <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                   Uploading PDF...
                </span>
                <span className="text-sm font-bold text-primary">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <Button type="submit" fullWidth disabled={isUploading} className="h-12 mt-4">
            {isUploading ? 'Uploading...' : 'Save Material & Crossword'}
          </Button>
        </form>
      </div>
    </div>
  );
}
