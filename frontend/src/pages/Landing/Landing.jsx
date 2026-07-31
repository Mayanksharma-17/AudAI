import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, FileText, Activity } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col justify-between">
      {/* Navigation */}
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
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 mb-6 border border-primary-200/30 dark:border-primary-800/20">
          <Brain className="h-3 w-3" />
          Next-Generation Clinical Decision Support
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-heading max-w-3xl leading-none">
          AI-Powered <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">Hearing Diagnosis</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Analyze Pure Tone Audiometry reports in seconds using Artificial Intelligence and generate professional clinical reports instantly. Designed for Audiologists & ENT Specialists.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login" className="px-8 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold transition-all shadow-lg hover:bg-slate-800 dark:hover:bg-slate-100 hover:scale-[1.02]">
            Get Started
          </Link>
          <button className="px-8 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            Watch Demo
          </button>
        </div>

        {/* Feature Cards */}
        <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left w-full">
          <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 shadow-soft hover:shadow-premium transition-all">
            <div className="h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-6">
              <Brain className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold mb-2 font-heading">AI Diagnosis</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Instantly predicts hearing loss type, severity level, and calculating specific disability percentages with high confidence.
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
            <h3 className="text-lg font-bold mb-2 font-heading">Secure Patient History</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Store, search, and audit patient records history in a secure clinic-compliant environment.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/50 py-8 px-6 text-center text-xs text-slate-400">
        <p>&copy; 2026 AudAI Systems Inc. Clinical Decision Support System. Demo purposes only.</p>
      </footer>
    </div>
  );
}
