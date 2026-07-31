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
    L250: 20, L500: 20, L1000: 20, L2000: 20, L4000: 20, L8000: 20,
    R250: 20, R500: 20, R1000: 20, R2000: 20, R4000: 20, R8000: 20
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
    const csvContent = 
      "PatientID,PatientName,Age,Gender,L250,L500,L1000,L2000,L4000,L8000,R250,R500,R1000,R2000,R4000,R8000\n" +
      "P-1045,Alice Johnson,54,Female,30,35,45,50,60,65,25,30,40,45,55,60";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "audai_sample_audiogram.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAnalyze = async () => {
    if (!file || !parsedData) return;
    
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
    }, 900);

    try {
      const result = await mockApi.predict(patientInfo, audiogramData);
      clearInterval(interval);
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate('/results', { state: { result } });
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setError("AI analysis failed. Please verify the credentials and audiogram data.");
      setIsAnalyzing(false);
    }
  };

  const frequencies = ['250', '500', '1000', '2000', '4000', '8000'];

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
          <button 
            type="button" 
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs rounded-xl shadow-md transition-transform hover:scale-[1.02]"
          >
            Browse Workspace File
          </button>
        </div>
      ) : (
        /* Selected File Overview & CSV Previews */
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/40 p-4 rounded-xl flex items-center justify-between shadow-soft">
            <div className="flex items-center space-x-3 truncate">
              <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-950/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <FileText className="h-5 w-5" />
              </div>
              <div className="text-left truncate">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{file.name}</h4>
                <p className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB &bull; Verified CSV</p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              title="Remove file"
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
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient ID</label>
                    <input
                      type="text"
                      value={patientInfo.patientId}
                      onChange={(e) => setPatientInfo({ ...patientInfo, patientId: e.target.value })}
                      className="w-full pl-3 pr-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:text-slate-900 dark:focus:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-xs font-semibold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient Name</label>
                    <input
                      type="text"
                      value={patientInfo.name}
                      onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                      className="w-full pl-3 pr-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:text-slate-900 dark:focus:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-xs font-semibold transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Age</label>
                      <input
                        type="number"
                        value={patientInfo.age}
                        onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                        className="w-full pl-3 pr-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:text-slate-900 dark:focus:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-xs font-semibold transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gender</label>
                      <select
                        value={patientInfo.gender}
                        onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                        className="w-full pl-3 pr-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:text-slate-900 dark:focus:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-xs font-semibold transition-all"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </div>

            {/* Threshold Previews */}
            <div className="md:col-span-2">
              <DashboardCard title="Audiogram Decibel Thresholds" subtitle="dB HL values extracted from CSV (250Hz - 8000Hz)">
                <div className="overflow-x-auto border border-slate-200/50 dark:border-slate-800/60 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/40 text-slate-400 font-bold uppercase">
                        <th className="px-4 py-3">Ear</th>
                        {frequencies.map(f => (
                          <th key={f} className="px-4 py-3 text-center">{f} Hz</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      <tr>
                        <td className="px-4 py-3 font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                          Left Ear (L)
                        </td>
                        {frequencies.map(f => (
                          <td key={f} className="px-4 py-3 text-center font-bold">
                            {audiogramData[`L${f}`]} dB
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-rose-500 flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                          Right Ear (R)
                        </td>
                        {frequencies.map(f => (
                          <td key={f} className="px-4 py-3 text-center font-bold">
                            {audiogramData[`R${f}`]} dB
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
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
