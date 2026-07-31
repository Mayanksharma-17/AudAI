import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, description, trend, trendType = 'neutral' }) {
  return (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-6 shadow-soft hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 flex items-start justify-between">
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold font-heading text-slate-800 dark:text-slate-100 tracking-tight">
            {value}
          </span>
          {trend && (
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-[10px] font-bold ${
              trendType === 'positive' 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' 
                : trendType === 'negative'
                ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {trendType === 'positive' && <TrendingUp className="h-3 w-3" />}
              {trendType === 'negative' && <TrendingDown className="h-3 w-3" />}
              {trend}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {description}
          </p>
        )}
      </div>
      
      {Icon && (
        <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 flex items-center justify-center shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}
