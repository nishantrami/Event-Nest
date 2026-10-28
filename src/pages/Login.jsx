import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Sparkles, AlertCircle, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  // Fast Fill Regular User Account
  const handleUserFill = () => {
    setEmail('user@eventnest.com');
    setPassword('password123');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const result = login({ email, password });
      setIsLoading(false);

      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate(redirectPath, { replace: true });
        }
      } else {
        setError(result.error || 'Invalid credentials. Please check your email and password.');
      }
    }, 500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-600/30">
            <Sparkles className="w-6 h-6 fill-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Sign In to EventNest
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select your account type or type credentials manually.
          </p>
        </div>

        {/* Quick Fill Demo User Card */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
          <div className="space-y-0.5 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
              <UserCheck className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Demo User Account</span>
            </div>
            <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate">
              user@eventnest.com • password123
            </p>
          </div>
          <button
            type="button"
            onClick={handleUserFill}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-[11px] hover:opacity-90 transition-opacity cursor-pointer shrink-0 shadow-xs"
          >
            Auto Fill
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="admin@eventnest.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full text-base font-bold shadow-lg shadow-rose-600/30 mt-2"
          >
            Sign In
          </Button>
        </form>

        {/* Bottom Switch Link */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-white/10">
          <span>Don’t have an account yet? </span>
          <Link to="/register" className="font-bold text-rose-600 dark:text-rose-400 hover:underline">
            Register new user account
          </Link>
        </div>
      </div>
    </div>
  );
};
