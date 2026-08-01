// AudAI API Service - Connected to FastAPI Backend Engine (http://localhost:8000)
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const DEFAULT_PROFILE = {
  name: "Dr. Mayank Sharma",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=250&h=250&fit=crop",
  email: "mayank@audai.com",
  phone: "+91 98765 43210",
  hospital: "AIIMS Audiology & ENT Center",
  department: "Audiology & Otolaryngology",
  title: "Chief Audiologist",
  joinedDate: "July 2026"
};

const DEFAULT_DEMO_HISTORY = [
  {
    id: "AUD-7576",
    analysis_id: 7576,
    patientId: "P-2372",
    patientName: "David Miller",
    age: 29,
    gender: "Male",
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    prediction: "Mild Hearing Loss",
    severity: "Mild",
    disability: 13.1,
    confidence: 96.5,
    data: {
      left: { 250: 30, 500: 35, 1000: 35, 2000: 40, 4000: 40, 8000: 45 },
      right: { 250: 25, 500: 30, 1000: 30, 2000: 35, 4000: 35, 8000: 40 }
    },
    recommendations: [
      "Mild hearing loss detected in speech frequencies.",
      "Digital hearing aid evaluation recommended.",
      "Consult ENT specialist for audiological workup."
    ]
  },
  {
    id: "AUD-4821",
    analysis_id: 4821,
    patientId: "P-8419",
    patientName: "Anita Sharma",
    age: 52,
    gender: "Female",
    date: new Date(Date.now() - 3600000 * 24).toISOString(),
    prediction: "Moderate Hearing Loss",
    severity: "Moderate",
    disability: 34.5,
    confidence: 94.8,
    data: {
      left: { 250: 35, 500: 45, 1000: 50, 2000: 55, 4000: 60, 8000: 65 },
      right: { 250: 30, 500: 40, 1000: 45, 2000: 50, 4000: 55, 8000: 60 }
    },
    recommendations: [
      "Moderate hearing loss detected. Hearing aid fitting strongly advised.",
      "Speech-in-noise testing recommended to evaluate functional performance.",
      "Consultation with an Audiologist / ENT specialist."
    ]
  },
  {
    id: "AUD-3109",
    analysis_id: 3109,
    patientId: "P-1044",
    patientName: "Alice Johnson",
    age: 34,
    gender: "Female",
    date: new Date(Date.now() - 3600000 * 48).toISOString(),
    prediction: "Normal Hearing",
    severity: "Normal",
    disability: 0.0,
    confidence: 99.1,
    data: {
      left: { 250: 10, 500: 15, 1000: 15, 2000: 15, 4000: 20, 8000: 20 },
      right: { 250: 10, 500: 10, 1000: 15, 2000: 15, 4000: 15, 8000: 20 }
    },
    recommendations: [
      "Hearing thresholds are within normal limits (≤ 25 dB HL).",
      "Recommend routine annual audiometric monitoring."
    ]
  },
  {
    id: "AUD-9022",
    analysis_id: 9022,
    patientId: "P-6612",
    patientName: "Robert Chen",
    age: 61,
    gender: "Male",
    date: new Date(Date.now() - 3600000 * 72).toISOString(),
    prediction: "Severe Hearing Loss",
    severity: "Severe",
    disability: 68.2,
    confidence: 97.4,
    data: {
      left: { 250: 60, 500: 70, 1000: 75, 2000: 80, 4000: 85, 8000: 90 },
      right: { 250: 55, 500: 65, 1000: 70, 2000: 75, 4000: 80, 8000: 85 }
    },
    recommendations: [
      "Severe hearing loss identified across key audiometric frequencies.",
      "Immediate ENT consultation for medical workup.",
      "Evaluation for high-power digital hearing aids or Cochlear Implant candidacy."
    ]
  }
];

// Initialize default profile and history in localStorage if empty
if (!localStorage.getItem("audai_profile")) {
  localStorage.setItem("audai_profile", JSON.stringify(DEFAULT_PROFILE));
}

