import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { mockApi } from '../services/api';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Quick authentication check
  if (!mockApi.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 relative selection:bg-primary-500/20">
      
      {/* iOS Ambient Background Glow Blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary-500/15 dark:bg-primary-600/15 blur-[120px] z-0" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-secondary-500/15 dark:bg-secondary-500/15 blur-[140px] z-0" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[130px] z-0" />

      {/* Collapsible Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Content wrapper */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        {/* Navigation Headbar */}
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-8 bg-slate-50/40 dark:bg-slate-950/40 backdrop-blur-3xl">
          <Outlet />
        </main>
        
        {/* Clinic Info Footer */}
        <Footer />
      </div>
    </div>
  );
}
