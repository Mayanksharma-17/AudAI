import React from 'react';

export default function DashboardCard({ children, className = '', title, subtitle, action }) {
  return (
    <div className={`bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl shadow-soft shadow-premium hover:shadow-soft/80 dark:hover:shadow-none transition-all p-6 ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between mb-6 pb-2">
          <div>
            {title && (
              <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
