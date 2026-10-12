import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) => {
  const base = 'inline-flex items-center font-medium rounded-full tracking-wide';

  const variants = {
    default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700',
    primary: 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800',
    yellow: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-950/60 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700 font-semibold',
    trending: 'bg-yellow-400 text-slate-950 font-black border-none',
    white: 'bg-white text-slate-900 border border-slate-200 shadow-xs font-semibold',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60',
    danger: 'bg-red-600 text-white font-bold',
    glass: 'bg-black/60 backdrop-blur-md text-white border border-white/20',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`} {...props}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
};
