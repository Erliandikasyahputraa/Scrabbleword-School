import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { API_URL } from '../lib/api';
import { Logo } from '../components/ui/Logo';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const { t } = useTranslation('auth');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      // We should ideally translate this too, but for now we can add it to auth.json or common.json later
      setError('Password tidak cocok');
      return;
    }
    
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation, role }),
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(t('login.errorConnection'));
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || t('register.errorFailed'));
      }
      setSuccess(data.message || 'Registrasi berhasil. Silakan tunggu persetujuan admin.');
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        setError(t('login.errorConnection'));
      } else {
        setError(err.message || t('register.errorFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] flex flex-col items-center">
      
      {/* Logo */}
      <Link to="/" className="mb-6 hover:opacity-80 transition-opacity focus:outline-none rounded-lg">
        <Logo size={40} className="text-slate-900 dark:text-white" />
      </Link>

      {/* Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t('register.welcome')}
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
          {t('register.subtitle')}
        </p>
      </div>

      {/* Card */}
      <div className="w-full bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_40px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.3)] rounded-[24px] p-6 sm:p-8 relative overflow-hidden transition-all hover:shadow-[0_16px_60px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_16px_60px_rgb(0,0,0,0.4)]">
        
        {/* Decorative subtle light beam */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {error && (
          <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100/50 dark:border-red-900/30 flex items-center justify-center text-center animate-in fade-in zoom-in-95 backdrop-blur-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium border border-emerald-100/50 dark:border-emerald-900/30 flex items-center justify-center text-center animate-in fade-in zoom-in-95 backdrop-blur-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('register.nameLabel')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              placeholder={t('register.namePlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('register.emailLabel')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              placeholder={t('register.emailPlaceholder')}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('register.passwordLabel')}</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder={t('register.passwordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center justify-center w-8 h-8 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 opacity-70 group-hover:opacity-100"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('register.confirmPasswordLabel')}</label>
              <div className="relative group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder={t('register.confirmPasswordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center justify-center w-8 h-8 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 opacity-70 group-hover:opacity-100"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('register.roleLabel')}</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`h-11 rounded-xl border font-semibold transition-all ${
                  role === 'student' 
                    ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 ring-1 ring-primary/20' 
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20'
                }`}
              >
                {t('register.roleStudent')}
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`h-11 rounded-xl border font-semibold transition-all ${
                  role === 'teacher' 
                    ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 ring-1 ring-primary/20' 
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20'
                }`}
              >
                {t('register.roleTeacher')}
              </button>
            </div>
          </div>
          
          <div className="pt-3">
            <Button type="submit" disabled={isLoading} fullWidth className="h-11 rounded-xl text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:translate-y-0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <><Loader2 size={18} className="animate-spin mr-2" /> {t('register.signingUp')}</>
                ) : (
                  <>{t('register.signUp')} <ArrowRight size={18} className="ml-2 opacity-80 group-hover:translate-x-1 transition-transform" /></>
                )}
              </span>
            </Button>
          </div>
        </form>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        {t('register.hasAccount')} {' '}
        <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors focus:outline-none focus:underline">
          {t('register.signIn')}
        </Link>
      </p>
    </div>
  );
}
