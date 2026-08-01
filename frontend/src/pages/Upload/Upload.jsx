import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  FileText, 
  Trash2, 
  Play, 
  AlertCircle, 
  CheckCircle2, 
  Activity,
  Download
} from 'lucide-react';
import { mockApi } from '../../services/api';
import DashboardCard from '../../components/DashboardCard/DashboardCard';

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [patientInfo, setPatientInfo] = useState({
    patientId: '',
    name: '',
    age: '',
    gender: 'Male'
  });
  const [audiogramData, setAudiogramData] = useState({
    // Air Conduction (AC)
    L250: 20, L500: 20, L1000: 20, L2000: 20, L4000: 20, L8000: 20,
    R250: 20, R500: 20, R1000: 20, R2000: 20, R4000: 20, R8000: 20,
    // Bone Conduction (BC)
    L250_BC: 20, L500_BC: 20, L1000_BC: 20, L2000_BC: 20, L4000_BC: 20, L8000_BC: 20,
    R250_BC: 20, R500_BC: 20, R1000_BC: 20, R2000_BC: 20, R4000_BC: 20, R8000_BC: 20
  });

  const [error, setError] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingStages = [
    "Reading uploaded CSV file...",
    "Injecting thresholds into clinical AI model...",
    "Evaluating audiogram classification indices...",
    "Computing clinical hearing disability percentage...",
    "Finalizing clinical report documentation..."
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile) => {
    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
      setError("Unsupported file format. Please upload a standard CSV file.");
      return;
    }
    
    setError('');
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        parseCSVText(text);
      } catch (err) {
        setError("Error parsing CSV data. Ensure headers match the template.");
      }
    };
    reader.readAsText(selectedFile);
  };

  const parseCSVText = (text) => {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length < 2) {
      throw new Error("Invalid CSV layout");
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const values = lines[1].split(',').map(v => v.trim());

    // Normalize keys (remove underscores, spaces, lowercase)
    const normData = {};
    headers.forEach((header, index) => {
      const cleanKey = header.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      normData[cleanKey] = values[index];
    });

    const getVal = (...keys) => {
      for (const k of keys) {
        const cleanK = k.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        if (normData[cleanK] !== undefined) return normData[cleanK];
      }
      return undefined;
    };

    const patientId = getVal('PatientID', 'patient_id', 'id') || 'PAT-1001';
    const name = getVal('PatientName', 'patient_name', 'name') || 'Anonymous Patient';
    const age = getVal('Age', 'age') || '45';
    const gender = getVal('Gender', 'gender') || 'Male';

    const frequencies = ['250', '500', '1000', '2000', '4000', '8000'];
    const audiogram = {};

    frequencies.forEach(f => {
      const lVal = getVal(`L${f}`, `L_${f}`, `left${f}`, `l${f}`);
      const rVal = getVal(`R${f}`, `R_${f}`, `right${f}`, `r${f}`);
      
      audiogram[`L${f}`] = lVal !== undefined ? parseFloat(lVal) : 20;
      audiogram[`R${f}`] = rVal !== undefined ? parseFloat(rVal) : 20;
    });

    setPatientInfo({
      patientId,
      name,
      age,
      gender
    });

    setAudiogramData(audiogram);
    setParsedData(normData);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setParsedData(null);
    setPatientInfo({ patientId: '', name: '', age: '', gender: 'Male' });
    setAudiogramData({
      L250: 20, L500: 20, L1000: 20, L2000: 20, L4000: 20, L8000: 20,
      R250: 20, R500: 20, R1000: 20, R2000: 20, R4000: 20, R8000: 20
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadSampleCSV = () => {
    const names = [
      { name: "Alice Johnson", gender: "Female" },
      { name: "Robert Chen", gender: "Male" },
      { name: "Anita Sharma", gender: "Female" },
      { name: "Michael Scott", gender: "Male" },
      { name: "Elena Rostova", gender: "Female" },
      { name: "David Miller", gender: "Male" },
      { name: "Sophia Patel", gender: "Female" },
      { name: "Marcus Vance", gender: "Male" },
      { name: "Priya Nair", gender: "Female" },
      { name: "John Doe", gender: "Male" }
    ];

    const profiles = [
      { type: "Normal", baseL: 10, baseR: 15, slope: 0 },
      { type: "Mild_Loss", baseL: 30, baseR: 32, slope: 5 },
      { type: "Moderate_Loss", baseL: 45, baseR: 48, slope: 10 },
      { type: "Severe_Loss", baseL: 75, baseR: 80, slope: 15 },
      { type: "High_Frequency_Drop", baseL: 15, baseR: 15, slope: 45 },
      { type: "Asymmetric_Loss", baseL: 15, baseR: 65, slope: 5 }
    ];

    const p = profiles[Math.floor(Math.random() * profiles.length)];
    const person = names[Math.floor(Math.random() * names.length)];
    const pid = `P-${Math.floor(1000 + Math.random() * 9000)}`;
    const age = Math.floor(22 + Math.random() * 55);

    const freqFactors = [0, 0.1, 0.2, 0.4, 0.7, 1.0];
    const round5 = (val) => Math.max(-10, Math.min(120, Math.round(val / 5) * 5));

    const lThresholds = freqFactors.map(ff => round5(p.baseL + ff * p.slope + (Math.random() * 6 - 3)));
    const rThresholds = freqFactors.map(ff => round5(p.baseR + ff * p.slope + (Math.random() * 6 - 3)));

    const header = "PatientID,PatientName,Age,Gender,L250,L500,L1000,L2000,L4000,L8000,R250,R500,R1000,R2000,R4000,R8000";
    const row = `${pid},${person.name},${age},${person.gender},${lThresholds.join(',')},${rThresholds.join(',')}`;

    const csvContent = `${header}\n${row}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `audai_sample_${p.type}_${pid}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAnalyze = async () => {
    if (!audiogramData) {
      setError("Please specify audiogram decibel thresholds before running diagnostics.");
      return;
    }
    
    setIsAnalyzing(true);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingStages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 800);

    try {
      const result = await mockApi.predict(patientInfo, audiogramData);
      clearInterval(interval);
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate('/results', { state: { result } });
      }, 400);
    } catch (err) {
      clearInterval(interval);
      setError("AI analysis failed. Please verify the credentials and audiogram data.");
      setIsAnalyzing(false);
    }
  };

  const frequencies = ['250', '500', '1000', '2000', '4000', '8000'];
  const bcFrequencies = ['250', '500', '1000', '2000', '4000'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-2xl p-8 max-w-md w-full shadow-premium text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary-50 dark:bg-primary-950/40 border border-primary-200/30 flex items-center justify-center relative">
                  <Activity className="h-8 w-8 text-primary-600 dark:text-primary-500 animate-pulse" />
                  <span className="absolute inset-0 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold font-heading">AI Analyzing Thresholds</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Please keep this browser window open</p>
              </div>

              {/* Stepper progress */}
              <div className="space-y-3.5 text-left border-t border-slate-100 dark:border-slate-800/80 pt-4">
                {loadingStages.map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    {loadingStep > idx ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : loadingStep === idx ? (
                      <div className="h-4 w-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-200 dark:border-slate-800 shrink-0" />
                    )}
                    <span className={loadingStep === idx ? "font-bold text-primary-600 dark:text-primary-400" : "text-slate-400"}>
                      {stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-heading text-slate-800 dark:text-slate-100 tracking-tight">
            Analyze Audiometry CSV
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload PTA outputs to trigger hearing type and disability AI diagnostics.
          </p>
        </div>
        <button
          onClick={downloadSampleCSV}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 font-semibold text-xs transition-colors bg-white dark:bg-slate-950"
        >
          <Download className="h-4 w-4" />
          Download Sample CSV
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Upload Zone */}
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
            isDragActive 
              ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/10' 
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/10'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".csv"
            className="hidden"
          />
          <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/40 flex items-center justify-center text-slate-500 mb-4 shadow-sm">
            <UploadCloud className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-base mb-1 font-heading text-slate-800 dark:text-slate-200">Drag and drop CSV here</h3>
          <p className="text-xs text-slate-400 max-w-xs mb-4">
            Supports clinical PTA CSV files exports from standard audiometer machinery.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              type="button" 
              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs rounded-xl shadow-md transition-transform hover:scale-[1.02]"
            >
              Browse Workspace File
            </button>
            <button 
              type="button" 
              onClick={(e) => {
                e.stopPropagation();
                setFile({ name: "Manual_Clinical_Entry.csv", type: "text/csv", size: 512 });
                setPatientInfo({
                  patientId: `P-${Math.floor(1000 + Math.random() * 9000)}`,
                  name: "Patient Entry",
                  age: "42",
                  gender: "Male"
                });
              }}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition-transform hover:scale-[1.02]"
            >
              ✏️ Manual Threshold Entry
            </button>
          </div>
        </div>
      ) : (
        /* Selected File Overview & CSV Previews */
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/40 p-4 rounded-xl flex items-center justify-between shadow-soft">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{file.name}</h4>
                <p className="text-[10px] text-slate-400">Ready for clinical threshold editing & AI diagnosis</p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Remove File"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Patient Info */}
            <div className="md:col-span-1">
              <DashboardCard title="Patient Profile">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Patient ID</label>
                    <input
                      type="text"
                      value={patientInfo.patientId}
                      onChange={(e) => setPatientInfo({ ...patientInfo, patientId: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-bold transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Patient Name</label>
                    <input
                      type="text"
                      value={patientInfo.name}
                      onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-bold transition-all shadow-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Age</label>
                      <input
                        type="number"
                        value={patientInfo.age}
                        onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-bold transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Gender</label>
                      <select
                        value={patientInfo.gender}
                        onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-bold transition-all shadow-sm"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </div>

            {/* Threshold Matrix Preview */}
            <div className="md:col-span-2 space-y-6">
              <DashboardCard title="Audiogram Decibel Thresholds (3-Freq PTA)" subtitle="Enter 500Hz, 1000Hz, 2000Hz to calculate 3-frequency Pure Tone Average">
                
                {/* Live Real-Time 3-Frequency PTA Cards */}
                {(() => {
                  const lPTA = ((audiogramData.L500 ?? 20) + (audiogramData.L1000 ?? 20) + (audiogramData.L2000 ?? 20)) / 3;
                  const rPTA = ((audiogramData.R500 ?? 20) + (audiogramData.R1000 ?? 20) + (audiogramData.R2000 ?? 20)) / 3;

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {/* Left Ear */}
                      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/40 dark:border-blue-800/40 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                            Left Ear Pure Tone Average (0.5, 1, 2 kHz)
                          </span>
                          <span className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                            {lPTA.toFixed(1)} <span className="text-xs font-semibold text-slate-400">dB HL</span>
                          </span>
                        </div>
                        <span className="h-3 w-3 rounded-full bg-blue-500 shadow-sm" />
                      </div>

                      {/* Right Ear */}
                      <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/40 dark:border-rose-800/40 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                            Right Ear Pure Tone Average (0.5, 1, 2 kHz)
                          </span>
                          <span className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                            {rPTA.toFixed(1)} <span className="text-xs font-semibold text-slate-400">dB HL</span>
                          </span>
                        </div>
                        <span className="h-3 w-3 rounded-full bg-rose-500 shadow-sm" />
                      </div>
                    </div>
                  );
                })()}

                {/* AIR CONDUCTION (AC) THRESHOLD TABLE */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400 block">
                      Air Conduction (AC) Threshold Matrix (dB HL)
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      ★ Speech Frequencies: 500Hz, 1000Hz, 2000Hz used for AC PTA
                    </span>
                  </div>
                  <div className="overflow-x-auto border border-slate-200/50 dark:border-slate-800/60 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/40 text-slate-400 font-bold uppercase">
                          <th className="px-4 py-3">Air Conduction Ear</th>
                          {frequencies.map(f => (
                            <th key={f} className="px-2 py-3 text-center">{f} Hz</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                        <tr>
                          <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                            Left Ear (L)
                          </td>
                          {frequencies.map(f => (
                            <td key={f} className="px-2 py-2 text-center font-bold">
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="number"
                                  min="0"
                                  max="120"
                                  value={audiogramData[`L${f}`] !== undefined ? audiogramData[`L${f}`] : 20}
                                  onChange={(e) => setAudiogramData({
                                    ...audiogramData,
                                    [`L${f}`]: Math.max(0, Math.min(120, parseInt(e.target.value) || 0))
                                  })}
                                  className="w-14 text-center py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-bold text-xs rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm"
                                />
                                <span className="text-[10px] text-slate-400 font-semibold">dB</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-rose-500 flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                            Right Ear (R)
                          </td>
                          {frequencies.map(f => (
                            <td key={f} className="px-2 py-2 text-center font-bold">
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="number"
                                  min="0"
                                  max="120"
                                  value={audiogramData[`R${f}`] !== undefined ? audiogramData[`R${f}`] : 20}
                                  onChange={(e) => setAudiogramData({
                                    ...audiogramData,
                                    [`R${f}`]: Math.max(0, Math.min(120, parseInt(e.target.value) || 0))
                                  })}
                                  className="w-14 text-center py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-bold text-xs rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm"
                                />
                                <span className="text-[10px] text-slate-400 font-semibold">dB</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* BONE CONDUCTION (BC) THRESHOLD TABLE (250Hz - 4000Hz) */}
                <div className="space-y-2 mt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary-600 dark:text-secondary-400 block">
                      Bone Conduction (BC) Threshold Matrix (dB HL - 250Hz to 4000Hz)
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      ★ Max 4000 Hz Transducer Limit
                    </span>
                  </div>
                  <div className="overflow-x-auto border border-slate-200/50 dark:border-slate-800/60 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/40 text-slate-400 font-bold uppercase">
                          <th className="px-4 py-3">Bone Conduction Ear</th>
                          {bcFrequencies.map(f => (
                            <th key={f} className="px-2 py-3 text-center">{f} Hz</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                        <tr>
                          <td className="px-4 py-3 font-bold text-indigo-500 dark:text-indigo-400 flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                            Left Ear BC (L-BC)
                          </td>
                          {bcFrequencies.map(f => (
                            <td key={f} className="px-2 py-2 text-center font-bold">
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="number"
                                  min="0"
                                  max="120"
                                  value={audiogramData[`L${f}_BC`] !== undefined ? audiogramData[`L${f}_BC`] : 20}
                                  onChange={(e) => setAudiogramData({
                                    ...audiogramData,
                                    [`L${f}_BC`]: Math.max(0, Math.min(120, parseInt(e.target.value) || 0))
                                  })}
                                  className="w-14 text-center py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-bold text-xs rounded-lg focus:ring-2 focus:ring-secondary-500 focus:outline-none shadow-sm"
                                />
                                <span className="text-[10px] text-slate-400 font-semibold">dB</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-amber-500 flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                            Right Ear BC (R-BC)
                          </td>
                          {bcFrequencies.map(f => (
                            <td key={f} className="px-2 py-2 text-center font-bold">
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="number"
                                  min="0"
                                  max="120"
                                  value={audiogramData[`R${f}_BC`] !== undefined ? audiogramData[`R${f}_BC`] : 20}
                                  onChange={(e) => setAudiogramData({
                                    ...audiogramData,
                                    [`R${f}_BC`]: Math.max(0, Math.min(120, parseInt(e.target.value) || 0))
                                  })}
                                  className="w-14 text-center py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-bold text-xs rounded-lg focus:ring-2 focus:ring-secondary-500 focus:outline-none shadow-sm"
                                />
                                <span className="text-[10px] text-slate-400 font-semibold">dB</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Analyze Trigger */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors text-xs font-bold bg-white dark:bg-slate-950"
                  >
                    Discard File
                  </button>
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/15 hover:scale-[1.02] transition-transform"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Run AI Diagnostics
                  </button>
                </div>
              </DashboardCard>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
