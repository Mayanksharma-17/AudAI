import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, FileText, Activity, Cpu, Award, Zap, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col justify-between scroll-smooth">
      {/* Navigation Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary-600 dark:text-primary-500 animate-pulse" />
          <span className="text-xl font-bold tracking-tight font-heading">Aud<span className="text-secondary-500">AI</span></span>
        </div>
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          <a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
          <a href="#technology" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Technology</a>
          <a href="#about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</a>
        </nav>
        <div>
          <Link to="/login" className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm transition-all shadow-md shadow-primary-500/10">
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-5xl mx-auto w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 mb-6 border border-primary-200/30 dark:border-primary-800/20">
          <Brain className="h-3.5 w-3.5" />
          Next-Generation Clinical Decision Support System
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 font-heading max-w-3xl leading-tight">
          AI-Powered <span className="gradient-text">Hearing Diagnosis</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Analyze Pure Tone Audiometry reports in seconds using Artificial Intelligence and generate professional clinical reports instantly. Designed for Audiologists & ENT Specialists.
        </p>

        <div className="flex justify-center">
          <Link to="/login" className="px-10 py-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition-all shadow-lg shadow-primary-500/20 hover:scale-[1.03]">
            Get Started
          </Link>
        </div>

        {/* Feature Section */}
        <section id="features" className="scroll-mt-24 pt-20 text-left w-full">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold font-heading tracking-tight mb-3">Key Features</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Everything required for modern audiometric diagnosis and disability certification.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 shadow-soft hover:shadow-premium transition-all">
              <div className="h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-6">
                <Brain className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-heading">AI Diagnostics</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Instantly predicts hearing loss type, severity level, and specific disability percentages with high confidence.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 shadow-soft hover:shadow-premium transition-all">
              <div className="h-10 w-10 rounded-xl bg-secondary-100 dark:bg-secondary-950/50 text-secondary-600 dark:text-secondary-400 flex items-center justify-center mb-6">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-heading">Professional Reports</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Export standard PDF reports complete with clinical metrics, frequency charts, and doctor's custom recommendations.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 shadow-soft hover:shadow-premium transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-heading">Secure Patient Archives</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Store, search, and audit patient record history in a secure clinic-compliant environment.
              </p>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section id="technology" className="scroll-mt-24 pt-24 text-left w-full">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest block mb-2">Machine Learning Architecture</span>
            <h2 className="text-3xl font-extrabold font-heading tracking-tight mb-3">AudAI Core Technology</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Powered by advanced Random Forest Classifiers and WHO statutory algorithms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base font-heading">Random Forest Classifier</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Trained on high-dimensional clinical PTA threshold data across 6 octave frequencies (250Hz to 8000Hz) with 97.3% validation classification accuracy.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-secondary-50 dark:bg-secondary-950/40 text-secondary-600 dark:text-secondary-400">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base font-heading">WHO & Statutory Disability Engine</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Automates monoaural and bilateral hearing impairment calculation based on official WHO & Ministry of Social Justice guidelines.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base font-heading">Feature Engineering Pipeline</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Computes Speech PTAs, High-Frequency Averages, Inter-Aural Asymmetry Index, and threshold slopes automatically.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base font-heading">ReportLab & Client Export Engine</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Produces medical PDF diagnostic reports complete with institutional headers, frequency tables, and physician sign-off sections.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="scroll-mt-24 pt-24 text-left w-full">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs font-bold text-primary-400 uppercase tracking-widest block">About AudAI</span>
              <h2 className="text-3xl font-extrabold font-heading tracking-tight text-white">
                Empowering ENT Specialists & Audiologists
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                AudAI was built as an intelligent Clinical Decision Support System (CDSS) to assist otolaryngologists, clinical audiologists, and disability certification boards in interpreting audiometric test data accurately and efficiently.
              </p>
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Clinical Decision Support (CDSS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>WHO Statutory Disability Standards</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Instant PDF & Diagnostic Sheets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Secure Patient Archives</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/50 py-8 px-6 text-center text-xs text-slate-400">
        <p>&copy; 2026 AudAI Systems Inc. Clinical Decision Support System. Designed for Audiologists & ENT Specialists.</p>
      </footer>
    </div>
  );
}
