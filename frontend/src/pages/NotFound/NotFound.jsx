import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <ShieldAlert className="h-16 w-16 text-rose-500 mb-6 animate-bounce" />
      <h1 className="text-4xl font-extrabold font-heading mb-2">404 - Page Not Found</h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        The resource you are looking for does not exist or has been moved to another clinical department.
      </p>
      <Link to="/" className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all shadow-md shadow-primary-500/10">
        Return Home
      </Link>
    </div>
  );
}
