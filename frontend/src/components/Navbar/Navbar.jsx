import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Bell, Search } from 'lucide-react';
import { mockApi } from '../../services/api';

export default function Navbar({ toggleSidebar }) {
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [showNotifications, setShowNotifications] = useState(false);

  // Map path to page titles
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Clinical Dashboard';
    if (path === '/upload') return 'Upload PTA CSV';
    if (path === '/results') return 'AI Diagnostic Analysis';
    if (path === '/history') return 'Patient Archives';
    if (path === '/profile') return 'Doctor Profile';
    if (path === '/settings') return 'Settings & Privacy';
    return 'AudAI System';
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await mockApi.getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  // Sync theme with document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="h-16 border-b border-slate-200/60 dark:border-slate-800/40 bg-white dark:bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm shadow-slate-100 dark:shadow-none">
      
      {/* Title / Mobile Menu Toggle */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleSidebar} 
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold font-heading text-slate-800 dark:text-slate-100 tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* Global Actions */}
      <div className="flex items-center space-x-4">
        {/* Search Input (Hidden on mobile) */}
        <div className="relative hidden md:block w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search patient, records..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-xs transition-all"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50"
          title="Toggle color theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
        </button>

        {/* Notifications Icon with Indicator */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500" />
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-premium p-4 z-50 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-xs">Clinical Alerts</span>
                <span className="text-[10px] text-primary-600 dark:text-primary-400 font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2.5 items-start text-xs">
                  <div className="h-2 w-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">New patient analysis complete</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">John Doe (Moderate SNHL) - 5 mins ago</p>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start text-xs">
                  <div className="h-2 w-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-600 dark:text-slate-400">PDF report exported successfully</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Robert Chen (Severe Conductive) - 1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* Doctor Identity */}
        {profile && (
          <div className="flex items-center space-x-2">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-8 w-8 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none truncate max-w-[120px]">
                {profile.name}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight truncate">
                {profile.title}
              </span>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
