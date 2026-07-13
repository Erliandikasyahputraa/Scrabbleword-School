import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../../lib/api';
import { CrosswordBuilder } from '../crossword/builder/CrosswordBuilder';
import { CustomUploadField } from './CustomUploadField';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('courses');
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
        toast.error(t('pdfRequired'));
        return;
    }

    if (pdfFile && pdfFile.size > 10 * 1024 * 1024) {
        toast.error(t('pdfMaxSize'));
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
        toast.success(isEdit ? t('materialUpdated') : t('materialAdded'));
        queryClient.invalidateQueries({ queryKey: ['course', String(courseId)] });
        onClose();
      } else {
        let msg = t('failedToSaveMaterial');
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
      toast.error(t('networkError'));
    };

    xhr.send(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-[90vw] h-[95vh] rounded-2xl shadow-2xl relative flex flex-col pointer-events-auto border border-border overflow-hidden">
        <button 
          onClick={onClose}
          disabled={isUploading}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-muted-foreground hover:bg-muted p-1.5 rounded-full hover:text-foreground disabled:opacity-50 transition-colors z-20"
        >
            <X size={24} />
          </button>
          
          <div className="flex-none border-b border-border p-5 sm:p-6 pb-4 bg-card z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground pr-8">
            {initialData ? t('editMaterial') : t('addNewMaterial')}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar p-5 sm:p-6 bg-muted/5 relative">
          <div className="w-full flex-1 min-h-0 flex flex-col">
              <CrosswordBuilder 
                 initialData={crosswordJson ? JSON.parse(crosswordJson) : null}
                 mainHeader={
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card border border-border p-5 sm:p-6 rounded-2xl shadow-sm mb-6 w-full">
                     <div className="space-y-2">
                       <label className="block text-sm font-medium text-foreground">{t('materialTitle')} <span className="text-red-500">*</span></label>
                       <input
                         type="text"
                         required
                         disabled={isUploading}
                         value={title}
                         onChange={e => setTitle(e.target.value)}
                         className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground disabled:opacity-50 transition-shadow"
                         placeholder={t('materialTitlePlaceholder')}
                       />
                     </div>
                     <div className="space-y-2">
                       <CustomUploadField
                         file={pdfFile}
                         onChange={setPdfFile}
                         disabled={isUploading}
                         required={!initialData}
                         label={initialData ? t('pdfDocumentEdit') : t('pdfDocument')}
                       />
                     </div>
                   </div>
                 }
                 onChange={(data) => {
                   if (data) {
                      setCrosswordJson(JSON.stringify(data));
                   } else {
                      setCrosswordJson('');
                   }
                 }}
                 sidebarFooter={
                   <div className="flex flex-col gap-3">
                     {isUploading && (
                       <div className="p-3 bg-muted rounded-xl border border-border shrink-0">
                         <div className="flex justify-between items-center mb-2">
                           <span className="text-xs font-medium text-foreground flex items-center gap-2">
                              <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
                              {t('uploading')}
                           </span>
                           <span className="text-xs font-bold text-primary">{uploadProgress}%</span>
                         </div>
                         <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                           <div className="bg-primary h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                         </div>
                       </div>
                     )}
                     <Button type="submit" fullWidth disabled={isUploading} className="h-12 shadow-sm font-bold text-base shrink-0">
                       {isUploading ? t('savingMaterial') : t('saveMaterial')}
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
