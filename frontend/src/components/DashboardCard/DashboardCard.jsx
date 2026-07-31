import React from 'react';

export default function DashboardCard({ children, className = '', title, subtitle, action }) {
  return (
    <div className={`ios-glass-card rounded-3xl transition-all duration-300 p-6 relative overflow-hidden backdrop-blur-xl hover:border-slate-300/80 dark:hover:border-slate-700/60 ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100/60 dark:border-slate-800/40">
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
