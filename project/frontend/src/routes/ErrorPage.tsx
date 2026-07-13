import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { AlertCircle, ShieldAlert, FileQuestion, ServerCrash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ErrorPageProps {
  code: number;
  message?: string;
}

export default function ErrorPage({ code, message }: ErrorPageProps) {
  const { t } = useTranslation('common');

  let config = {
    icon: <FileQuestion className="w-24 h-24 text-slate-400 mx-auto mb-6" />,
    title: t('pageNotFound'),
    desc: t('pageNotFoundDesc'),
    color: 'text-slate-900 dark:text-white',
  };

  switch (code) {
    case 401:
      config = {
        icon: <ShieldAlert className="w-24 h-24 text-orange-500 mx-auto mb-6" />,
        title: t('unauthorizedAccess'),
        desc: t('unauthorizedAccessDesc'),
        color: 'text-orange-600 dark:text-orange-400',
      };
      break;
    case 403:
      config = {
        icon: <AlertCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />,
        title: t('accessDenied'),
        desc: t('accessDeniedDesc'),
        color: 'text-red-600 dark:text-red-400',
      };
      break;
    case 404:
      config = {
        icon: <FileQuestion className="w-24 h-24 text-blue-500 mx-auto mb-6" />,
        title: t('notFound'),
        desc: t('notFoundDesc'),
        color: 'text-blue-600 dark:text-blue-400',
      };
      break;
    case 500:
      config = {
        icon: <ServerCrash className="w-24 h-24 text-red-600 mx-auto mb-6" />,
        title: t('serverError'),
        desc: t('serverErrorDesc'),
        color: 'text-red-700 dark:text-red-500',
      };
      break;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center p-8 animate-in fade-in zoom-in duration-500">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 rounded-3xl shadow-xl max-w-lg w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/50 -z-10 blur-xl" />
        {config.icon}
        <h1 className={`text-6xl font-black mb-4 ${config.color}`}>{code}</h1>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{config.title}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">{message || config.desc}</p>
        <Link to="/">
          <Button size="lg" className="px-8 shadow-lg font-semibold rounded-full">
            {t('returnToDashboard')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
