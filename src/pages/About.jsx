import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Users, Globe, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Our Story
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
          Where Live Experiences Come to Life
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          EventNest was born from a simple belief: the most unforgettable moments in life happen when people gather together in the presence of art, music, sport, and ideas.
        </p>
      </div>

      {/* Creator Spotlight */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white border-2 border-red-600 shadow-2xl flex flex-col md:flex-row items-center gap-8">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-red-500/20 border-2 border-red-500 p-2 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            alt="Nishant Rami"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <div className="space-y-3 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block">
            Founder & Lead Architect
          </span>
          <h3 className="text-2xl sm:text-3xl font-black">Nishant Rami</h3>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            "We built EventNest to eliminate the friction from live entertainment. No confusing ticketing fees, no secondary scalpers, and no anxiety at the stadium gate. Every detail is crafted for genuine human connection."
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            100% Authenticity Guarantee
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Every e-ticket issued on EventNest has a cryptographically signed QR code backed by our venue partner network.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Community First
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            From grassroots open mics to international festivals, we empower independent artists and curators to connect directly with fans.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Global Vision
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Connecting modern metropolitan hubs across Mumbai, Bengaluru, Delhi, and beyond into a unified experience network.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-8">
        <Link to="/events">
          <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
            Explore All Live Events
          </Button>
        </Link>
      </div>
    </div>
  );
};
