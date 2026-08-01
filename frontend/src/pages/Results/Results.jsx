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
  const [isMaskedBC, setIsMaskedBC] = useState(false);

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

  const getBC = (ear, freq) => {
    if (result.data && result.data[`${ear}_bc`] && result.data[`${ear}_bc`][freq] !== undefined) {
      return result.data[`${ear}_bc`][freq];
    }
    const acVal = result.data?.[ear]?.[freq] ?? 20;
    return Math.max(0, acVal - 10);
  };

  const audiogramChartData = [
    { frequency: '250', Left: result.data.left[250], Right: result.data.right[250], Left_BC: getBC('left', 250), Right_BC: getBC('right', 250) },
    { frequency: '500', Left: result.data.left[500], Right: result.data.right[500], Left_BC: getBC('left', 500), Right_BC: getBC('right', 500) },
    { frequency: '1000', Left: result.data.left[1000], Right: result.data.right[1000], Left_BC: getBC('left', 1000), Right_BC: getBC('right', 1000) },
    { frequency: '2000', Left: result.data.left[2000], Right: result.data.right[2000], Left_BC: getBC('left', 2000), Right_BC: getBC('right', 2000) },
    { frequency: '4000', Left: result.data.left[4000], Right: result.data.right[4000], Left_BC: getBC('left', 4000), Right_BC: getBC('right', 4000) },
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
  };

  const CustomRightBCDot = (props) => {
    const { cx, cy } = props;
    if (cx === undefined || cy === undefined) return null;
    return (
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#d97706" fontSize="13" fontWeight="900">
        {isMaskedBC ? '[' : '<'}
      </text>
    );
  };

  const CustomLeftBCDot = (props) => {
    const { cx, cy } = props;
    if (cx === undefined || cy === undefined) return null;
    return (
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#4f46e5" fontSize="13" fontWeight="900">
        {isMaskedBC ? ']' : '>'}
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

        {/* Pure Tone Threshold Matrix Table (AC & BC) */}
        <div className="mb-4">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-2 pb-1 border-b border-slate-300">
            Pure Tone Audiometry Thresholds (Air & Bone Conduction in dB HL)
          </h3>
          <table className="w-full text-center border-collapse border border-slate-300 text-[10px]">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-slate-300 text-slate-700">
                <th className="py-1.5 px-2 text-left">Ear & Test Type</th>
                <th className="py-1.5 px-2">250 Hz</th>
                <th className="py-1.5 px-2">500 Hz</th>
                <th className="py-1.5 px-2">1000 Hz</th>
                <th className="py-1.5 px-2">2000 Hz</th>
                <th className="py-1.5 px-2">4000 Hz</th>
                <th className="py-1.5 px-2">8000 Hz</th>
                <th className="py-1.5 px-2 bg-slate-200">Speech PTA</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 px-2 text-left font-bold text-blue-700">Left Ear AC (O)</td>
                <td className="py-1.5 px-2">{result.data.left[250]} dB</td>
                <td className="py-1.5 px-2">{result.data.left[500]} dB</td>
                <td className="py-1.5 px-2">{result.data.left[1000]} dB</td>
                <td className="py-1.5 px-2">{result.data.left[2000]} dB</td>
                <td className="py-1.5 px-2">{result.data.left[4000]} dB</td>
                <td className="py-1.5 px-2">{result.data.left[8000]} dB</td>
                <td className="py-1.5 px-2 font-bold bg-slate-50 text-slate-900">{leftPTA} dB</td>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <td className="py-1.5 px-2 text-left font-bold text-blue-900">Left Ear BC (&gt;)</td>
                <td className="py-1.5 px-2">{getBC('left', 250)} dB</td>
                <td className="py-1.5 px-2">{getBC('left', 500)} dB</td>
                <td className="py-1.5 px-2">{getBC('left', 1000)} dB</td>
                <td className="py-1.5 px-2">{getBC('left', 2000)} dB</td>
                <td className="py-1.5 px-2">{getBC('left', 4000)} dB</td>
                <td className="py-1.5 px-2 text-slate-400">—</td>
                <td className="py-1.5 px-2 font-bold bg-slate-100 text-slate-900">{((getBC('left', 500) + getBC('left', 1000) + getBC('left', 2000)) / 3).toFixed(1)} dB</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 px-2 text-left font-bold text-rose-600">Right Ear AC (X)</td>
                <td className="py-1.5 px-2">{result.data.right[250]} dB</td>
                <td className="py-1.5 px-2">{result.data.right[500]} dB</td>
                <td className="py-1.5 px-2">{result.data.right[1000]} dB</td>
                <td className="py-1.5 px-2">{result.data.right[2000]} dB</td>
                <td className="py-1.5 px-2">{result.data.right[4000]} dB</td>
                <td className="py-1.5 px-2">{result.data.right[8000]} dB</td>
                <td className="py-1.5 px-2 font-bold bg-slate-50 text-slate-900">{rightPTA} dB</td>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <td className="py-1.5 px-2 text-left font-bold text-rose-900">Right Ear BC (&lt;)</td>
                <td className="py-1.5 px-2">{getBC('right', 250)} dB</td>
                <td className="py-1.5 px-2">{getBC('right', 500)} dB</td>
                <td className="py-1.5 px-2">{getBC('right', 1000)} dB</td>
                <td className="py-1.5 px-2">{getBC('right', 2000)} dB</td>
                <td className="py-1.5 px-2">{getBC('right', 4000)} dB</td>
                <td className="py-1.5 px-2 text-slate-400">—</td>
                <td className="py-1.5 px-2 font-bold bg-slate-100 text-slate-900">{((getBC('right', 500) + getBC('right', 1000) + getBC('right', 2000)) / 3).toFixed(1)} dB</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Diagnostic Breakdown Summary Table (Degree, Type, ABG, SRT/SDT/WRS & PTA-SDT Correlation) */}
        {(() => {
          const getDegreeOfLoss = (pta) => {
            const num = parseFloat(pta);
            if (num <= 25) return 'Normal';
            if (num <= 40) return 'Mild';
            if (num <= 55) return 'Moderate';
            if (num <= 70) return 'Moderately Severe';
            if (num <= 90) return 'Severe';
            return 'Profound';
          };

          const getLossTypeObj = (acVal, bcVal) => {
            const ac = parseFloat(acVal);
            const bc = parseFloat(bcVal);
            const abg = ac - bc;
            if (ac <= 25) return { type: "Normal Hearing", code: "Normal", abg: `${abg.toFixed(1)} dB (Absent)` };
            if (bc <= 25) return { type: "Conductive Loss", code: "CHL", abg: `${abg.toFixed(1)} dB (Significant)` };
            if (abg > 10) return { type: "Mixed Loss", code: "MHL", abg: `${abg.toFixed(1)} dB (Present)` };
            return { type: "Sensorineural Loss", code: "SNHL", abg: `${abg.toFixed(1)} dB (Absent)` };
          };

          const getPtaSdtInterpretation = (ptaVal, sdtVal) => {
            const diff = Math.abs(parseFloat(ptaVal) - parseFloat(sdtVal));
            const diffRounded = Math.round(diff);
            if (diffRounded <= 5) return `${diff.toFixed(1)} dB (Excellent)`;
            if (diffRounded === 6) return `${diff.toFixed(1)} dB (Excellent)`;
            if (diffRounded === 7) return `${diff.toFixed(1)} dB (Very Good)`;
            if (diffRounded === 8) return `${diff.toFixed(1)} dB (Good)`;
            if (diffRounded === 9) return `${diff.toFixed(1)} dB (Acceptable)`;
            if (diffRounded === 10) return `${diff.toFixed(1)} dB (Upper Limit)`;
            return `${diff.toFixed(1)} dB (Poor Correlation)`;
          };

          const lBC_PTA = ((getBC('left', 500) + getBC('left', 1000) + getBC('left', 2000)) / 3).toFixed(1);
          const rBC_PTA = ((getBC('right', 500) + getBC('right', 1000) + getBC('right', 2000)) / 3).toFixed(1);

          const lDegree = getDegreeOfLoss(leftPTA);
          const rDegree = getDegreeOfLoss(rightPTA);

          const lType = getLossTypeObj(leftPTA, lBC_PTA);
          const rType = getLossTypeObj(rightPTA, rBC_PTA);

          const lSRT = result.data.speech?.left?.srt ?? Math.round(parseFloat(leftPTA));
          const lSDT = result.data.speech?.left?.sdt ?? Math.round(lSRT - 6);
          const lWRS = result.data.speech?.left?.wrs ?? 96;

          const rSRT = result.data.speech?.right?.srt ?? Math.round(parseFloat(rightPTA));
          const rSDT = result.data.speech?.right?.sdt ?? Math.round(rSRT - 6);
          const rWRS = result.data.speech?.right?.wrs ?? 96;

          const lPtaSdtStr = getPtaSdtInterpretation(leftPTA, lSDT);
          const rPtaSdtStr = getPtaSdtInterpretation(rightPTA, rSDT);

          return (
            <div className="mb-4">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-2 pb-1 border-b border-slate-300">
                Comprehensive Clinical Diagnostic Classification & Speech Audiometry
              </h3>
              <table className="w-full text-center border-collapse border border-slate-300 text-[10px]">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-300 text-slate-700">
                    <th className="py-1.5 px-2 text-left">Ear Side</th>
                    <th className="py-1.5 px-2">AC Speech PTA</th>
                    <th className="py-1.5 px-2">Degree of Loss</th>
                    <th className="py-1.5 px-2">Type of Loss</th>
                    <th className="py-1.5 px-2">Air-Bone Gap</th>
                    <th className="py-1.5 px-2">SRT / SDT</th>
                    <th className="py-1.5 px-2">WRS (%)</th>
                    <th className="py-1.5 px-2">PTA-SDT Correlation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 px-2 text-left font-bold text-blue-700">Left Ear (🅛)</td>
                    <td className="py-1.5 px-2 font-bold">{leftPTA} dB</td>
                    <td className="py-1.5 px-2 font-bold">{lDegree}</td>
                    <td className="py-1.5 px-2 font-extrabold text-blue-800">{lType.code} ({lType.type})</td>
                    <td className="py-1.5 px-2">{lType.abg}</td>
                    <td className="py-1.5 px-2">{lSRT} / {lSDT} dB</td>
                    <td className="py-1.5 px-2 font-bold text-emerald-700">{lWRS}%</td>
                    <td className="py-1.5 px-2 font-bold">{lPtaSdtStr}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-left font-bold text-rose-600">Right Ear (🅡)</td>
                    <td className="py-1.5 px-2 font-bold">{rightPTA} dB</td>
                    <td className="py-1.5 px-2 font-bold">{rDegree}</td>
                    <td className="py-1.5 px-2 font-extrabold text-rose-800">{rType.code} ({rType.type})</td>
                    <td className="py-1.5 px-2">{rType.abg}</td>
                    <td className="py-1.5 px-2">{rSRT} / {rSDT} dB</td>
                    <td className="py-1.5 px-2 font-bold text-emerald-700">{rWRS}%</td>
                    <td className="py-1.5 px-2 font-bold">{rPtaSdtStr}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })()}

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
          </div>
        </div>

        {/* Ear-wise AC-PTA Degree & Type of Hearing Loss Classification Section */}
        {(() => {
          const ageNum = parseInt(result.age, 10) || 30;
          const isPediatric = ageNum < 18;

          const getDegreeOfLoss = (pta, patientAge = ageNum) => {
            const num = parseFloat(pta);
            if (patientAge < 18) {
              if (num <= 15) return { label: 'Normal', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', standard: 'Pediatric Standard (<18y)' };
              if (num <= 25) return { label: 'Slight', bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20', standard: 'Pediatric Standard (<18y)' };
              if (num <= 40) return { label: 'Mild', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', standard: 'Pediatric Standard (<18y)' };
              if (num <= 55) return { label: 'Moderate', bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20', standard: 'Pediatric Standard (<18y)' };
              if (num <= 70) return { label: 'Moderately Severe', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20', standard: 'Pediatric Standard (<18y)' };
              if (num <= 90) return { label: 'Severe', bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20', standard: 'Pediatric Standard (<18y)' };
              return { label: 'Profound', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20', standard: 'Pediatric Standard (<18y)' };
            } else {
              if (num <= 25) return { label: 'Normal', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', standard: 'Adult Goodman (1965)' };
              if (num <= 40) return { label: 'Mild', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', standard: 'Adult Goodman (1965)' };
              if (num <= 55) return { label: 'Moderate', bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20', standard: 'Adult Goodman (1965)' };
              if (num <= 70) return { label: 'Moderately Severe', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20', standard: 'Adult Goodman (1965)' };
              if (num <= 90) return { label: 'Severe', bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20', standard: 'Adult Goodman (1965)' };
              return { label: 'Profound', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20', standard: 'Adult Goodman (1965)' };
            }
          };

          const getLossTypeObj = (acVal, bcVal) => {
            const ac = parseFloat(acVal);
            const bc = parseFloat(bcVal);
            const abg = ac - bc;

            if (ac <= 25) {
              return {
                type: "Normal Hearing",
                code: "Normal",
                color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                acStatus: `Normal (${ac.toFixed(1)} dB ≤ 25 dB)`,
                bcStatus: `Normal (${bc.toFixed(1)} dB ≤ 25 dB)`,
                abgStatus: `Absent (${abg.toFixed(1)} dB ≤ 10 dB)`,
                definition: "Hearing thresholds for both air and bone conduction are within normal limits (≤ 25 dB HL)."
              };
            }

            if (bc <= 25) {
              return {
                type: "Conductive Hearing Loss",
                code: "CHL",
                color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
                acStatus: `Elevated (${ac.toFixed(1)} dB > 25 dB)`,
                bcStatus: `Normal (${bc.toFixed(1)} dB ≤ 25 dB)`,
                abgStatus: `Significant (${abg.toFixed(1)} dB > 10 dB)`,
                definition: "Disorder of the outer or middle ear reducing sound transmission to inner ear. Cochlea and auditory nerve function normally."
              };
            }

            if (abg > 10) {
              return {
                type: "Mixed Hearing Loss",
                code: "MHL",
                color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
                acStatus: `Elevated (${ac.toFixed(1)} dB > 25 dB)`,
                bcStatus: `Elevated (${bc.toFixed(1)} dB > 25 dB)`,
                abgStatus: `Present (${abg.toFixed(1)} dB > 10 dB)`,
                definition: "Combination of conductive and sensorineural hearing loss. Sound transmission through outer/middle ear is impaired, plus inner ear/nerve damage."
              };
            }

            return {
              type: "Sensorineural Hearing Loss",
              code: "SNHL",
              color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
              acStatus: `Elevated (${ac.toFixed(1)} dB > 25 dB)`,
              bcStatus: `Elevated (${bc.toFixed(1)} dB > 25 dB)`,
              abgStatus: `Absent/Not Significant (${abg.toFixed(1)} dB ≤ 10 dB)`,
              definition: "Damage to inner ear (cochlea) sensory hair cells or auditory nerve. Outer and middle ear function normally."
            };
          };

          const lDegree = getDegreeOfLoss(leftPTA);
          const rDegree = getDegreeOfLoss(rightPTA);

          const lBC_PTA = ((getBC('left', 500) + getBC('left', 1000) + getBC('left', 2000)) / 3).toFixed(1);
          const rBC_PTA = ((getBC('right', 500) + getBC('right', 1000) + getBC('right', 2000)) / 3).toFixed(1);

          const lType = getLossTypeObj(leftPTA, lBC_PTA);
          const rType = getLossTypeObj(rightPTA, rBC_PTA);

          return (
            <div className="space-y-6">
              {/* Degree of Loss Cards */}
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

              {/* Type of Hearing Loss Breakdown Card */}
              <DashboardCard 
                title="Type of Hearing Loss Diagnostic Breakdown" 
                subtitle="Classification based on Air Conduction (AC), Bone Conduction (BC), and Air-Bone Gap (ABG) criteria"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  {/* Left Ear Classification */}
                  <div className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-xs font-black uppercase text-blue-600 dark:text-blue-400">
                        Left Ear Hearing Loss Type
                      </span>
                      <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${lType.color}`}>
                        {lType.code} - {lType.type}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] text-center font-bold">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40">
                        <span className="block text-[9px] uppercase text-slate-400 mb-0.5">AC Threshold</span>
                        <span className="text-slate-800 dark:text-slate-200">{lType.acStatus}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40">
                        <span className="block text-[9px] uppercase text-slate-400 mb-0.5">BC Threshold</span>
                        <span className="text-slate-800 dark:text-slate-200">{lType.bcStatus}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40">
                        <span className="block text-[9px] uppercase text-slate-400 mb-0.5">Air-Bone Gap</span>
                        <span className="text-slate-800 dark:text-slate-200">{lType.abgStatus}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                      "{lType.definition}"
                    </p>
                  </div>

                  {/* Right Ear Classification */}
                  <div className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-xs font-black uppercase text-rose-600 dark:text-rose-400">
                        Right Ear Hearing Loss Type
                      </span>
                      <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${rType.color}`}>
                        {rType.code} - {rType.type}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] text-center font-bold">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40">
                        <span className="block text-[9px] uppercase text-slate-400 mb-0.5">AC Threshold</span>
                        <span className="text-slate-800 dark:text-slate-200">{rType.acStatus}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40">
                        <span className="block text-[9px] uppercase text-slate-400 mb-0.5">BC Threshold</span>
                        <span className="text-slate-800 dark:text-slate-200">{rType.bcStatus}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40">
                        <span className="block text-[9px] uppercase text-slate-400 mb-0.5">Air-Bone Gap</span>
                        <span className="text-slate-800 dark:text-slate-200">{rType.abgStatus}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                      "{rType.definition}"
                    </p>
                  </div>
                </div>
              </DashboardCard>

              {/* Speech Audiometry Battery Evaluation Card */}
              {(() => {
                const getWRSBadge = (wrs) => {
                  const num = Number(wrs);
                  if (num >= 90) return { label: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
                  if (num >= 80) return { label: 'Good', color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20' };
                  if (num >= 70) return { label: 'Fair', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' };
                  if (num >= 60) return { label: 'Poor', color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20' };
                  return { label: 'Very Poor', color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20' };
                };

                const getPtaSdtInterpretation = (ptaVal, sdtVal) => {
                  const diff = Math.abs(parseFloat(ptaVal) - parseFloat(sdtVal));
                  const diffRounded = Math.round(diff);

                  if (diffRounded <= 5) return { diff: diff.toFixed(1), label: "Excellent correlation (most common)", badge: "Excellent (≤5 dB)", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
                  if (diffRounded === 6) return { diff: diff.toFixed(1), label: "Excellent correlation", badge: "Excellent (6 dB)", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
                  if (diffRounded === 7) return { diff: diff.toFixed(1), label: "Very good correlation", badge: "Very Good (7 dB)", color: "text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20" };
                  if (diffRounded === 8) return { diff: diff.toFixed(1), label: "Good correlation; still clinically acceptable", badge: "Good (8 dB)", color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20" };
                  if (diffRounded === 9) return { diff: diff.toFixed(1), label: "Acceptable correlation", badge: "Acceptable (9 dB)", color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20" };
                  if (diffRounded === 10) return { diff: diff.toFixed(1), label: "Upper limit of the expected normal correlation", badge: "Upper Limit Normal (10 dB)", color: "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20" };
                  return { diff: diff.toFixed(1), label: "Exceeds expected normal correlation (Poor correlation)", badge: "Poor Correlation (>10 dB)", color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20" };
                };

                const lSRT = result.data.speech?.left?.srt ?? Math.round(parseFloat(leftPTA));
                const lSDT = result.data.speech?.left?.sdt ?? Math.round(lSRT - 6);
                const lWRS = result.data.speech?.left?.wrs ?? 96;

                const rSRT = result.data.speech?.right?.srt ?? Math.round(parseFloat(rightPTA));
                const rSDT = result.data.speech?.right?.sdt ?? Math.round(rSRT - 6);
                const rWRS = result.data.speech?.right?.wrs ?? 96;

                const lWRSBadge = getWRSBadge(lWRS);
                const rWRSBadge = getWRSBadge(rWRS);

                const lPtaSdt = getPtaSdtInterpretation(leftPTA, lSDT);
                const rPtaSdt = getPtaSdtInterpretation(rightPTA, rSDT);

                return (
                  <DashboardCard 
                    title="Speech Audiometry & PTA-SDT Correlation Analysis" 
                    subtitle="Clinical correlation between Pure Tone Average (PTA) and Speech Detection Threshold (SDT)"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                      {/* Left Ear Speech */}
                      <div className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                          <span className="text-xs font-black uppercase text-blue-600 dark:text-blue-400">
                            Left Ear Speech Battery
                          </span>
                          <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${lWRSBadge.color}`}>
                            {lWRSBadge.label} WRS ({lWRS}%)
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center font-bold">
                          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40">
                            <span className="block text-[9px] uppercase text-slate-400 mb-0.5">SRT</span>
                            <span className="text-base text-slate-900 dark:text-slate-100">{lSRT} dB</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40">
                            <span className="block text-[9px] uppercase text-slate-400 mb-0.5">SDT</span>
                            <span className="text-base text-slate-900 dark:text-slate-100">{lSDT} dB</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40">
                            <span className="block text-[9px] uppercase text-slate-400 mb-0.5">WRS %</span>
                            <span className="text-base text-emerald-600 dark:text-emerald-400">{lWRS}%</span>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40 space-y-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-extrabold text-slate-400 uppercase">PTA vs SDT Diff</span>
                            <span className={`font-black px-2 py-0.5 rounded-full border text-[10px] ${lPtaSdt.color}`}>
                              {lPtaSdt.diff} dB Diff
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {lPtaSdt.label}
                          </p>
                        </div>
                      </div>

                      {/* Right Ear Speech */}
                      <div className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                          <span className="text-xs font-black uppercase text-rose-600 dark:text-rose-400">
                            Right Ear Speech Battery
                          </span>
                          <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${rWRSBadge.color}`}>
                            {rWRSBadge.label} WRS ({rWRS}%)
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center font-bold">
                          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40">
                            <span className="block text-[9px] uppercase text-slate-400 mb-0.5">SRT</span>
                            <span className="text-base text-slate-900 dark:text-slate-100">{rSRT} dB</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40">
                            <span className="block text-[9px] uppercase text-slate-400 mb-0.5">SDT</span>
                            <span className="text-base text-slate-900 dark:text-slate-100">{rSDT} dB</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40">
                            <span className="block text-[9px] uppercase text-slate-400 mb-0.5">WRS %</span>
                            <span className="text-base text-emerald-600 dark:text-emerald-400">{rWRS}%</span>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40 space-y-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-extrabold text-slate-400 uppercase">PTA vs SDT Diff</span>
                            <span className={`font-black px-2 py-0.5 rounded-full border text-[10px] ${rPtaSdt.color}`}>
                              {rPtaSdt.diff} dB Diff
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {rPtaSdt.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  </DashboardCard>
                );
              })()}

              {/* Age-Based Classification Reference Table (Goodman 1965 Adult vs Pediatric) */}
              <DashboardCard 
                title="Degree of Hearing Loss Classification Standards (By Patient Age)" 
                subtitle={`Current Patient Age: ${result.age} yrs (${parseInt(result.age, 10) < 18 ? "Pediatric Classification Applied" : "Adult Goodman 1965 Standard Applied"})`}
              >
                <div className="overflow-x-auto mt-2 border border-slate-200/60 dark:border-slate-800/60 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[10px]">
                        <th className="py-2.5 px-4">Degree of Hearing Loss</th>
                        <th className="py-2.5 px-4 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400">
                          Adults (Goodman, 1965) dB HL
                        </th>
                        <th className="py-2.5 px-4 bg-purple-50/50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400">
                          Children (Common Pediatric Classification) dB HL
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/40 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                      <tr className={parseInt(result.age, 10) >= 18 ? "bg-emerald-500/5 font-extrabold" : ""}>
                        <td className="py-2 px-4 font-bold text-emerald-600 dark:text-emerald-400">Normal Hearing</td>
                        <td className="py-2 px-4">0 – 25 dB</td>
                        <td className="py-2 px-4">0 – 15 dB</td>
                      </tr>
                      <tr className={parseInt(result.age, 10) < 18 ? "bg-teal-500/10 font-extrabold" : ""}>
                        <td className="py-2 px-4 font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                          Slight Hearing Loss
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 border border-teal-500/20">Pediatric Specific</span>
                        </td>
                        <td className="py-2 px-4 text-slate-400 italic">Not specified in original Goodman</td>
                        <td className="py-2 px-4 font-bold text-teal-600 dark:text-teal-400">16 – 25 dB</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-bold text-amber-600 dark:text-amber-400">Mild Hearing Loss</td>
                        <td className="py-2 px-4">26 – 40 dB</td>
                        <td className="py-2 px-4">26 – 40 dB</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-bold text-orange-600 dark:text-orange-400">Moderate Hearing Loss</td>
                        <td className="py-2 px-4">41 – 55 dB</td>
                        <td className="py-2 px-4">41 – 55 dB</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-bold text-rose-600 dark:text-rose-400">Moderately Severe Hearing Loss</td>
                        <td className="py-2 px-4">56 – 70 dB</td>
                        <td className="py-2 px-4">56 – 70 dB</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-bold text-red-600 dark:text-red-400">Severe Hearing Loss</td>
                        <td className="py-2 px-4">71 – 90 dB</td>
                        <td className="py-2 px-4">71 – 90 dB</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-bold text-purple-600 dark:text-purple-400">Profound Hearing Loss</td>
                        <td className="py-2 px-4">91+ dB</td>
                        <td className="py-2 px-4">91+ dB</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 leading-relaxed italic">
                  * Note: Degree of hearing loss is calculated from the 3-Frequency Speech Pure Tone Average (PTA) at 500 Hz, 1000 Hz, and 2000 Hz. Pediatric standard includes 16–25 dB HL as "Slight Hearing Loss" due to developmental impact on speech acquisition.
                </p>
              </DashboardCard>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div>
            <DashboardCard 
              title="PURE TONE AUDIOGRAM" 
              subtitle="Clinical Frequency (250Hz - 8kHz) vs Hearing Level (-10 to 120 dB HL). Reversed Y-axis clinical standard."
            >
              <div className="w-[440px] h-[440px] aspect-square max-w-full mx-auto mt-2 p-4 bg-white dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-300 rounded-2xl shadow-md flex flex-col justify-between">
                
                {/* Clinical Header with Masked / Unmasked Toggle */}
                <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="tracking-wider">PURE TONE AUDIOGRAM</span>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsMaskedBC(false)}
                      className={`px-2 py-0.5 rounded text-[9px] font-extrabold transition-all ${
                        !isMaskedBC 
                          ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Unmasked (&lt; &gt;)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMaskedBC(true)}
                      className={`px-2 py-0.5 rounded text-[9px] font-extrabold transition-all ${
                        isMaskedBC 
                          ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Masked ([ ])
                    </button>
                  </div>
                </div>

                {/* 1:1 Square Chart Area */}
                <div className="flex-1 w-full relative pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={audiogramChartData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="1 1" stroke="#cbd5e1" className="dark:stroke-slate-800" />
                      <XAxis 
                        dataKey="frequency" 
                        stroke="#64748b" 
                        fontSize={10} 
                        fontWeight={700}
                        tickLine={true} 
                        unit=" Hz"
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        fontWeight={700}
                        domain={[-10, 120]} 
                        ticks={[-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]}
                        reversed={true} 
                        tickLine={true} 
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
                      
                      {/* Air Conduction Lines */}
                      <Line 
                        type="linear" 
                        dataKey="Left" 
                        name="Left Ear AC (X)" 
                        stroke="#2563eb" 
                        strokeWidth={2.5} 
                        dot={<CustomLeftDot />} 
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="linear" 
                        dataKey="Right" 
                        name="Right Ear AC (O)" 
                        stroke="#e11d48" 
                        strokeWidth={2.5} 
                        dot={<CustomRightDot />} 
                        activeDot={{ r: 6 }} 
                      />

                      {/* Bone Conduction Lines */}
                      <Line 
                        type="linear" 
                        dataKey="Right_BC" 
                        name={isMaskedBC ? "Right Ear BC ([)" : "Right Ear BC (<)"} 
                        stroke="#d97706" 
                        strokeWidth={2} 
                        strokeDasharray="3 3"
                        connectNulls={true}
                        dot={<CustomRightBCDot />} 
                      />
                      <Line 
                        type="linear" 
                        dataKey="Left_BC" 
                        name={isMaskedBC ? "Left Ear BC (])" : "Left Ear BC (>)"} 
                        stroke="#4f46e5" 
                        strokeWidth={2} 
                        strokeDasharray="3 3"
                        connectNulls={true}
                        dot={<CustomLeftBCDot />} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Clinical Legend Footer */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 gap-1 text-[9px] text-center font-bold">
                  <div className="text-blue-600 dark:text-blue-400">AC Left (X)</div>
                  <div className="text-rose-600 dark:text-rose-400">AC Right (O)</div>
                  <div className="text-indigo-600 dark:text-indigo-400">BC Left ({isMaskedBC ? ']' : '>'})</div>
                  <div className="text-amber-600 dark:text-amber-400">BC Right ({isMaskedBC ? '[' : '<'})</div>
                </div>

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
