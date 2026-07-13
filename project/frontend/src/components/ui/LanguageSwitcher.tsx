import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'en', label: 'English', flag: '🇺🇸' }
];

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fallback to 'id' if i18n.language is somehow not matched
  const currentLang = LANGUAGES.find(l => l.code === i18n.language?.split('-')[0]) || LANGUAGES[0];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label={t('changeLanguage', { ns: 'common' })}
        title={currentLang.label}
      >
        <Globe size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="py-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                  currentLang.code === lang.code 
                    ? 'text-primary font-medium bg-primary/5 dark:bg-primary/10' 
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  {lang.label}
                </span>
                {currentLang.code === lang.code && <Check size={16} className="text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
