import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UploadCloud, 
  History, 
  User, 
  Settings, 
  LogOut, 
  X,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { mockApi } from '../../services/api';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await mockApi.logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Audiogram', path: '/upload', icon: UploadCloud },
    { name: 'Prediction History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={toggleSidebar} 
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-md lg:hidden transition-all duration-300"
        />
      )}

      {/* Sidebar Container with iOS Frosted Glass */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-white/50 dark:border-slate-800/60 bg-white/75 dark:bg-slate-950/70 backdrop-blur-2xl transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-800/40">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 shadow-md shadow-primary-500/20">
                <Activity className="h-5 w-5 text-white animate-pulse" />
              </div>
              <span className="text-xl font-bold tracking-tight font-heading">
                Aud<span className="text-secondary-500 font-semibold">AI</span>
              </span>
            </div>
            {/* Mobile close button */}
            <button 
              onClick={toggleSidebar} 
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all ${
                      isActive 
                        ? 'bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 border border-primary-500/20 shadow-sm backdrop-blur-md font-bold scale-[1.02]' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent'
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer / Account section */}
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/40">
            <div className="flex items-center gap-2 px-4 py-2.5 mb-2 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40 backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate">
                Clinical Mode Active
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 transition-all border border-transparent hover:border-rose-200/40 dark:hover:border-rose-900/40"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
