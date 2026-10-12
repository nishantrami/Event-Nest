import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse ${className}`}
      {...props}
    />
  );
};

export const EventCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs p-3 space-y-3">
      <Skeleton className="w-full h-48 sm:h-52 rounded-2xl" />
      <div className="p-2 space-y-2.5">
        <div className="flex justify-between items-center">
          <Skeleton className="w-20 h-5 rounded-full" />
          <Skeleton className="w-12 h-5 rounded-md" />
        </div>
        <Skeleton className="w-4/5 h-6 rounded-md" />
        <Skeleton className="w-3/5 h-4 rounded-md" />
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <Skeleton className="w-24 h-6 rounded-md" />
          <Skeleton className="w-24 h-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
