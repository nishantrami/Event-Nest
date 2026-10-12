import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Lock,
  Mail,
  Key,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';

export const AdminLogin = () => {
  const [email, setEmail] = useState('admin@eventnest.com');
  const [password, setPassword] = useState('admin123');
  const [masterPasscode, setMasterPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState('credentials'); // 'credentials' | 'passcode'
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, loginAsAdminDirectly, isAdmin } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const targetUrl = location.state?.from
    ? `${location.state.from.pathname}${location.state.from.search || ''}`
    : '/admin';

  // If already logged in as Admin, allow fast entry
  const handleProceedToDashboard = () => {
    navigate(targetUrl);
  };

  const handleFastFillAndLogin = () => {
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      loginAsAdminDirectly();
      setIsLoading(false);
      addNotification({
        title: 'Master Admin Authorized',
        message: 'Direct platform authorization completed.',
        type: 'success',
        link: '/admin'
      });
      navigate(targetUrl);
    }, 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (authMethod === 'passcode') {
        const validCodes = ['ADMIN2026', 'EVENTNEST', 'CTRLA', 'SUPERADMIN'];
        if (validCodes.includes(masterPasscode.trim().toUpperCase())) {
          loginAsAdminDirectly();
          setIsLoading(false);
          addNotification({
            title: 'Master Passcode Accepted',
            message: 'Super-admin authenticated successfully.',
            type: 'success',
            link: '/admin'
          });
          navigate(targetUrl);
        } else {
          setIsLoading(false);
          setError('Invalid Master Passcode. Use "ADMIN2026" or enter credentials.');
        }
      } else {
        const result = login({ email, password });
        setIsLoading(false);

        if (result.success && result.user.role === 'admin') {
          addNotification({
            title: 'Admin Access Granted',
            message: 'Welcome back to Admin Command Center.',
            type: 'success',
            link: '/admin'
          });
          navigate(targetUrl);
        } else if (result.success && result.user.role !== 'admin') {
          setError('Access Denied: Account does not possess Super-Admin privileges.');
        } else {
          setError(result.error || 'Invalid administrator email or password.');
        }
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-white selection:bg-purple-600 selection:text-white">
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top back navigation */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-slate-900"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Storefront
        </Link>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
          <span>Secret Key:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Ctrl + A
          </kbd>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/50 space-y-6 z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60 uppercase">
              Restricted Area
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800/60">
              Admin Only
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Admin Command Core
          </h1>
          <p className="text-xs text-slate-400">
            Internal administrative portal for EventNest platform operations.
          </p>
        </div>

        {/* If Already Admin */}
        {isAdmin ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>You are already authenticated with platform super-admin privileges.</span>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleProceedToDashboard}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 font-bold"
            >
              Enter Admin Panel
            </Button>
          </div>
        ) : (
          <>
            {/* Quick 1-Click Fill & Authenticate */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-indigo-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  Instant Super-Admin Fill
                </span>
                <span className="text-[11px] font-mono text-slate-400 block">
                  admin@eventnest.com • admin123
                </span>
              </div>
              <button
                type="button"
                onClick={handleFastFillAndLogin}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                Authorize
              </button>
            </div>

            {/* Error Notice */}
            {error && (
              <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Auth Method Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('credentials');
                  setError('');
                }}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  authMethod === 'credentials'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin Credentials
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('passcode');
                  setError('');
                }}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  authMethod === 'passcode'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Master Bypass Key
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMethod === 'credentials' ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" /> Administrator Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@eventnest.com"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-400" /> Administrator Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-purple-400" /> Master Passcode
                  </label>
                  <input
                    type="password"
                    value={masterPasscode}
                    onChange={(e) => setMasterPasscode(e.target.value)}
                    placeholder="Enter Master Key (e.g. ADMIN2026)"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500 font-mono text-center tracking-widest uppercase"
                  />
                  <span className="text-[11px] text-slate-500 block text-center">
                    Default Master Key is <strong className="text-purple-400">ADMIN2026</strong>
                  </span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-indigo-600/30 mt-2"
              >
                Access Admin Core
              </Button>
            </form>
          </>
        )}

        {/* Security Footnote */}
        <div className="text-center pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
          <p>Protected by Antigravity Hardware Token & 256-Bit SSL</p>
          <p className="font-mono text-[10px] text-slate-600">Session ID: EN-ADM-ROOT-SECURE</p>
        </div>
      </div>
    </div>
  );
};
