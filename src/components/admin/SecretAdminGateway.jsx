import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  Key,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  Terminal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const SecretAdminGateway = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('admin@eventnest.com');
  const [password, setPassword] = useState('admin123');
  const [secretPasscode, setSecretPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('credentials'); // 'credentials' | 'passcode'
  const [error, setError] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const { user, isAdmin, login, loginAsAdminDirectly, logout } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  // Listen globally for Ctrl + A or Cmd + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl + A (or Cmd + A on Mac)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
        // Prevent default browser "select all" when opening secret admin gateway
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setError('');
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleInstantAdminLogin = () => {
    setIsAuthorizing(true);
    setError('');

    setTimeout(() => {
      const res = loginAsAdminDirectly();
      setIsAuthorizing(false);
      if (res.success) {
        setIsOpen(false);
        addNotification({
          title: 'Master Admin Authorized',
          message: 'Secure session established via Ctrl+A Master Gateway.',
          type: 'success',
          link: '/admin'
        });
        navigate('/admin');
      }
    }, 400);
  };

  const handleCredentialSubmit = (e) => {
    e.preventDefault();
    setIsAuthorizing(true);
    setError('');

    setTimeout(() => {
      const res = login({ email, password });
      setIsAuthorizing(false);

      if (res.success && res.user.role === 'admin') {
        setIsOpen(false);
        addNotification({
          title: 'Admin Access Granted',
          message: 'Welcome back to Master Command Center.',
          type: 'success',
          link: '/admin'
        });
        navigate('/admin');
      } else if (res.success && res.user.role !== 'admin') {
        setError('Credentials authenticated but user lacks Super-Admin privileges.');
      } else {
        setError(res.error || 'Invalid administrator credentials.');
      }
    }, 500);
  };

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    setIsAuthorizing(true);
    setError('');

    setTimeout(() => {
      // Secret passcodes that grant instant platform access
      const validCodes = ['ADMIN2026', 'EVENTNEST', 'CTRLA', 'SUPERADMIN'];
      if (validCodes.includes(secretPasscode.trim().toUpperCase())) {
        loginAsAdminDirectly();
        setIsAuthorizing(false);
        setIsOpen(false);
        addNotification({
          title: 'Master Passcode Accepted',
          message: 'Root privileges unlocked successfully.',
          type: 'success',
          link: '/admin'
        });
        navigate('/admin');
      } else {
        setIsAuthorizing(false);
        setError('Invalid master bypass code. Try "ADMIN2026" or static admin login.');
      }
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop with dark blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/20 text-white z-10 overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Gateway (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge & Title */}
            <div className="space-y-3 pb-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-400 font-mono">
                      Restricted Access Portal
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                      CTRL + A
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    Platform Super-Admin Gateway
                  </h2>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Hidden administrative command portal. Unauthorized access is strictly logged and monitored.
              </p>
            </div>

            {/* If Already Admin */}
            {isAdmin ? (
              <div className="py-6 space-y-5">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-emerald-300">
                      Super-Admin Session Currently Active
                    </h4>
                    <p className="text-xs text-slate-300">
                      Authenticated as <span className="font-bold text-white">{user?.name}</span> ({user?.email}). Full platform administrative capabilities are authorized.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/admin');
                    }}
                    className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    <span>Launch Admin Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800 font-bold text-sm transition-all cursor-pointer"
                  >
                    Disconnect Admin
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-5 space-y-5">
                {/* 1-Click Fast Authorization Button */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400 fill-amber-400" /> Instant Master Authorization
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      admin@eventnest.com
                    </span>
                  </div>
                  <button
                    onClick={handleInstantAdminLogin}
                    disabled={isAuthorizing}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-indigo-600/40 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isAuthorizing ? (
                      <span>Verifying Master Credentials...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Authorize As Platform Admin (1-Click)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Tabs: Credentials vs Bypass Code */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <button
                    onClick={() => {
                      setActiveTab('credentials');
                      setError('');
                    }}
                    className={`text-xs font-bold pb-1 border-b-2 transition-all cursor-pointer ${
                      activeTab === 'credentials'
                        ? 'text-indigo-400 border-indigo-500'
                        : 'text-slate-500 border-transparent hover:text-slate-300'
                    }`}
                  >
                    Credentials Login
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('passcode');
                      setError('');
                    }}
                    className={`text-xs font-bold pb-1 border-b-2 transition-all cursor-pointer flex items-center gap-1 ${
                      activeTab === 'passcode'
                        ? 'text-purple-400 border-purple-500'
                        : 'text-slate-500 border-transparent hover:text-slate-300'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Secret Master Passcode</span>
                  </button>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Form: Credentials */}
                {activeTab === 'credentials' ? (
                  <form onSubmit={handleCredentialSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-indigo-400" /> Admin Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@eventnest.com"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-indigo-400" /> Admin Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="admin123"
                          required
                          className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthorizing}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                    >
                      {isAuthorizing ? 'Authenticating...' : 'Sign In To Admin Core'}
                    </button>
                  </form>
                ) : (
                  /* Form: Master Passcode */
                  <form onSubmit={handlePasscodeSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-purple-400" /> Master Security Bypass Code
                      </label>
                      <input
                        type="password"
                        value={secretPasscode}
                        onChange={(e) => setSecretPasscode(e.target.value)}
                        placeholder="Enter Master Key (e.g. ADMIN2026)"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-purple-500 font-mono tracking-widest text-center uppercase"
                      />
                      <span className="text-[10px] text-slate-500 block text-center">
                        Tip: Master Passcode is <strong className="text-purple-400">ADMIN2026</strong>
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthorizing}
                      className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-600/30 disabled:opacity-50"
                    >
                      {isAuthorizing ? 'Validating Master Key...' : 'Unlock Super-Admin Privileges'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Footer with Hint */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span>Secret Shortcut:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                  Ctrl + A
                </kbd>
              </span>
              <span>Press <kbd className="font-mono text-slate-400">ESC</kbd> to dismiss</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
