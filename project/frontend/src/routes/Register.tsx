import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { API_URL } from '../lib/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
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
        throw new Error('Tidak dapat terhubung ke server. Silakan coba beberapa saat lagi.');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registrasi gagal');
      }
      setSuccess(data.message || 'Registrasi berhasil. Silakan tunggu persetujuan admin.');
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        setError('Koneksi terputus. Pastikan internet Anda aktif dan server berjalan.');
      } else {
        setError(err.message || 'Registrasi gagal. Periksa kembali data Anda.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full w-full max-w-[420px] mx-auto animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="flex flex-col items-center mb-8">
        <Logo size={40} className="mb-6 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Sign up to get started with your journey
        </p>
      </div>

      <div className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl shadow-black/5 rounded-2xl p-6 sm:p-8">
        {error && (
          <div className="mb-6 p-3 bg-destructive/10 text-destructive rounded-lg text-sm font-medium border border-destructive/20 flex items-center justify-center text-center animate-in fade-in zoom-in-95">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-medium border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-center animate-in fade-in zoom-in-95">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full h-11 pl-4 pr-11 rounded-xl border border-input bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center w-6 h-6"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium text-foreground">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`h-11 rounded-xl border font-medium transition-all ${
                  role === 'student' 
                    ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400' 
                    : 'border-input text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`h-11 rounded-xl border font-medium transition-all ${
                  role === 'teacher' 
                    ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400' 
                    : 'border-input text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                Teacher
              </button>
            </div>
          </div>
          
          <div className="pt-4">
            <Button type="submit" disabled={isLoading} fullWidth className="h-11 rounded-xl font-medium shadow-sm transition-all hover:shadow-md">
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin mr-2" /> Creating account...</>
              ) : (
                <>Register <ArrowRight size={16} className="ml-2" /></>
              )}
            </Button>
          </div>
        </form>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
