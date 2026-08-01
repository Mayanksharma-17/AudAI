import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X, 
  Sparkles,
  FileText,
  Activity
} from 'lucide-react';
import { mockApi } from '../../services/api';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    title: "AI Model Ready",
    message: "Random Forest Classifier (97.33% Accuracy) connected & active.",
    time: "Just now",
    type: "success",
    unread: true
  },
  {
    id: 2,
    title: "Sample Audiogram Analyzed",
    message: "Alice Johnson (Moderate Hearing Loss, 35.25% Disability) complete.",
    time: "10 mins ago",
    type: "info",
    unread: true
  },
  {
    id: 3,
    title: "WHO Guidelines Synced",
    message: "Pure tone statutory disability calculation rules active.",
    time: "1 hour ago",
    type: "system",
    unread: false
  }
];

export default function Navbar({ toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [toastMessage, setToastMessage] = useState(null);

  // Map path to page titles
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Clinical Dashboard';
    if (path === '/upload') return 'Upload PTA CSV';
    if (path === '/results') return 'AI Diagnostic Analysis';
    if (path === '/history') return 'Patient Archives';
    if (path === '/profile') return 'Clinician Profile';
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

  // Popup initial welcome toast on mount
  useEffect(() => {
    const toastTimer = setTimeout(() => {
      setToastMessage({
        title: "AudAI System Online",
        message: "AI Engine & ReportLab PDF Generator connected successfully.",
        type: "success"
      });
    }, 1200);

    return () => clearTimeout(toastTimer);
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

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 border-b border-white/40 dark:border-slate-800/60 bg-white/75 dark:bg-slate-950/70 backdrop-blur-2xl px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm shadow-slate-100/50 dark:shadow-none">
      
      {/* FLOATING TOAST POPUP NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-6 z-50 max-w-sm w-full bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 print:hidden no-print"
          >
            <div className="p-2 rounded-xl bg-primary-500/20 text-primary-400 shrink-0">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-xs font-bold font-heading text-white">{toastMessage.title}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">{toastMessage.message}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
        {/* Search Input */}
        <div className="relative hidden md:block w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search patient, records..."
            className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-bold transition-all shadow-sm placeholder-slate-400 dark:placeholder-slate-500"
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

        {/* Notifications Icon with Interactive Popup Panel */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 relative"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
            )}
          </button>
          
          {/* Notifications Dropdown Panel */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 md:w-96 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-premium p-4 z-50"
              >
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs font-heading text-slate-900 dark:text-white">System Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead}
                      className="text-[10px] font-bold text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div 
                        key={item.id}
                        className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                          item.unread 
                            ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/50' 
                            : 'bg-transparent border-transparent'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {item.type === 'success' ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : item.type === 'info' ? (
                            <Activity className="h-4 w-4 text-primary-500" />
                          ) : (
                            <Info className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{item.title}</p>
                            <span className="text-[9px] text-slate-400">{item.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{item.message}</p>
                        </div>
                        <button
                          onClick={() => clearNotification(item.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>AudAI Real-time Alerts</span>
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      setToastMessage({
                        title: "Live Notification Test",
                        message: "Test toast popup notification working cleanly!",
                        type: "info"
                      });
                    }}
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Test Popup Toast
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* Doctor Identity */}
        {profile && (
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img
              src={profile.avatar}
              alt=""
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'Doctor')}&background=2563eb&color=ffffff&size=100&bold=true`;
              }}
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
