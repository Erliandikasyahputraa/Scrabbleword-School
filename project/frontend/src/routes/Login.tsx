import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { Button } from '../components/ui/Button';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
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
    <div className="w-full max-w-[520px] animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="flex flex-col items-center mb-10">
        <Logo size={44} className="mb-6 text-primary lg:hidden" />
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-base text-muted-foreground mt-3">
          Enter your credentials to access your account
        </p>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_40px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.2)] rounded-[2rem] p-8 sm:p-12 relative overflow-hidden">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-medium border border-destructive/20 flex items-center justify-center animate-in fade-in zoom-in-95">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
              placeholder="name@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Password</label>
              <a href="#" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-4 pr-11 rounded-xl border border-input bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center w-6 h-6"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div className="pt-2">
            <Button type="submit" disabled={isLoading} fullWidth className="h-11 rounded-xl font-medium shadow-sm transition-all hover:shadow-md">
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin mr-2" /> Signing in...</>
              ) : (
                <>Sign in <ArrowRight size={16} className="ml-2" /></>
              )}
            </Button>
          </div>
        </form>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
          Create account
        </Link>
      </p>
    </div>
  );
}
