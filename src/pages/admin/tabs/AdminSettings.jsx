import React, { useState } from 'react';
import {
  Key,
  Save,
  CheckCircle2,
  AlertTriangle,
  Sliders
} from 'lucide-react';
import { useEvents } from '../../../context/EventsContext';
import { clearStorage } from '../../../utils/storage';
import { Button } from '../../../components/common/Button';

export const AdminSettings = () => {
  const { adminFeeAmount = 499, updateAdminFeeAmount } = useEvents();

  const [siteName, setSiteName] = useState('EventNest Experiences');
  const [supportEmail, setSupportEmail] = useState('support@eventnest.com');
  const [feeRate, setFeeRate] = useState(adminFeeAmount);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [secretKeyShortcut, setSecretKeyShortcut] = useState('Ctrl + A');
  const [notice, setNotice] = useState(null);

  const showNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateAdminFeeAmount(Number(feeRate));
    showNotice('Platform configuration saved successfully.');
  };

  const handleTestSecretGateway = () => {
    // Dispatch a synthetic keyboard event for Ctrl + A
    const event = new KeyboardEvent('keydown', {
      key: 'a',
      ctrlKey: true,
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(event);
  };

  const handleResetData = () => {
    if (window.confirm('Reset local demo cache to factory seed? You will be redirected to home.')) {
      clearStorage();
      window.location.href = '/';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Platform Configurations & Security Keys
        </h2>
        <p className="text-xs text-slate-500">
          Manage master access keys, the Ctrl+A secret backdoor trigger, tariff rules, and platform metadata.
        </p>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Security & Secret Key Configuration Card (PRIMARY) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50 to-white border-2 border-indigo-200 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider font-mono">
              <Key className="w-4 h-4" /> Secret Administrative Gateway Protocol
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Backdoor Trigger: Shortcut [Ctrl + A]
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The Admin login is strictly hidden from regular storefront users. Admins invoke the login portal by pressing <kbd className="px-1.5 py-0.5 rounded bg-white text-indigo-600 font-mono text-[11px] border border-indigo-200 font-bold">Ctrl + A</kbd> anywhere on the website.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleTestSecretGateway}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shrink-0 shadow-xs"
          >
            Test Trigger [Ctrl + A]
          </Button>
        </div>

        {/* Credentials & Bypass Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
              Static Master Credentials
            </span>
            <div className="font-mono text-slate-700">
              Email: <strong className="text-indigo-600">admin@eventnest.com</strong>
            </div>
            <div className="font-mono text-slate-700">
              Password: <strong className="text-indigo-600">admin123</strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
              Emergency Master Bypass Key
            </span>
            <div className="font-mono text-slate-700">
              Passcode: <strong className="text-purple-600">ADMIN2026</strong>
            </div>
            <p className="text-[11px] text-slate-500">
              Can be pasted into the Secret Gateway passcode tab to bypass credentials immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Platform General Configurations Form (Crisp White Card) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <span>General Platform Settings</span>
        </h3>

        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Platform Brand Title</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">
                User Event Hosting Fee Tariff (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-amber-600 font-mono">
                  ₹
                </span>
                <input
                  type="number"
                  value={feeRate}
                  onChange={(e) => setFeeRate(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-500 block">
                Standard charge applied when normal users host an event.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Currency Processing Unit</label>
              <input
                type="text"
                value="Indian Rupee (₹ INR) - 18% GST Compliance"
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-mono cursor-not-allowed"
              />
            </div>
          </div>

          {/* Maintenance Mode Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-slate-900 block text-sm">Platform Maintenance Mode</span>
              <p className="text-slate-500 text-xs">
                Temporarily restricts user ticket purchases to authorized administrative accounts only.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                maintenanceMode ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform absolute top-1 ${
                  maintenanceMode ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
            >
              Save Platform Configuration
            </Button>
          </div>
        </form>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-50 border border-rose-200 space-y-4 shadow-xs">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Danger Zone: Factory Reset Cache
          </h4>
          <p className="text-xs text-rose-600/80">
            Purges all customized events, simulated bookings, and local storage data, restoring pristine seed records.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
        >
          Factory Reset LocalStorage & Cache
        </button>
      </div>
    </div>
  );
};
