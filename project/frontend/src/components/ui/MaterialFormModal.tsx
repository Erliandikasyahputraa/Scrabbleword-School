import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../../lib/api';
import { CrosswordBuilder } from '../crossword/builder/CrosswordBuilder';
import { CustomUploadField } from './CustomUploadField';
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full h-full rounded-none sm:w-[95vw] sm:h-[95vh] lg:w-[90vw] sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden flex flex-col">
        <button 
          onClick={onClose}
          disabled={isUploading}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 pr-8 shrink-0">
          {initialData ? 'Edit Material' : 'Add New Material'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 space-y-4 overflow-y-auto lg:overflow-hidden p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Material Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                disabled={isUploading}
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground disabled:opacity-50"
                placeholder="e.g. Chapter 1: Basic Vocabulary"
              />
            </div>
            <div>
              <CustomUploadField
                file={pdfFile}
                onChange={setPdfFile}
                disabled={isUploading}
                required={!initialData}
                label={initialData ? "PDF Document (Leave empty to keep current)" : "PDF Document"}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mb-2 mt-4 shrink-0">
            <label className="block text-sm font-medium text-foreground">Interactive Puzzle Workspace</label>
          </div>
          
          <div className="flex-1 min-h-[700px] lg:min-h-0 rounded-2xl flex flex-col">
            <CrosswordBuilder 
               initialData={crosswordJson ? JSON.parse(crosswordJson) : null}
               onChange={(data) => {
                 if (data) {
                    setCrosswordJson(JSON.stringify(data));
                 } else {
                    setCrosswordJson('');
                 }
               }}
               sidebarFooter={
                 <div className="space-y-3">
                   {isUploading && (
                     <div className="p-3 bg-muted rounded-xl border border-border">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-medium text-foreground flex items-center gap-2">
                            <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
                            Uploading...
                         </span>
                         <span className="text-xs font-bold text-primary">{uploadProgress}%</span>
                       </div>
                       <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-primary h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                       </div>
                     </div>
                   )}
                   <Button type="submit" fullWidth disabled={isUploading} className="h-11 shadow-sm font-semibold">
                     {isUploading ? 'Saving...' : 'Save Material'}
                   </Button>
                 </div>
               }
            />
          </div>
        </form>
      </div>
    </div>
  );
}
