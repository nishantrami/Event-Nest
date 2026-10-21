import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

  const variants = {
    primary: 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30 focus:ring-red-500 border border-transparent',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 focus:ring-slate-400',
    orange: 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 focus:ring-orange-400 border border-transparent',
    yellow: 'bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold shadow-md shadow-yellow-400/20 focus:ring-yellow-300 border border-transparent',
    white: 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 focus:ring-slate-400',
    outline: 'border border-slate-300 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-400 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 bg-transparent focus:ring-red-500',
    ghost: 'text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 focus:ring-slate-400',
    danger: 'bg-red-700 hover:bg-red-800 text-white shadow-md shadow-red-700/20 focus:ring-red-600 border border-transparent',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 focus:ring-emerald-500 border border-transparent',
    purple: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 focus:ring-purple-500 border border-purple-400/30',
    glass: 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md focus:ring-white/40',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
    icon: 'p-2.5 rounded-xl',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{typeof children === 'string' ? children : 'Loading...'}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};
