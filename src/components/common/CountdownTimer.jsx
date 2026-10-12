import React, { useState, useEffect } from 'react';
import { calculateCountdown } from '../../utils/formatDate';
import { Clock, Radio, CheckCircle2 } from 'lucide-react';

export const CountdownTimer = ({ date, time = '18:00', compact = false }) => {
  const [countdown, setCountdown] = useState(() => calculateCountdown(date, time));

  useEffect(() => {
    // Update every second
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(date, time));
    }, 1000);

    return () => clearInterval(timer);
  }, [date, time]);

  if (countdown.isLive) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold text-xs tracking-wider animate-pulse">
        <Radio className="w-3.5 h-3.5 animate-spin" />
        <span>EVENT IS LIVE NOW</span>
      </div>
    );
  }

  if (countdown.isCompleted) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Event Completed</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800/60">
        <Clock className="w-3 h-3" />
        <span>{countdown.days}d {countdown.hours}h {countdown.minutes}m</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-2.5 sm:px-3 py-2 min-w-[52px] sm:min-w-[60px] shadow-xs">
        <span className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
          {countdown.days}
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
          Days
        </span>
      </div>

      <span className="text-slate-400 font-bold">:</span>

      <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-2.5 sm:px-3 py-2 min-w-[52px] sm:min-w-[60px] shadow-xs">
        <span className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
          {countdown.hours}
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
          Hours
        </span>
      </div>

      <span className="text-slate-400 font-bold">:</span>

      <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-2.5 sm:px-3 py-2 min-w-[52px] sm:min-w-[60px] shadow-xs">
        <span className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
          {countdown.minutes}
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
          Mins
        </span>
      </div>

      <span className="text-slate-400 font-bold">:</span>

      <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-2.5 sm:px-3 py-2 min-w-[52px] sm:min-w-[60px] shadow-xs">
        <span className="text-lg sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
          {countdown.seconds}
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
          Secs
        </span>
      </div>
    </div>
  );
};
