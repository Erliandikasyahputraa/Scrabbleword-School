import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { Button } from '../components/ui/Button';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { API_URL } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Tidak dapat terhubung ke server. Silakan coba beberapa saat lagi.');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      login(data.access_token, data.user);
      navigate('/');
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        setError('Koneksi terputus. Pastikan internet Anda aktif dan server berjalan.');
      } else {
        setError(err.message || 'Login gagal. Periksa kembali kredensial Anda.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[600px] flex flex-col items-center">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back
        </h1>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto">
          Sign in to your account to continue your learning journey
        </p>
      </div>

      <div className="w-full bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_40px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.3)] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 lg:p-10 relative overflow-hidden transition-all hover:shadow-[0_16px_60px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_16px_60px_rgb(0,0,0,0.4)]">
        
        {/* Decorative subtle light beam */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        {error && (
          <div className="mb-8 p-4 bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100/50 dark:border-red-900/30 flex items-center justify-center animate-in fade-in zoom-in-95 backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              placeholder="name@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <a href="#" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors focus:outline-none focus:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-4 pr-11 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center justify-center w-8 h-8 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 opacity-70 group-hover:opacity-100"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="pt-4">
            <Button type="submit" disabled={isLoading} fullWidth className="h-12 rounded-xl text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:translate-y-0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <><Loader2 size={18} className="animate-spin mr-2" /> Signing in...</>
                ) : (
                  <>Sign In <ArrowRight size={18} className="ml-2 opacity-80 group-hover:translate-x-1 transition-transform" /></>
                )}
              </span>
            </Button>
          </div>
        </form>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors focus:outline-none focus:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
