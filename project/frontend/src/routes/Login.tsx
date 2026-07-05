import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { Button } from '../components/ui/Button';
import { BrainCircuit, Sparkles, Target, ArrowRight, Eye, EyeOff } from 'lucide-react';

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
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      login(data.access_token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-[100vw] flex bg-white dark:bg-slate-950 animate-in fade-in duration-700 absolute inset-0 z-50">
      
      {/* Left Side: Brand Story & Gradient Background */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-blue-600 via-primary to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <BrainCircuit size={32} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">TekaTeki</span>
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
            Master English <br /> 
            with engaging puzzles.
          </h1>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed">
            A premium learning platform that combines interactive PDF reading with challenging crossword exercises to solidify your vocabulary.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Sparkles size={20} className="text-blue-200" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Smart Learning</h3>
              <p className="text-blue-200 text-sm">Adaptive materials tailored for you.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Target size={20} className="text-blue-200" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Goal Oriented</h3>
              <p className="text-blue-200 text-sm">Track your progress and build streaks.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Floating Login Card */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 relative bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 relative z-10">
          
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-primary/10 p-2 rounded-xl">
              <BrainCircuit size={28} className="text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">TekaTeki</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Enter your credentials to access your account.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30 flex items-center justify-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-4 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="pt-2">
              <Button type="submit" disabled={isLoading} fullWidth className="h-12 text-base shadow-lg shadow-primary/25">
                {isLoading ? 'Signing In...' : <><span className="mr-2">Sign In</span> <ArrowRight size={18} /></>}
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
