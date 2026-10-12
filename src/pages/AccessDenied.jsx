import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, PlusCircle, LogIn, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

export const AccessDenied = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminSwitch = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-center sm:text-left">
        
        {/* Header with Icon */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10 border border-amber-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Administrative Access Policy
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Organizer Dashboard is Admin-Only
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              You are signed in as <strong className="text-slate-900 dark:text-slate-200">{user?.name || 'User'}</strong> ({user?.email}). The Organizer Dashboard, financial reports, and catalog operations are restricted strictly to Administrators.
            </p>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Card 1: User Event Organization */}
          <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 space-y-4 text-left flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Host an Event as a User
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Users can organize events on EventNest! The Admin charges a simple one-time verification fee of <strong>₹499 (INR)</strong> to publish your event live.
              </p>
            </div>

            <Link to="/host-event" className="block pt-2">
              <Button variant="primary" size="sm" className="w-full" icon={PlusCircle}>
                Organize Event (₹499 Fee)
              </Button>
            </Link>
          </div>

          {/* Card 2: Static Admin Login */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4 text-left flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-2xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shadow-md">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Sign in as Administrator
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Log in with the static administrator credentials to access the full Organizer Dashboard & review collected organization charges:
              </p>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                <div>Email: <strong className="text-indigo-600 dark:text-indigo-400">admin@eventnest.com</strong></div>
                <div>Pass: <strong className="text-indigo-600 dark:text-indigo-400">admin123</strong></div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              icon={LogIn}
              onClick={handleAdminSwitch}
            >
              Sign In as Admin
            </Button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Discover Events
          </Link>

          <span className="text-[11px] text-slate-400">
            EventNest Security • Role Verification Active
          </span>
        </div>
      </div>
    </div>
  );
};
