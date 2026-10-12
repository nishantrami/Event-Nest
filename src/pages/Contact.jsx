import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSent(false);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          We’re Here to Help
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Have questions regarding an upcoming event, ticket upgrades, or partnering as an organizer? Drop us a line.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Information & Hubs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Direct Channels
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Support Desk
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    support@eventnest.com
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Customer Hotline
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    +91 (022) 8000-NEST (6378)
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Response Window
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Within 15 minutes during live show hours
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Hubs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              Regional Experience Hubs
            </h4>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Mumbai HQ:</strong> Level 14, Platina Tower, Bandra Kurla Complex (BKC), Mumbai 400051
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Bengaluru Lab:</strong> Indiranagar 100ft Road, Stage 2, Bengaluru 560038
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs"
          >
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Send Us a Message
            </h3>

            {isSent && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you! Your message has been received. Our concierge will get back to you shortly.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                placeholder="Nishant Rami"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Input
              label="Subject / Booking Reference (Optional)"
              placeholder="e.g. Question regarding Neon Horizon VIP Gate"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Message
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist you today?..."
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" icon={Send} iconPosition="right">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
