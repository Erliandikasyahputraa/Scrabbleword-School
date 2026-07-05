import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { AlertCircle, ShieldAlert, FileQuestion, ServerCrash } from 'lucide-react';

interface ErrorPageProps {
  code: number;
  message?: string;
}

export default function ErrorPage({ code, message }: ErrorPageProps) {
  let config = {
    icon: <FileQuestion className="w-24 h-24 text-slate-400 mx-auto mb-6" />,
    title: 'Page Not Found',
    desc: 'The page you are looking for does not exist or has been moved.',
    color: 'text-slate-900 dark:text-white',
  };

  switch (code) {
    case 401:
      config = {
        icon: <ShieldAlert className="w-24 h-24 text-orange-500 mx-auto mb-6" />,
        title: 'Unauthorized Access',
        desc: 'You need to be logged in to access this page.',
        color: 'text-orange-600 dark:text-orange-400',
      };
      break;
    case 403:
      config = {
        icon: <AlertCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />,
        title: 'Access Denied',
        desc: 'You do not have permission to view this content.',
        color: 'text-red-600 dark:text-red-400',
      };
      break;
    case 404:
      config = {
        icon: <FileQuestion className="w-24 h-24 text-blue-500 mx-auto mb-6" />,
        title: 'Not Found',
        desc: 'The resource you are looking for could not be found.',
        color: 'text-blue-600 dark:text-blue-400',
      };
      break;
    case 500:
      config = {
        icon: <ServerCrash className="w-24 h-24 text-red-600 mx-auto mb-6" />,
        title: 'Server Error',
        desc: 'Something went wrong on our end. Please try again later.',
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
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
