import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Activity, 
  Brain, 
  FileText, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Download,
  Eye
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { mockApi } from '../../services/api';
import StatCard from '../../components/StatCard/StatCard';
import DashboardCard from '../../components/DashboardCard/DashboardCard';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Quick statistics calculation
  const totalPatients = history.length + 138;
  const predictionsToday = history.filter(h => {
    const today = new Date().toISOString().split('T')[0];
    return h.date.startsWith(today);
  }).length + 4;
  
  const avgConfidence = history.length > 0 
    ? Math.round((history.reduce((acc, h) => acc + h.confidence, 0) / history.length) * 10) / 10 
    : 93.4;
    
  const totalReports = history.length + 84;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyData = await mockApi.getHistory();
        const profileData = await mockApi.getProfile();
        setHistory(historyData);
        setProfile(profileData);
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = [
    { name: 'Mon', Predictions: 12, AvgConfidence: 91 },
    { name: 'Tue', Predictions: 18, AvgConfidence: 94 },
    { name: 'Wed', Predictions: 15, AvgConfidence: 92 },
    { name: 'Thu', Predictions: 22, AvgConfidence: 95 },
    { name: 'Fri', Predictions: 30, AvgConfidence: 93 },
    { name: 'Sat', Predictions: 8, AvgConfidence: 96 },
    { name: 'Sun', Predictions: 5, AvgConfidence: 94 }
  ];

  const distributionData = [
    { name: 'Sensorineural', value: 58 },
    { name: 'Conductive', value: 24 },
    { name: 'Mixed', value: 12 },
    { name: 'Normal', value: 6 }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Activity className="h-8 w-8 text-primary-600 dark:text-primary-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading Clinical Parameters...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Header Greeting Banner */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ios-glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden backdrop-blur-2xl border border-white/50 dark:border-slate-800/60 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-indigo-500/10 pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 mb-1">
            <Brain className="h-3.5 w-3.5 animate-pulse" />
            AI Decision Support Active
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
            Welcome back, <span className="gradient-text">{profile?.name || 'Dr. Mayank'}</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium">
            Clinical Diagnostic System &bull; {profile?.hospital || 'AIIMS Audiology & ENT Center'}
          </p>
        </div>
        <Link 
          to="/upload" 
          className="relative z-10 flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-primary-500/25 hover:scale-[1.03] transition-all"
        >
          <Plus className="h-4 w-4" />
          Analyze New PTA CSV
        </Link>
      </motion.div>

      {/* Metric Cards Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard 
          title="Patients Analysed" 
          value={totalPatients} 
          icon={Users} 
          trend="+12%" 
          trendType="positive"
          description="Total clinical records"
        />
        <StatCard 
          title="Predictions Today" 
          value={predictionsToday} 
          icon={Brain} 
          trend="+4" 
          trendType="positive"
          description="AI decisions generated"
        />
        <StatCard 
          title="Average Confidence" 
          value={`${avgConfidence}%`} 
          icon={TrendingUp} 
          trend="+1.2%" 
          trendType="positive"
          description="Classification metrics accuracy"
        />
        <StatCard 
          title="Reports Generated" 
          value={totalReports} 
          icon={FileText} 
          trend="+8" 
          trendType="positive"
          description="PDF exports saved"
        />
      </motion.div>

      {/* Main Charts Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Weekly Predictions */}
        <div className="lg:col-span-2">
          <DashboardCard 
            title="Weekly Prediction Volume" 
            subtitle="Clinical analysis counts handled by AudAI over the past 7 days"
          >
            <div className="h-[320px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPredictions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px', 
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      color: '#f8fafc'
                    }} 
                    itemStyle={{ color: '#38bdf8', fontWeight: 600 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Predictions" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPredictions)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>

        {/* Diagnostic Distribution */}
        <div>
          <DashboardCard 
            title="Diagnosis Distribution" 
            subtitle="Summary classification statistics (%)"
          >
            <div className="h-[320px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} width={80} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px', 
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      color: '#f8fafc'
                    }} 
                    itemStyle={{ color: '#2dd4bf', fontWeight: 600 }}
                  />
                  <Bar dataKey="value" fill="#14b8a6" radius={[0, 8, 8, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>
      </motion.div>

      {/* Recent Patients */}
      <motion.div 
        variants={itemVariants}
      >
        <DashboardCard 
          title="Recent Patients Analysed" 
          subtitle="Showing latest diagnosis and disability profiles"
          action={
            <Link 
              to="/history" 
              className="flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
            >
              View All Patients
              <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800/40 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Age / Gender</th>
                  <th className="px-6 py-4">Diagnosis</th>
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">Disability %</th>
                  <th className="px-6 py-4">Confidence</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {history.slice(0, 5).map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {patient.patientName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ID: {patient.patientId} &bull; {patient.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {patient.age}y &bull; {patient.gender}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border border-primary-200/20">
                        {patient.prediction}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        patient.severity === 'Normal'
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/20'
                          : patient.severity === 'Severe' || patient.severity === 'Profound'
                          ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200/20'
                          : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/20'
                      }`}>
                        {patient.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                      {patient.disability}%
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {patient.confidence}%
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link to="/results" state={{ result: patient }} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="View details">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </motion.div>
    </motion.div>
  );
}
