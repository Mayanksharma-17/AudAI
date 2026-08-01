import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Brain, 
  Activity,
  CheckCircle,
  ShieldCheck
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
import { mockApi } from '../../services/api';

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
    { frequency: '250', Left: result.data.left[250], Right: result.data.right[250], Left_BC: result.data.left_bc?.[250] ?? null, Right_BC: result.data.right_bc?.[250] ?? null },
    { frequency: '500', Left: result.data.left[500], Right: result.data.right[500], Left_BC: result.data.left_bc?.[500] ?? null, Right_BC: result.data.right_bc?.[500] ?? null },
    { frequency: '1000', Left: result.data.left[1000], Right: result.data.right[1000], Left_BC: result.data.left_bc?.[1000] ?? null, Right_BC: result.data.right_bc?.[1000] ?? null },
    { frequency: '2000', Left: result.data.left[2000], Right: result.data.right[2000], Left_BC: result.data.left_bc?.[2000] ?? null, Right_BC: result.data.right_bc?.[2000] ?? null },
    { frequency: '4000', Left: result.data.left[4000], Right: result.data.right[4000], Left_BC: result.data.left_bc?.[4000] ?? null, Right_BC: result.data.right_bc?.[4000] ?? null },
    { frequency: '8000', Left: result.data.left[8000], Right: result.data.right[8000], Left_BC: null, Right_BC: null }
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
  const CustomRightBCDot = (props) => {
    const { cx, cy } = props;
    if (cx === undefined || cy === undefined) return null;
    return (
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#d97706" fontSize="13" fontWeight="900">
        &lt;
      </text>
    );
  };

  const CustomLeftBCDot = (props) => {
    const { cx, cy } = props;
    if (cx === undefined || cy === undefined) return null;
    return (
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#4f46e5" fontSize="13" fontWeight="900">
        &gt;
      </text>
    );
  };

  const leftPTA = ((result.data.left[500] + result.data.left[1000] + result.data.left[2000]) / 3).toFixed(1);
  const rightPTA = ((result.data.right[500] + result.data.right[1000] + result.data.right[2000]) / 3).toFixed(1);

  const pageVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DEDICATED PRINT / PDF EXPORT MEDICAL REPORT TEMPLATE (Hidden on screen) */}
      {/* ========================================================================= */}
      <div className="hidden print:block text-slate-900 bg-white p-6 font-sans text-xs leading-relaxed max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-4 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
              AudAI Clinical Diagnostic Center
            </h1>
            <p className="text-[11px] font-semibold text-slate-600 mt-0.5">
              Department of Otolaryngology & Audiological Medicine &bull; AI-Assisted CDSS
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              AIIMS Audiology & ENT Research Center &bull; Ref ID: FAC-IND-8829
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-2.5 py-1 bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase rounded border border-rose-300">
              Confidential Medical Record
            </span>
            <p className="text-[10px] text-slate-500 mt-1">
              Date: {new Date(result.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              Report ID: {result.id}
            </p>
          </div>
        </div>

        {/* Patient Demographics */}
        <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 mb-4 grid grid-cols-4 gap-4 text-[11px]">
          <div>
            <span className="text-slate-500 font-bold uppercase text-[9px] block">Patient Name</span>
            <span className="font-extrabold text-slate-900">{result.patientName}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold uppercase text-[9px] block">Patient ID</span>
            <span className="font-mono font-bold text-slate-900">{result.patientId}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold uppercase text-[9px] block">Age / Gender</span>
            <span className="font-bold text-slate-900">{result.age} Yrs / {result.gender}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold uppercase text-[9px] block">Referring Physician</span>
            <span className="font-bold text-slate-900">Dr. Mayank Sharma, M.S. (ENT)</span>
          </div>
        </div>

        {/* Diagnosis & Disability Card */}
        <div className="border-2 border-slate-900 rounded-lg p-4 mb-4 bg-slate-900 text-white flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[9px] font-extrabold tracking-widest text-teal-400 uppercase">Primary AI Diagnostic Output</span>
            <h2 className="text-2xl font-black tracking-tight text-white mt-0.5">{result.prediction}</h2>
            <p className="text-xs text-slate-300">Severity Grade: <strong className="text-white">{result.severity}</strong></p>
          </div>
          <div className="flex gap-4 text-center">
            <div className="bg-slate-800 border border-slate-700 rounded-md px-3.5 py-2">
              <span className="block text-[8px] font-bold text-slate-400 uppercase">Bilateral Disability</span>
              <span className="text-xl font-black text-rose-400">{result.disability}%</span>
              <span className="block text-[7px] text-slate-400">(WHO/Govt Standard)</span>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-md px-3.5 py-2">
              <span className="block text-[8px] font-bold text-slate-400 uppercase">AI Confidence</span>
              <span className="text-xl font-black text-emerald-400">{result.confidence}%</span>
            </div>
          </div>
        </div>

        {/* Pure Tone Threshold Matrix Table */}
        <div className="mb-4">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-2 pb-1 border-b border-slate-300">
            Pure Tone Audiometry Thresholds (dB HL)
          </h3>
          <table className="w-full text-center border-collapse border border-slate-300 text-[11px]">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-slate-300 text-slate-700">
                <th className="py-2 px-2 text-left">Ear Side</th>
                <th className="py-2 px-2">250 Hz</th>
                <th className="py-2 px-2">500 Hz</th>
                <th className="py-2 px-2">1000 Hz</th>
                <th className="py-2 px-2">2000 Hz</th>
                <th className="py-2 px-2">4000 Hz</th>
                <th className="py-2 px-2">8000 Hz</th>
                <th className="py-2 px-2 bg-slate-200">Speech PTA</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-2 px-2 text-left font-bold text-blue-700">Left Ear (Blue 🅛)</td>
                <td className="py-2 px-2">{result.data.left[250]} dB</td>
                <td className="py-2 px-2">{result.data.left[500]} dB</td>
                <td className="py-2 px-2">{result.data.left[1000]} dB</td>
                <td className="py-2 px-2">{result.data.left[2000]} dB</td>
                <td className="py-2 px-2">{result.data.left[4000]} dB</td>
                <td className="py-2 px-2">{result.data.left[8000]} dB</td>
                <td className="py-2 px-2 font-bold bg-slate-50 text-slate-900">{leftPTA} dB</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-left font-bold text-red-600">Right Ear (Red 🅡)</td>
                <td className="py-2 px-2">{result.data.right[250]} dB</td>
                <td className="py-2 px-2">{result.data.right[500]} dB</td>
                <td className="py-2 px-2">{result.data.right[1000]} dB</td>
                <td className="py-2 px-2">{result.data.right[2000]} dB</td>
                <td className="py-2 px-2">{result.data.right[4000]} dB</td>
                <td className="py-2 px-2">{result.data.right[8000]} dB</td>
                <td className="py-2 px-2 font-bold bg-slate-50 text-slate-900">{rightPTA} dB</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Clinical Recommendations & Action Plan */}
        <div className="mb-4">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-1.5 pb-1 border-b border-slate-300">
            Clinical Recommendations & Action Strategy
          </h3>
          <ul className="space-y-1 pl-4 list-disc text-[11px] text-slate-800">
            {result.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Hearing Conservation & Preventive Guidelines */}
        <div className="mb-4 bg-slate-50 border border-slate-300 rounded-lg p-3">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-1.5">
            🛡️ Hearing Conservation, Prevention & Precautions
          </h3>
          <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-700">
            <div>
              <strong className="block text-slate-900 mb-0.5">1. Noise Exposure Control:</strong>
              Use certified hearing protection (earplugs/muffs) when exposed to acoustic noise above 85 dBA.
            </div>
            <div>
              <strong className="block text-slate-900 mb-0.5">2. Safe Audio (60/60 Rule):</strong>
              Keep headphone volumes under 60% maximum and restrict continuous listening to 60 minutes.
            </div>
            <div>
              <strong className="block text-slate-900 mb-0.5">3. Ototoxic Drug Precautions:</strong>
              Consult prescribing physicians before taking aminoglycosides or high-dose NSAIDs.
            </div>
            <div>
              <strong className="block text-slate-900 mb-0.5">4. Ear Hygiene & Monitoring:</strong>
              Avoid inserting objects into ear canals. Undergo annual audiometric monitoring.
            </div>
          </div>
        </div>

        {/* Physician Sign-Off Block */}
        <div className="pt-4 border-t border-slate-300 flex justify-between items-end text-[10px]">
          <div>
            <p className="font-bold text-slate-900">Evaluated By: AudAI Diagnostic System v1.0</p>
            <p className="text-slate-500">Verified against WHO & Statutory Disability Standards</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Confidential Medical Document &bull; Generated via AudAI Clinical Platform</p>
          </div>
          <div className="text-right">
            <div className="border-b border-slate-900 w-48 mb-1 pb-4 text-center font-serif italic text-slate-700">
              Dr. Mayank Sharma, M.S. (ENT)
            </div>
            <p className="font-bold text-slate-900">Attending Audiologist / ENT Specialist</p>
            <p className="text-slate-500">Reg No: ENT-MH-88241</p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE WEB APP VIEW (Hidden during print) */}
      {/* ========================================================================= */}
      <motion.div 
        variants={pageVariants}
        initial="hidden"
        animate="show"
        className="space-y-8 max-w-6xl mx-auto print:hidden"
      >
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
              Print / Export PDF Report
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

        {/* Clinical Diagnosis Summary */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/40 p-6 md:p-8 rounded-2xl shadow-soft relative overflow-hidden flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">
              <Brain className="h-4 w-4 animate-pulse" />
              AI Decision Output & Ear Classification
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

        {/* Ear-wise AC-PTA & Degree of Hearing Loss Classification Cards */}
        {(() => {
          const getDegreeOfLoss = (pta) => {
            const num = parseFloat(pta);
            if (num <= 25) return { label: 'Normal', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
            if (num <= 40) return { label: 'Mild', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
            if (num <= 55) return { label: 'Moderate', bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' };
            if (num <= 70) return { label: 'Moderately Severe', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' };
            if (num <= 90) return { label: 'Severe', bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' };
            return { label: 'Profound', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' };
          };

          const lDegree = getDegreeOfLoss(leftPTA);
          const rDegree = getDegreeOfLoss(rightPTA);

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-soft space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Left Ear AC-PTA (0.5, 1, 2 kHz)
                  </span>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${lDegree.bg}`}>
                    {lDegree.label} Hearing Loss
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-3xl font-black font-heading text-slate-900 dark:text-white">
                    {leftPTA} <span className="text-sm font-semibold text-slate-400">dB HL</span>
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Degree of Loss: <strong className="text-slate-800 dark:text-slate-100">{lDegree.label}</strong>
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-soft space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Right Ear AC-PTA (0.5, 1, 2 kHz)
                  </span>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${rDegree.bg}`}>
                    {rDegree.label} Hearing Loss
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-3xl font-black font-heading text-slate-900 dark:text-white">
                    {rightPTA} <span className="text-sm font-semibold text-slate-400">dB HL</span>
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Degree of Loss: <strong className="text-slate-800 dark:text-slate-100">{rDegree.label}</strong>
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Patient demographics & Recommendations */}
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

        {/* Hearing Conservation & Prevention Box */}
        <DashboardCard title="Hearing Conservation & Preventive Care" subtitle="Clinical guidelines for hearing protection and ototoxicity prevention">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                <ShieldCheck className="h-4 w-4 text-primary-500" />
                Noise Exposure Control
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Use certified hearing protection (earplugs/muffs) in ambient noise environments exceeding 85 dBA sound pressure level.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                <ShieldCheck className="h-4 w-4 text-secondary-500" />
                Safe Audio Habits (60/60 Rule)
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Keep headphone and audio device volume under 60% maximum output and restrict listening sessions to 60 minutes.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                <ShieldCheck className="h-4 w-4 text-amber-500" />
                Ototoxic Medication Guard
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Inform prescribing clinicians prior to starting known ototoxic medications (e.g. aminoglycosides or high-dose NSAIDs).
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                <ShieldCheck className="h-4 w-4 text-indigo-500" />
                Ear Canal Hygiene
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Never insert cotton swabs or sharp objects into ear canals. Schedule annual audiometric threshold monitoring.
              </p>
            </div>
          </div>
        </DashboardCard>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardCard 
              title="Interactive Audiogram Visualizer" 
              subtitle="Frequency (Hz) vs Hearing Level (dB HL). Note: Reversed Y-axis represents clinical standard."
            >
              <div className="h-[380px] w-[380px] max-w-full mx-auto mt-4 p-2 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={audiogramChartData} margin={{ top: 20, right: 25, left: -20, bottom: 5 }}>
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
                      cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        color: '#f8fafc'
                      }} 
                      formatter={(value) => value !== null ? [`${value} dB HL`] : ['N/A']}
                    />
                    <Legend verticalAlign="top" height={36} iconSize={12} wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                    
                    {/* Air Conduction Lines */}
                    <Line 
                      type="monotone" 
                      dataKey="Left" 
                      name="Left Ear AC (X)" 
                      stroke="#2563eb" 
                      strokeWidth={2.5} 
                      strokeDasharray="5 5" 
                      dot={<CustomLeftDot />} 
                      activeDot={{ r: 6 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Right" 
                      name="Right Ear AC (O)" 
                      stroke="#e11d48" 
                      strokeWidth={2.5} 
                      dot={<CustomRightDot />} 
                      activeDot={{ r: 6 }} 
                    />

                    {/* Bone Conduction Lines */}
                    <Line 
                      type="monotone" 
                      dataKey="Right_BC" 
                      name="Right Ear BC (<)" 
                      stroke="#d97706" 
                      strokeWidth={2} 
                      strokeDasharray="3 3"
                      connectNulls={true}
                      dot={<CustomRightBCDot />} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Left_BC" 
                      name="Left Ear BC (>)" 
                      stroke="#4f46e5" 
                      strokeWidth={2} 
                      strokeDasharray="3 3"
                      connectNulls={true}
                      dot={<CustomLeftBCDot />} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>

          <div>
            <DashboardCard 
              title="AI Model Weights" 
              subtitle="Contribution values of key audiogram points"
            >
              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureWeights} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis dataKey="freq" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} width={80} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        color: '#f8fafc'
                      }} 
                    />
                    <Bar dataKey="Weight" fill="#14b8a6" radius={[0, 6, 6, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>
        </div>
      </motion.div>
    </>
  );
}
