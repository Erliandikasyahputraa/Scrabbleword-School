import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { Button } from '../components/ui/Button';
import { BrainCircuit, Sparkles, Target, ArrowRight, Eye, EyeOff } from 'lucide-react';

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
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }
    
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation, role }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      setSuccess(data.message || 'Registration successful. Please wait for admin approval.');
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-[100vw] flex bg-white dark:bg-slate-950 animate-in fade-in duration-700 absolute inset-0 z-50 overflow-y-auto">
      
      {/* Left Side: Brand Story & Gradient Background */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-blue-600 via-primary to-indigo-800 text-white relative overflow-hidden fixed h-screen w-1/2">
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
            Join the future <br /> 
            of learning today.
          </h1>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed">
            Create an account to start your journey. Whether you are teaching or learning, TekaTeki gives you the tools to succeed.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Sparkles size={20} className="text-blue-200" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Interactive Classes</h3>
              <p className="text-blue-200 text-sm">Engage with modern puzzle materials.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Target size={20} className="text-blue-200" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Achieve Mastery</h3>
              <p className="text-blue-200 text-sm">Retain knowledge better through active recall.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Floating Register Card */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 relative bg-slate-50 dark:bg-slate-950 lg:ml-[50%] min-h-screen">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 relative z-10 my-8">
          
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-primary/10 p-2 rounded-xl">
              <BrainCircuit size={28} className="text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">TekaTeki</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create an account</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Sign up to get started with your journey.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30 flex items-center justify-center">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white"
                placeholder="John Doe"
                required
              />
            </div>

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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Confirm</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`h-12 rounded-xl border font-medium transition-all ${
                    role === 'student' 
                      ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`h-12 rounded-xl border font-medium transition-all ${
                    role === 'teacher' 
                      ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Teacher
                </button>
              </div>
            </div>
            
            <div className="pt-4">
              <Button type="submit" disabled={isLoading} fullWidth className="h-12 text-base shadow-lg shadow-primary/25">
                {isLoading ? 'Creating account...' : <><span className="mr-2">Register</span> <ArrowRight size={18} /></>}
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
