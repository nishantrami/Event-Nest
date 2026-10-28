import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) => {
  const base = 'inline-flex items-center font-bold rounded-full tracking-wide';

  const variants = {
    default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10',
    primary: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800',
    yellow: 'bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-semibold',
    trending: 'bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold border-none shadow-xs',
    white: 'bg-white text-slate-900 border border-slate-200 shadow-xs font-semibold',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60',
    danger: 'bg-rose-600 text-white font-bold',
    glass: 'bg-black/60 backdrop-blur-md text-white border border-white/20',
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-0.5 gap-1 uppercase tracking-wider',
    md: 'text-xs px-3 py-1 gap-1.5',
    lg: 'text-sm px-4 py-1.5 gap-2',
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`} {...props}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
};
