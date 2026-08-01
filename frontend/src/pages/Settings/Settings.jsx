import React, { useState } from 'react';
import { 
  Save,
  CheckCircle
} from 'lucide-react';
import DashboardCard from '../../components/DashboardCard/DashboardCard';

export default function Settings() {
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState({
    ptaFormula: '4freq', // 3freq or 4freq
    hipaaMasking: true,
    autoLogout: '15', // minutes
    enableFeatureImportance: true,
    clinicalLogs: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div>
        <h2 className="text-3xl font-extrabold font-heading text-slate-800 dark:text-slate-100 tracking-tight">
          System Settings
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure diagnostic formulas, HIPAA security rules, and workspace parameters.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>Clinical configurations saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Diagnostics Calculations */}
        <DashboardCard 
          title="Diagnostic Threshold Settings" 
          subtitle="Configure pure tone averages and metrics calculations."
        >
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Pure Tone Average (PTA) Formula</h4>
                <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                  Select which frequency channels are calculated for standard patient hearing thresholds reviews.
                </p>
              </div>
              <div className="shrink-0 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, ptaFormula: '3freq' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    settings.ptaFormula === '3freq'
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  3-Frequency (0.5, 1, 2 kHz)
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, ptaFormula: '4freq' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    settings.ptaFormula === '4freq'
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  4-Frequency (0.5, 1, 2, 4 kHz)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-6">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Feature Importance Visualizations</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Include SHAP weight calculations inside generated reports dashboards.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('enableFeatureImportance')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableFeatureImportance ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enableFeatureImportance ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </DashboardCard>

        {/* HIPAA */}
        <DashboardCard 
          title="HIPAA Security & Privacy" 
          subtitle="Enforce local data encryption and privacy parameters."
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">PHI Patient Name Masking</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Partially redact patient names inside public logs (e.g. "J** D**") to protect Patient Health Information.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('hipaaMasking')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.hipaaMasking ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.hipaaMasking ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-6">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Automatic Inactivity Logout</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Log the active clinical user session out of AudAI after periods of mouse inactivity.
                </p>
              </div>
              <select
                value={settings.autoLogout}
                onChange={(e) => setSettings({ ...settings, autoLogout: e.target.value })}
                className="px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              >
                <option value="5">5 Minutes</option>
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>
          </div>
        </DashboardCard>

        {/* Save */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <Save className="h-4 w-4" />
            Save Clinic Settings
          </button>
        </div>

      </form>

    </div>
  );
}
