import React, { useState } from 'react';
import {
  Megaphone,
  Send,
  Bell,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  Trash2,
  Clock,
  Radio
} from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import { Button } from '../../../components/common/Button';

export const AdminBroadcast = () => {
  const { notifications = [], addNotification, clearAll } = useNotifications();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info'); // 'info' | 'alert' | 'success'
  const [link, setLink] = useState('/events');
  const [successNotice, setSuccessNotice] = useState(false);

  const notifList = Array.isArray(notifications) ? notifications : [];

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    addNotification({
      title: title.trim(),
      message: message.trim(),
      type,
      link: link.trim() || null
    });

    setTitle('');
    setMessage('');
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 4000);
  };

  const handleQuickPreset = (presetTitle, presetMessage, presetType, presetLink) => {
    setTitle(presetTitle);
    setMessage(presetMessage);
    setType(presetType);
    setLink(presetLink);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          System Announcements & User Push Alerts
        </h2>
        <p className="text-xs text-slate-500">
          Broadcast real-time messages directly to all platform users. Notifications instantly appear in the user navbar bell and feed.
        </p>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Broadcast alert successfully dispatched to all active users and logged in the notification stream!</span>
        </div>
      )}

      {/* Two Column Layout: Broadcast Composer & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Composer Form (Crisp White Card) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-pulse" /> Live Broadcast Console
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Announcement Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ⚡ Flash Weekend Ticket Presale!"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white text-sm transition-all"
              />
            </div>

            {/* Message Body */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Notification Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write message details for attendees..."
                rows={4}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white leading-relaxed resize-none transition-all"
              />
            </div>

            {/* Notification Priority Type */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('info')}
                className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  type === 'info'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs font-extrabold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Info className="w-3.5 h-3.5" /> Info
              </button>
              <button
                type="button"
                onClick={() => setType('alert')}
                className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  type === 'alert'
                    ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-2xs font-extrabold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" /> High Alert
              </button>
              <button
                type="button"
                onClick={() => setType('success')}
                className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  type === 'success'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs font-extrabold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Promo
              </button>
            </div>

            {/* Destination Link */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Action Link (Optional)</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="/events or /events/evt-001"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono transition-all"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Send}
              iconPosition="right"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
            >
              Dispatch System Broadcast
            </Button>
          </form>

          {/* Quick Presets */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Quick 1-Click Broadcast Presets:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  handleQuickPreset(
                    '🔥 Weekend Concert Passes Live!',
                    'Limited VIP passes for Mumbai acoustic concerts are now open. Claim your seats before tickets sell out.',
                    'alert',
                    '/events'
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer"
              >
                Preset: Concert Rush
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickPreset(
                    '🎉 ₹499 Host Your Event Tariff Active',
                    'Organizers can publish events live on EventNest with automated ticketing and attendee gate scanning.',
                    'success',
                    '/host-event'
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer"
              >
                Preset: ₹499 Organizer Paywall
              </button>
            </div>
          </div>
        </div>

        {/* Right: Active Broadcast Feed (Crisp White Card) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-500" />
                <h3 className="font-black text-slate-900 text-base">
                  Live Notifications ({notifList.length})
                </h3>
              </div>

              {notifList.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
              {notifList.length > 0 ? (
                notifList.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 text-xs line-clamp-1">
                        {n.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold capitalize shrink-0 ${
                        n.type === 'alert'
                          ? 'bg-amber-100 text-amber-800'
                          : n.type === 'success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {n.type || 'info'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                      {n.message}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {n.time || 'Live'}
                      </span>
                      {n.link && (
                        <span className="text-indigo-600 font-mono font-semibold truncate max-w-[140px]">
                          {n.link}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center text-slate-400 text-xs">
                  No notifications recorded in history.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 text-center font-medium">
            Broadcast alerts sync instantly across all user devices.
          </div>
        </div>
      </div>
    </div>
  );
};