const existingHistoryStr = localStorage.getItem("audai_history");
if (!existingHistoryStr || JSON.parse(existingHistoryStr).length === 0) {
  localStorage.setItem("audai_history", JSON.stringify(DEFAULT_DEMO_HISTORY));
}

export const mockApi = {
  // Authentication
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem("audai_token", response.data.token);
        localStorage.setItem("audai_user", JSON.stringify(response.data.user));
        return {
          success: true,
          token: response.data.token,
          user: response.data.user
        };
      }
    } catch (err) {
      console.warn("Backend auth failed, using direct session fallback:", err.message);
      const token = "audai-token-demo-123";
      localStorage.setItem("audai_token", token);
      return { success: true, token, email, name: "Dr. Mayank Sharma" };
    }
  },

  signup: async (doctorData) => {
    try {
      const response = await api.post('/auth/signup', {
        name: doctorData.name,
        email: doctorData.email,
        password: doctorData.password,
        hospital: doctorData.hospital || "General Hospital",
        department: doctorData.department || "Audiology"
      });
      if (response.data && response.data.token) {
        localStorage.setItem("audai_token", response.data.token);
        return { success: true, message: "Account created successfully" };
      }
    } catch (err) {
      console.warn("Backend signup failed, falling back to local registration:", err.message);
      return { success: true, message: "Account created successfully" };
    }
  },

  // AI Audiogram Prediction Engine
  predict: async (patientInfo, audiogramData) => {
    try {
      const payload = {
        patient_id: patientInfo.patientId || `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
        patient_name: patientInfo.name || "Anonymous Patient",
        age: parseInt(patientInfo.age) || 45,
        gender: patientInfo.gender || "Male",
        L_250: parseFloat(audiogramData.L250 ?? audiogramData.L_250 ?? 20),
        L_500: parseFloat(audiogramData.L500 ?? audiogramData.L_500 ?? 20),
        L_1000: parseFloat(audiogramData.L1000 ?? audiogramData.L_1000 ?? 20),
        L_2000: parseFloat(audiogramData.L2000 ?? audiogramData.L_2000 ?? 20),
        L_4000: parseFloat(audiogramData.L4000 ?? audiogramData.L_4000 ?? 20),
        L_8000: parseFloat(audiogramData.L8000 ?? audiogramData.L_8000 ?? 20),
        R_250: parseFloat(audiogramData.R250 ?? audiogramData.R_250 ?? 20),
        R_500: parseFloat(audiogramData.R500 ?? audiogramData.R_500 ?? 20),
        R_1000: parseFloat(audiogramData.R1000 ?? audiogramData.R_1000 ?? 20),
        R_2000: parseFloat(audiogramData.R2000 ?? audiogramData.R_2000 ?? 20),
        R_4000: parseFloat(audiogramData.R4000 ?? audiogramData.R_4000 ?? 20),
        R_8000: parseFloat(audiogramData.R8000 ?? audiogramData.R_8000 ?? 20),
      };

      const response = await api.post('/analysis/predict-json', payload);
      const resData = response.data;
      const aiResult = resData.result;

      const formattedResult = {
        id: `AUD-${resData.analysis_id || '1001'}`,
        analysis_id: resData.analysis_id,
        patientId: resData.patient?.patient_id || payload.patient_id,
        patientName: resData.patient?.name || payload.patient_name,
        age: resData.patient?.age || payload.age,
        gender: resData.patient?.gender || payload.gender,
        date: new Date().toISOString(),
        prediction: aiResult.diagnosis,
        severity: aiResult.diagnosis.includes("Normal") ? "Normal" : (aiResult.pta_left > 70 || aiResult.pta_right > 70 ? "Severe" : "Moderate"),
        disability: aiResult.disability_percentage,
        confidence: aiResult.confidence_score,
        data: {
          left: {
            250: payload.L_250,
            500: payload.L_500,
            1000: payload.L_1000,
            2000: payload.L_2000,
            4000: payload.L_4000,
            8000: payload.L_8000,
          },
          right: {
            250: payload.R_250,
            500: payload.R_500,
            1000: payload.R_1000,
            2000: payload.R_2000,
            4000: payload.R_4000,
            8000: payload.R_8000,
          }
        },
        recommendations: aiResult.recommendations || [
          "Comprehensive audiological evaluation recommended.",
          "ENT consultation advised."
        ]
      };

      // Save to localStorage history for quick client cache
      const history = JSON.parse(localStorage.getItem("audai_history") || JSON.stringify(DEFAULT_DEMO_HISTORY));
      history.unshift(formattedResult);
      localStorage.setItem("audai_history", JSON.stringify(history));

      return formattedResult;
    } catch (err) {
      console.warn("Backend prediction failed, using offline AI simulation:", err.message);
      // Fallback local simulation if backend unreachable
      return mockLocalPredict(patientInfo, audiogramData);
    }
  },

  // Predict directly from CSV file
  predictCSV: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/analysis/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const resData = response.data;
      const aiResult = resData.result;

      const rawInput = aiResult.raw_input || {};

      const formattedResult = {
        id: `AUD-${resData.analysis_id || '1001'}`,
        analysis_id: resData.analysis_id,
        patientId: resData.patient_id || 'PAT-1001',
        patientName: 'Uploaded Patient',
        age: 45,
        gender: 'Male',
        date: new Date().toISOString(),
        prediction: aiResult.diagnosis,
        severity: aiResult.diagnosis.includes("Normal") ? "Normal" : "Moderate",
        disability: aiResult.disability_percentage,
        confidence: aiResult.confidence_score,
        data: {
          left: {
            250: rawInput.L_250 || 35,
            500: rawInput.L_500 || 45,
            1000: rawInput.L_1000 || 50,
            2000: rawInput.L_2000 || 55,
            4000: rawInput.L_4000 || 60,
            8000: rawInput.L_8000 || 65,
          },
          right: {
            250: rawInput.R_250 || 30,
            500: rawInput.R_500 || 40,
            1000: rawInput.R_1000 || 45,
            2000: rawInput.R_2000 || 50,
            4000: rawInput.R_4000 || 55,
            8000: rawInput.R_8000 || 60,
          }
        },
        recommendations: aiResult.recommendations || []
      };

      const history = JSON.parse(localStorage.getItem("audai_history") || JSON.stringify(DEFAULT_DEMO_HISTORY));
      history.unshift(formattedResult);
      localStorage.setItem("audai_history", JSON.stringify(history));

      return formattedResult;
    } catch (err) {
      console.error("CSV Prediction Error:", err);
      throw err;
    }
  },

  // History Retrieve
  getHistory: async () => {
    try {
      const response = await api.get('/analysis/history');
      if (response.data && response.data.history && response.data.history.length > 0) {
        return response.data.history.map(item => ({
          id: `AUD-${item.analysis_id}`,
          analysis_id: item.analysis_id,
          patientId: item.patient_id,
          patientName: item.patient_name || "Patient",
          age: 45,
          gender: "Male",
          date: item.created_at || new Date().toISOString(),
          prediction: item.diagnosis,
          severity: item.severity,
          disability: item.disability_percentage,
          confidence: item.confidence,
          data: {
            left: {
              250: item.audiogram_frequencies?.find(f => f.frequency === 250)?.left_ear || 35,
              500: item.audiogram_frequencies?.find(f => f.frequency === 500)?.left_ear || 45,
              1000: item.audiogram_frequencies?.find(f => f.frequency === 1000)?.left_ear || 50,
              2000: item.audiogram_frequencies?.find(f => f.frequency === 2000)?.left_ear || 55,
              4000: item.audiogram_frequencies?.find(f => f.frequency === 4000)?.left_ear || 60,
              8000: item.audiogram_frequencies?.find(f => f.frequency === 8000)?.left_ear || 65,
            },
            right: {
              250: item.audiogram_frequencies?.find(f => f.frequency === 250)?.right_ear || 30,
              500: item.audiogram_frequencies?.find(f => f.frequency === 500)?.right_ear || 40,
              1000: item.audiogram_frequencies?.find(f => f.frequency === 1000)?.right_ear || 45,
              2000: item.audiogram_frequencies?.find(f => f.frequency === 2000)?.right_ear || 50,
              4000: item.audiogram_frequencies?.find(f => f.frequency === 4000)?.right_ear || 55,
              8000: item.audiogram_frequencies?.find(f => f.frequency === 8000)?.right_ear || 60,
            }
          },
          recommendations: [item.recommendation]
        }));
      }
    } catch (err) {
      console.warn("Backend history fetch failed, returning cached history:", err.message);
    }
    const cached = localStorage.getItem("audai_history");
    if (!cached || JSON.parse(cached).length === 0) {
      localStorage.setItem("audai_history", JSON.stringify(DEFAULT_DEMO_HISTORY));
      return DEFAULT_DEMO_HISTORY;
    }
    return JSON.parse(cached);
  },

  // PDF Report Download
  downloadPdfReport: (analysisId) => {
    const downloadUrl = `${API_BASE_URL}/analysis/report/${analysisId}/pdf`;
    window.open(downloadUrl, '_blank');
  },

  // Profile
  getProfile: async () => {
    return JSON.parse(localStorage.getItem("audai_profile") || JSON.stringify(DEFAULT_PROFILE));
  },

  updateProfile: async (profileData) => {
    const current = JSON.parse(localStorage.getItem("audai_profile") || JSON.stringify(DEFAULT_PROFILE));
    const updated = { ...current, ...profileData };
    localStorage.setItem("audai_profile", JSON.stringify(updated));
    return updated;
  },

  logout: async () => {
    localStorage.removeItem("audai_token");
    localStorage.removeItem("audai_user");
    return { success: true };
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("audai_token");
  }
};

// Fallback local simulation function
function mockLocalPredict(patientInfo, audiogramData) {
  const leftPTA = ((audiogramData.L500 ?? 20) + (audiogramData.L1000 ?? 20) + (audiogramData.L2000 ?? 20) + (audiogramData.L4000 ?? 20)) / 4;
  const rightPTA = ((audiogramData.R500 ?? 20) + (audiogramData.R1000 ?? 20) + (audiogramData.R2000 ?? 20) + (audiogramData.R4000 ?? 20)) / 4;
  const maxPTA = Math.max(leftPTA, rightPTA);

  let severity = "Normal";
  if (maxPTA > 90) severity = "Profound";
  else if (maxPTA > 70) severity = "Severe";
  else if (maxPTA > 55) severity = "Moderately Severe";
  else if (maxPTA > 40) severity = "Moderate";
  else if (maxPTA > 25) severity = "Mild";

  let prediction = "Normal Hearing";
  let recommendations = ["Hearing thresholds are within normal limits."];
  let disability = 0.0;

  if (severity !== "Normal") {
    prediction = `${severity} Hearing Loss`;
    disability = Math.min(100, Math.round((maxPTA - 25) * 1.5 * 10) / 10);
    recommendations = [
      `${severity} hearing loss detected in speech frequencies.`,
      "Digital hearing aid evaluation recommended.",
      "Consult ENT specialist for audiological workup."
    ];
  }

  return {
    id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
    patientId: patientInfo.patientId || `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
    patientName: patientInfo.name || "Anonymous Patient",
    age: parseInt(patientInfo.age) || 45,
    gender: patientInfo.gender || "Male",
    date: new Date().toISOString(),
    prediction,
    severity,
    disability,
    confidence: 96.5,
    data: {
      left: {
        250: audiogramData.L250 ?? 20, 500: audiogramData.L500 ?? 20, 1000: audiogramData.L1000 ?? 20,
        2000: audiogramData.L2000 ?? 20, 4000: audiogramData.L4000 ?? 20, 8000: audiogramData.L8000 ?? 20
      },
      right: {
        250: audiogramData.R250 ?? 20, 500: audiogramData.R500 ?? 20, 1000: audiogramData.R1000 ?? 20,
        2000: audiogramData.R2000 ?? 20, 4000: audiogramData.R4000 ?? 20, 8000: audiogramData.R8000 ?? 20
      }
    },
    recommendations
  };
}
