import React from 'react';

export default function Footer() {
  return (
    <footer className="py-6 px-8 border-t border-slate-200/60 dark:border-slate-800/40 text-center text-[11px] text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-950">
      <p>&copy; {new Date().getFullYear()} AudAI Clinical Support. All rights reserved. HIPAA Compliance Active.</p>
    </footer>
  );
}
