import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Send, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export const Footer = () => {
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscribedEmail || !subscribedEmail.includes('@')) return;
    setSubscribedSuccess(true);
    setTimeout(() => {
      setSubscribedEmail('');
      setSubscribedSuccess(false);
    }, 4000);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-950 p-8 sm:p-12 rounded-3xl border-2 border-red-600 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-2 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Stay in the loop
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Never miss an unforgettable night
              </h3>
              <p className="text-sm text-slate-400 max-w-md">
                Get early-bird ticket alerts, VIP presales, and secret lineup reveals directly to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={subscribedEmail}
                  onChange={(e) => setSubscribedEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
              <Button type="submit" variant="primary" icon={Send} iconPosition="right" className="w-full sm:w-auto">
                {subscribedSuccess ? 'Subscribed!' : 'Subscribe'}
              </Button>
            </form>
          </div>
          {subscribedSuccess && (
            <p className="text-xs text-emerald-400 mt-2 text-center flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Welcome aboard! You are now subscribed to EventNest VIP alerts.
            </p>
          )}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <Sparkles className="w-5 h-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tight">
                  Event<span className="text-indigo-400">Nest</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
                  Discover. Experience. Remember.
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              EventNest is the premier event discovery and ticket booking platform designed for music aficionados, festival-goers, sports buffs, and culture lovers.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Tickets & Anti-Fraud Guarantee</span>
            </div>
          </div>

          {/* Discover Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Discover
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/events?category=music" className="hover:text-indigo-400 transition-colors">
                  Concerts & Gigs
                </Link>
              </li>
              <li>
                <Link to="/events?category=comedy" className="hover:text-indigo-400 transition-colors">
                  Standup Specials
                </Link>
              </li>
              <li>
                <Link to="/events?category=sports" className="hover:text-indigo-400 transition-colors">
                  Sports Matches
                </Link>
              </li>
              <li>
                <Link to="/events?category=festivals" className="hover:text-indigo-400 transition-colors">
                  Festivals & Carnivals
                </Link>
              </li>
              <li>
                <Link to="/events?category=technology" className="hover:text-indigo-400 transition-colors">
                  Tech & AI Summits
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              For Organizers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/host-event" className="hover:text-indigo-400 transition-colors flex items-center justify-between">
                  <span>Host an Event</span>
                  <span className="text-[10px] text-emerald-400 font-bold">₹499 Fee</span>
                </Link>
              </li>
              <li>
                <Link to="/organizer" className="hover:text-indigo-400 transition-colors flex items-center justify-between">
                  <span>Organizer Dashboard</span>
                  <span className="text-[10px] text-purple-400 font-semibold">Admin</span>
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-indigo-400 transition-colors">
                  Organizer Fees & Policies
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors">
                  About EventNest
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-indigo-400 transition-colors">
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 EventNest. All rights reserved.</p>

          <button
            onClick={() => window.dispatchEvent(new Event('eventnest-replay-loader'))}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-950/80 text-slate-400 hover:text-indigo-300 border border-slate-700/70 hover:border-indigo-500/40 transition-all text-[11px] font-mono cursor-pointer shadow-xs"
            title="Replay 21st.dev UI Loading Screen"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Replay 21st.dev Loader</span>
          </button>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
            <span>by <strong className="text-slate-200 font-semibold">Nishant Rami</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
