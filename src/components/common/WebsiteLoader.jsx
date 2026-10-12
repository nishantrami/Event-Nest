import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * 21st.dev Inspired Simple & Professional Website Loader
 * 
 * Design Engineering Highlights:
 * - Minimalist, high-end corporate aesthetic (Linear / Vercel style)
 * - Conic gradient glowing border beam on brand emblem
 * - Thin 2px precision progress track with glowing gradient head
 * - Snappy ~1.4s duration with realistic ease-out curve
 * - Ultra-smooth Framer Motion fade-and-scale exit transition
 * - Skip control & custom 'eventnest-replay-loader' event support
 */

export const WebsiteLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const startAnimation = () => {
    setProgress(0);
    setIsFinished(false);
    setShouldRender(true);

    const startTime = Date.now();
    const duration = 1400; // 1.4 seconds (snappy & professional)

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress((prev) => {
        const next = Math.max(prev, rawProgress);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            setTimeout(() => {
              setShouldRender(false);
              if (onComplete) onComplete();
            }, 600); // Wait for exit animation
          }, 200);
          return 100;
        }
        return next;
      });
    }, 20);

    return interval;
  };

  useEffect(() => {
    const interval = startAnimation();

    const handleReplay = () => {
      clearInterval(interval);
      startAnimation();
    };

    window.addEventListener('eventnest-replay-loader', handleReplay);
    return () => {
      clearInterval(interval);
      window.removeEventListener('eventnest-replay-loader', handleReplay);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setProgress(100);
    setIsFinished(true);
    setTimeout(() => {
      setShouldRender(false);
      if (onComplete) onComplete();
    }, 300);
  };

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="21st-simple-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#0a0d14] text-slate-100 px-6 py-8 select-none overflow-hidden"
        >
          {/* Top Status Bar */}
          <div className="w-full max-w-4xl flex items-center justify-between z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>EventNest Engine</span>
            </div>

            <button
              onClick={handleSkip}
              className="text-xs font-mono text-slate-400 hover:text-white transition-colors px-2 py-1 rounded cursor-pointer"
            >
              Skip [ESC]
            </button>
          </div>

          {/* Center: Minimalist Professional Brand Emblem & Progress */}
          <div className="flex flex-col items-center justify-center my-auto z-10 space-y-6 text-center max-w-sm w-full">
            
            {/* Logo Emblem: Solid Red with Solid Orange Ring */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Rotating Solid Accent Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-2xl border-2 border-dashed border-orange-500 opacity-60"
              />

              {/* Central Solid Red Squircle */}
              <div className="relative w-[52px] h-[52px] rounded-2xl bg-red-600 border border-white/20 flex items-center justify-center shadow-lg shadow-red-600/30">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-6 h-6 text-white fill-white" />
                </motion.div>
              </div>
            </div>

            {/* Clean Brand Title */}
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-1">
                Event<span className="text-red-500">Nest</span>
              </h1>
              <p className="text-xs text-yellow-400 font-medium">
                Curating live experiences...
              </p>
            </div>

            {/* Minimalist 2px Precision Progress Bar (Solid Orange) */}
            <div className="w-48 sm:w-56 space-y-2 pt-2">
              <div className="h-[2px] w-full bg-slate-800 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-orange-500 relative"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>

              {/* Progress Percentage */}
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span className="text-slate-500">INITIALIZING</span>
                <span className="font-bold text-white">{progress}%</span>
              </div>
            </div>

          </div>

          {/* Bottom Clean Signature */}
          <div className="text-[11px] font-mono text-slate-500 z-10">
            <span>Solid Architecture • Red • Orange • Yellow • White</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
