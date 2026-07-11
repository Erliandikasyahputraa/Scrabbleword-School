import { useState, useRef } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

interface CustomUploadFieldProps {
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  required?: boolean;
  accept?: string;
  label?: string;
}

export function CustomUploadField({ file, onChange, disabled, required, accept = "application/pdf", label = "PDF Document" }: CustomUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === accept || accept === '*/*') {
         onChange(droppedFile);
      }
    }
  };

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onChange(e.target.files[0]);
          }
        }}
        disabled={disabled}
        required={required && !file}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative w-full rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden flex flex-col items-center justify-center min-h-[100px] p-4 group
          ${disabled ? 'opacity-50 cursor-not-allowed bg-muted/50 border-border' : 'cursor-pointer'}
          ${isDragging && !disabled ? 'border-primary bg-primary/5 scale-[1.02]' : ''}
          ${!isDragging && !disabled ? 'border-border hover:border-primary/50 hover:bg-muted/30' : ''}
          ${file ? 'border-success/50 bg-success/5' : ''}
        `}
      >
        {file ? (
          <div className="flex items-center gap-3 w-full max-w-sm bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm relative z-10" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-10 shrink-0 bg-success/10 text-success rounded-lg flex items-center justify-center">
              <FileIcon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="p-2 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 text-muted-foreground rounded-full transition-colors"
              disabled={disabled}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${isDragging ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary/70 group-hover:bg-primary/20 group-hover:text-primary'}`}>
              <UploadCloud size={24} />
            </div>
            <p className="text-sm font-medium text-foreground">
              <span className="text-primary hover:underline">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">PDF documents only (max 10MB)</p>
          </div>
        )}
      </div>
    </div>
  );
}
