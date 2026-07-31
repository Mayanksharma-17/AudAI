import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, description, trend, trendType = 'neutral' }) {
  return (
    <div className="ios-glass-card rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300/80 dark:hover:border-slate-700/60 flex items-start justify-between relative overflow-hidden backdrop-blur-xl">
      <div className="space-y-3">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest font-heading">
          {title}
        </span>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl lg:text-4xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight leading-none">
            {value}
          </span>
          {trend && (
            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              trendType === 'positive' 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                : trendType === 'negative'
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
            }`}>
              {trendType === 'positive' && <TrendingUp className="h-3 w-3" />}
              {trendType === 'negative' && <TrendingDown className="h-3 w-3" />}
              {trend}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            {description}
          </p>
        )}
      </div>
      
      {Icon && (
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center shadow-sm shrink-0 backdrop-blur-md">
          <Icon className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}
