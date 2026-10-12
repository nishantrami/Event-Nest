import React, { useState } from 'react';
import { Sun, Moon, Bell, Shield, Download, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

export const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [ticketReminders, setTicketReminders] = useState(true);
  const [saveToast, setSaveToast] = useState(false);

  const handleSavePreferences = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleExportData = () => {
    const data = {
      user,
      exportedAt: new Date().toISOString(),
      platform: 'EventNest',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eventnest-userdata-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Preferences
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure appearance, notification channels, and privacy preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            Theme & Appearance
          </h3>
          <p className="text-xs text-slate-500">
            Choose your preferred color theme. Current theme: <strong className="capitalize">{theme}</strong>
          </p>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`px-5 py-3 rounded-2xl border-2 flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sun className="w-4 h-4" /> Light Mode
            </button>

            <button
              onClick={toggleTheme}
              className={`px-5 py-3 rounded-2xl border-2 flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'border-indigo-600 bg-indigo-950/40 text-indigo-400 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Moon className="w-4 h-4" /> Dark Mode
            </button>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" />
            Notification Alerts
          </h3>

          <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800/80">
            <div className="flex items-center justify-between pt-3 first:pt-0">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Email Ticket Confirmations
                </h4>
                <p className="text-[11px] text-slate-500">
                  Receive PDF passes, venue coordinates, and parking instructions.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Event Day Countdown & Gate Alerts
                </h4>
                <p className="text-[11px] text-slate-500">
                  Reminders 24 hours and 2 hours prior to performance start.
                </p>
              </div>
              <input
                type="checkbox"
                checked={ticketReminders}
                onChange={(e) => setTicketReminders(e.target.checked)}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  SMS & WhatsApp Gate Pass
                </h4>
                <p className="text-[11px] text-slate-500">
                  Direct turnstile barcode link delivered to your phone.
                </p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saveToast && (
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Preferences saved!
              </span>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={handleSavePreferences}
              className="ml-auto"
            >
              Save Preferences
            </Button>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            Data & Privacy
          </h3>
          <p className="text-xs text-slate-500">
            EventNest values your privacy. All your bookings, favorites, and profile data are securely preserved in your local browser sandbox.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={handleExportData}
            >
              Export Account Data (JSON)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
