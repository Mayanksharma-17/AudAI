import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Mail, Lock, ShieldCheck } from 'lucide-react';
import { mockApi } from '../../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('s.jenkins@metaclinic.ai');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await mockApi.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Left side */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-slate-950 to-slate-950 z-0"></div>
        <div className="relative z-10 flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary-500" />
          <span className="text-xl font-bold tracking-tight font-heading">Aud<span className="text-secondary-400">AI</span></span>
        </div>
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-extrabold font-heading mb-6 leading-tight">
            Advanced Clinical Decision Support for Audiology
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Helping clinicians analyze pure tone audiograms, calculate impairment severity levels, and generate standard reports with AI-powered diagnostics.
          </p>
        </div>
        <div className="relative z-10 text-xs text-slate-500 flex items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          HIPAA Compliant Data Architecture (Simulated)
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="flex items-center space-x-2 md:hidden mb-6">
              <Activity className="h-6 w-6 text-primary-600 dark:text-primary-500" />
              <span className="text-xl font-bold tracking-tight font-heading">Aud<span className="text-secondary-500">AI</span></span>
            </div>
            <h2 className="text-3xl font-extrabold font-heading tracking-tight">Clinician Login</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Welcome back. Enter your clinic credentials to access the dashboard.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm rounded-xl border border-rose-100 dark:border-rose-900/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-semibold transition-all shadow-sm placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="s.jenkins@metaclinic.ai"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-semibold transition-all shadow-sm placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-primary-600 border-slate-300 dark:border-slate-800 rounded focus:ring-primary-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-500 dark:text-slate-400">
                Remember my workspace
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-md shadow-primary-500/10 disabled:opacity-50"
            >
              {isLoading ? "Authenticating..." : "Sign In to AudAI"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                Create clinic account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
