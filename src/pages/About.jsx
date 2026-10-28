import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Users, Globe, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
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
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-[#0a0f24] to-slate-950 p-8 sm:p-12 text-white border border-white/20 shadow-2xl flex flex-col md:flex-row items-center gap-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-rose-500/20 border-2 border-rose-500/40 p-2 shrink-0 shadow-lg shadow-rose-500/20">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            alt="Nishant Rami"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <div className="relative z-10 space-y-3 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
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
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-xl hover:border-rose-500/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            100% Authenticity Guarantee
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Every e-ticket issued on EventNest has a cryptographically signed QR code backed by our venue partner network.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-xl hover:border-amber-500/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Community First
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            From grassroots open mics to international festivals, we empower independent artists and curators to connect directly with fans.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
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
