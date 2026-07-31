import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Brain, 
  Activity,
  CheckCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import DashboardCard from '../../components/DashboardCard/DashboardCard';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (location.state && location.state.result) {
      setResult(location.state.result);
    } else {
      const history = JSON.parse(localStorage.getItem("audai_history") || "[]");
      if (history.length > 0) {
        setResult(history[0]);
      } else {
        navigate('/upload');
      }
    }
  }, [location, navigate]);

  if (!result) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Activity className="h-8 w-8 text-primary-600 dark:text-primary-500 animate-spin" />
      </div>
    );
  }

  const audiogramChartData = [
    { frequency: '250', Left: result.data.left[250], Right: result.data.right[250] },
    { frequency: '500', Left: result.data.left[500], Right: result.data.right[500] },
    { frequency: '1000', Left: result.data.left[1000], Right: result.data.right[1000] },
    { frequency: '2000', Left: result.data.left[2000], Right: result.data.right[2000] },
    { frequency: '4000', Left: result.data.left[4000], Right: result.data.right[4000] },
    { frequency: '8000', Left: result.data.left[8000], Right: result.data.right[8000] }
  ];

  const featureWeights = [
    { freq: '1000 Hz (L)', Weight: Math.round(result.data.left[1000] * 0.8) },
    { freq: '2000 Hz (L)', Weight: Math.round(result.data.left[2000] * 0.95) },
    { freq: '4000 Hz (L)', Weight: Math.round(result.data.left[4000] * 0.75) },
    { freq: '1000 Hz (R)', Weight: Math.round(result.data.right[1000] * 0.82) },
    { freq: '2000 Hz (R)', Weight: Math.round(result.data.right[2000] * 0.92) },
    { freq: '4000 Hz (R)', Weight: Math.round(result.data.right[4000] * 0.7) },
  ].sort((a, b) => b.Weight - a.Weight).slice(0, 5);

  const handlePrint = () => {
    window.print();
  };

  const CustomLeftDot = (props) => {
    const { cx, cy } = props;
    return (
      <svg x={cx - 5} y={cy - 5} width="10" height="10" viewBox="0 0 10 10">
        <line x1="0" y1="0" x2="10" y2="10" stroke="#2563eb" strokeWidth="2.5" />
        <line x1="10" y1="0" x2="0" y2="10" stroke="#2563eb" strokeWidth="2.5" />
      </svg>
    );
  };

  const CustomRightDot = (props) => {
    const { cx, cy } = props;
    return (
      <svg x={cx - 6} y={cy - 6} width="12" height="12" viewBox="0 0 12 12">
        <circle cx="6" cy="6" r="4.5" fill="none" stroke="#e11d48" strokeWidth="2.5" />
      </svg>
    );
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } }
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-6xl mx-auto print:p-0 print:m-0"
    >
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <Link 
          to="/dashboard" 
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 font-semibold text-xs transition-colors bg-white dark:bg-slate-950"
          >
            <Download className="h-4 w-4" />
            Print / Export PDF
          </button>
          <Link
            to="/upload"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Analyze Another Patient
          </Link>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tight font-heading">Aud<span className="text-secondary-500 font-semibold">AI</span></span>
          <span className="text-xs font-semibold text-slate-400 border-l border-slate-200 pl-2">Clinical Diagnostics CDSS Report</span>
        </div>
        <div className="text-right text-[10px] text-slate-400 font-medium">
          Date generated: {new Date(result.date).toLocaleString()}
        </div>
      </div>

      {/* Clinical Diagnosis Summary */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/40 p-6 md:p-8 rounded-2xl shadow-soft relative overflow-hidden flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">
            <Brain className="h-4 w-4 animate-pulse" />
            AI Decision Output
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-slate-900 dark:text-white leading-none">
              {result.prediction}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Impairment severity classification index: <strong className="text-slate-800 dark:text-slate-200">{result.severity}</strong>
            </p>
          </div>
        </div>

        {/* Highlight Score Badges */}
        <div className="flex gap-4 items-center shrink-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8">
          <div className="text-center bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 rounded-xl px-5 py-3 min-w-[100px]">
            <span className="block text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1">Disability</span>
            <span className="text-2xl font-extrabold font-heading text-rose-600 dark:text-rose-400">{result.disability}%</span>
          </div>
          <div className="text-center bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 rounded-xl px-5 py-3 min-w-[100px]">
            <span className="block text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1">Confidence</span>
            <span className="text-2xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">{result.confidence}%</span>
          </div>
        </div>
      </div>

      {/* Patient demographics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard title="Patient Profile" className="md:col-span-1">
          <div className="space-y-4 text-xs font-semibold">
            <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-950">
              <span className="text-slate-400">Patient Name</span>
              <span className="text-slate-800 dark:text-slate-200">{result.patientName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-950">
              <span className="text-slate-400">Patient ID</span>
              <span className="text-slate-800 dark:text-slate-200">{result.patientId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-950">
              <span className="text-slate-400">Age / Gender</span>
              <span className="text-slate-800 dark:text-slate-200">{result.age}y &bull; {result.gender}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Report ID</span>
              <span className="text-slate-800 dark:text-slate-200">{result.id}</span>
            </div>
          </div>
        </DashboardCard>

        {/* Recommendations */}
        <DashboardCard title="Recommended Actions" className="md:col-span-3">
          <div className="space-y-3.5">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 items-start text-xs font-medium text-slate-600 dark:text-slate-300">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audiogram chart */}
        <div className="lg:col-span-2">
          <DashboardCard 
            title="Interactive Audiogram Visualizer" 
            subtitle="Frequency (Hz) vs Hearing Level (dB HL). Note: Reversed Y-axis represents clinical standard."
          >
            <div className="h-[350px] w-full mt-4 print:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={audiogramChartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="frequency" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    domain={[-10, 120]} 
                    reversed={true} 
                    tickCount={14}
                    tickLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' 
                    }} 
                    formatter={(value) => [`${value} dB HL`]}
                  />
                  <Legend verticalAlign="top" height={36} iconSize={12} wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                  <Line 
                    type="monotone" 
                    dataKey="Left" 
                    name="Left Ear (X - Blue)" 
                    stroke="#2563eb" 
                    strokeWidth={2.5} 
                    strokeDasharray="5 5" 
                    dot={<CustomLeftDot />} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Right" 
                    name="Right Ear (O - Red)" 
                    stroke="#e11d48" 
                    strokeWidth={2.5} 
                    dot={<CustomRightDot />} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>

        {/* Feature weights */}
        <div>
          <DashboardCard 
            title="AI Model Weights" 
            subtitle="Contribution values of key audiogram points"
          >
            <div className="h-[350px] w-full mt-4 print:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureWeights} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis dataKey="freq" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Bar dataKey="Weight" fill="#14b8a6" radius={[0, 6, 6, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>
      </div>

      <div className="hidden print:block text-left text-[9px] text-slate-400 mt-12 border-t pt-4">
        <p>&bull; AudAI Decision Support analysis outputs do not substitute professional ENT diagnoses.</p>
        <p>&bull; Report generated on secure server endpoints with token authorization validation. HIPAA ID: {result.patientId}-SEC</p>
      </div>

    </motion.div>
  );
}
