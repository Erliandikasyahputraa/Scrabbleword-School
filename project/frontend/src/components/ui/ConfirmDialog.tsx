import { Button } from './Button';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  isDestructive = true,
}: ConfirmDialogProps) {
  const { t } = useTranslation('common');
  const finalConfirmText = confirmText || t('confirm');
  const finalCancelText = cancelText || t('cancel');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-3xl p-6 w-full max-w-[calc(100vw-2rem)] sm:max-w-md shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-foreground mb-2 pr-8">
          {title}
        </h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 mt-4">
          {isDestructive && (
            <div className="bg-destructive/10 p-3 rounded-full text-destructive shrink-0">
              <AlertTriangle size={24} />
            </div>
          )}
          <p className="text-sm sm:text-base text-muted-foreground">
            {description}
          </p>
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            {finalCancelText}
          </Button>
          <Button 
            variant="primary"
            className={`w-full sm:w-auto ${isDestructive ? 'bg-destructive hover:bg-destructive/90 shadow-destructive/25 text-destructive-foreground' : ''}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {finalConfirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
