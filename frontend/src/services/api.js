// Mock API Service for AudAI Hackathon Demo
// Stores data in LocalStorage to maintain state across page reloads

const DEFAULT_HISTORY = [
  {
    id: "PTA-9821",
    patientId: "P-1042",
    patientName: "John Doe",
    age: 45,
    gender: "Male",
    date: "2026-07-31T10:30:00Z",
    prediction: "Sensorineural Hearing Loss",
    severity: "Moderate",
    disability: 32.5,
    confidence: 94.8,
    data: {
      left: { 250: 25, 500: 30, 1000: 45, 2000: 50, 4000: 55, 8000: 60 },
      right: { 250: 20, 500: 25, 1000: 40, 2000: 45, 4000: 50, 8000: 55 }
    },
    recommendations: [
      "Binaural digital hearing aid evaluation is highly recommended.",
      "Annual audiological re-evaluation to monitor thresholds.",
      "Counseling on noise conservation strategies and assistive listening devices (ALDs)."
    ]
  },
  {
    id: "PTA-9820",
    patientId: "P-1041",
    patientName: "Robert Chen",
    age: 67,
    gender: "Male",
    date: "2026-07-30T15:20:00Z",
    prediction: "Conductive Hearing Loss",
    severity: "Severe",
    disability: 68.0,
    confidence: 89.2,
    data: {
      left: { 250: 55, 500: 65, 1000: 70, 2000: 75, 4000: 75, 8000: 80 },
      right: { 250: 15, 500: 20, 1000: 20, 2000: 25, 4000: 25, 8000: 30 }
    },
    recommendations: [
      "Urgent referral to an ENT Specialist for evaluation of conductive pathology (e.g., otosclerosis, middle ear effusion).",
      "Discuss surgical options vs. bone-anchored hearing systems (BAHS).",
      "Immediate medical clearance required before any hearing aid fitting."
    ]
  },
  {
    id: "PTA-9819",
    patientId: "P-1040",
    patientName: "Elena Rostova",
    age: 29,
    gender: "Female",
    date: "2026-07-30T09:15:00Z",
    prediction: "Normal Hearing",
    severity: "Normal",
    disability: 0.0,
    confidence: 99.1,
    data: {
      left: { 250: 10, 500: 10, 1000: 15, 2000: 15, 4000: 10, 8000: 15 },
      right: { 250: 15, 500: 10, 1000: 10, 2000: 15, 4000: 15, 8000: 10 }
    },
    recommendations: [
      "Hearing thresholds are within normal limits bilaterally.",
      "Routine follow-up in 2-3 years, or sooner if patient notices changes in hearing or experiences tinnitus.",
      "Education on hearing conservation practices."
    ]
  },
  {
    id: "PTA-9818",
    patientId: "P-1039",
    patientName: "Marcus Vance",
    age: 58,
    gender: "Male",
    date: "2026-07-29T14:45:00Z",
    prediction: "Mixed Hearing Loss",
    severity: "Moderate-to-Severe",
    disability: 52.3,
    confidence: 91.5,
    data: {
      left: { 250: 40, 500: 45, 1000: 55, 2000: 60, 4000: 65, 8000: 70 },
      right: { 250: 45, 500: 50, 1000: 60, 2000: 65, 4000: 70, 8000: 75 }
    },
    recommendations: [
      "ENT consultation to evaluate and manage the conductive component.",
      "Dual-sensory support planning and audiological evaluation for power-level digital hearing aids.",
      "Consider assistive listening accessories for television and phone conversation."
    ]
  }
];

const DEFAULT_PROFILE = {
  name: "Dr. Sarah Jenkins",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=250&h=250&fit=crop",
  email: "s.jenkins@metaclinic.ai",
  phone: "+1 (555) 382-9102",
  hospital: "Metro Audiology & ENT Center",
  department: "Audiology and Otolaryngology",
  title: "Chief Audiologist",
  joinedDate: "October 2024"
};

// Initialize localStorage if empty
if (!localStorage.getItem("audai_history")) {
  localStorage.setItem("audai_history", JSON.stringify(DEFAULT_HISTORY));
}
if (!localStorage.getItem("audai_profile")) {
  localStorage.setItem("audai_profile", JSON.stringify(DEFAULT_PROFILE));
}

// Simulates network latency
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // Authentication Mock
  login: async (email, password) => {
    await delay(1000);
    if (email && password) {
      const token = "mock-jwt-token-xyz-123";
      localStorage.setItem("audai_token", token);
      localStorage.setItem("audai_user_email", email);
      return { success: true, token, email, name: "Dr. Sarah Jenkins" };
    }
    throw new Error("Invalid email or password");
  },

  signup: async (doctorData) => {
    await delay(1200);
    if (doctorData.email && doctorData.password) {
      // Update profile with signup details
      const profile = {
        ...DEFAULT_PROFILE,
        name: doctorData.name || "Dr. New Doctor",
        hospital: doctorData.hospital || "General Hospital",
        email: doctorData.email
      };
      localStorage.setItem("audai_profile", JSON.stringify(profile));
      return { success: true, message: "Account created successfully" };
    }
    throw new Error("Invalid signup details");
  },

  // AI Prediction Simulation
  predict: async (patientInfo, audiogramData) => {
    await delay(2500); // Longer delay to simulate processing steps
    
    // Heuristic analysis based on pure tone average (PTA)
    // PTA is computed at 500, 1000, 2000, 4000 Hz
    const leftPTA = (audiogramData.L500 + audiogramData.L1000 + audiogramData.L2000 + audiogramData.L4000) / 4;
    const rightPTA = (audiogramData.R500 + audiogramData.R1000 + audiogramData.R2000 + audiogramData.R4000) / 4;
    const maxPTA = Math.max(leftPTA, rightPTA);

    // Determine Severity
    let severity = "Normal";
    if (maxPTA > 90) severity = "Profound";
    else if (maxPTA > 70) severity = "Severe";
    else if (maxPTA > 55) severity = "Moderately-Severe";
    else if (maxPTA > 40) severity = "Moderate";
    else if (maxPTA > 20) severity = "Mild";

    // Determine type (Conductive, Sensorineural, Mixed) based on random/deterministic factors
    let prediction = "Normal Hearing";
    let recommendations = [];
    let disability = 0.0;
    
    if (severity !== "Normal") {
      const isConductive = (audiogramData.L250 - audiogramData.R250 > 15) || (patientInfo.name.length % 3 === 0);
      const isMixed = (maxPTA > 50 && patientInfo.age > 60 && patientInfo.name.length % 2 === 0);
      
      if (isMixed) {
        prediction = "Mixed Hearing Loss";
        recommendations = [
          "ENT consultation to evaluate and manage the conductive component.",
          "Audiological evaluation for power-level digital hearing aids.",
          "Counseling on visual communication cues and assistive listening systems."
        ];
        disability = Math.min(100, Math.max(10, Math.round((maxPTA - 25) * 1.5 * 10) / 10));
      } else if (isConductive) {
        prediction = "Conductive Hearing Loss";
        recommendations = [
          "Urgent ENT evaluation to explore medical or surgical management (e.g. middle ear reconstructive options).",
          "Trial of bone conduction hearing device or conventional hearing systems if surgery is contraindicated.",
          "Follow-up PTA post ENT intervention."
        ];
        disability = Math.min(100, Math.max(5, Math.round((maxPTA - 25) * 1.2 * 10) / 10));
      } else {
        prediction = "Sensorineural Hearing Loss";
        recommendations = [
          "Audiological consultation for prescription and fitting of digital hearing aids.",
          "Counseling on noise exposure reduction, stress management, and hearing conservation.",
          "Consider referral for cochlear implant evaluation if speech discrimination is extremely poor."
        ];
        disability = Math.min(100, Math.max(8, Math.round((maxPTA - 25) * 1.6 * 10) / 10));
      }
    } else {
      recommendations = [
        "Hearing thresholds are within normal limits bilaterally.",
        "Routine audiometric screening in 2 years.",
        "Maintain hearing protection in recreational noise environments."
      ];
    }

    const confidence = Math.round((85 + Math.random() * 14) * 10) / 10;
    const reportId = `PTA-${Math.floor(1000 + Math.random() * 9000)}`;

    const newResult = {
      id: reportId,
      patientId: patientInfo.patientId || `P-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: patientInfo.name || "Anonymous Patient",
      age: parseInt(patientInfo.age) || 30,
      gender: patientInfo.gender || "Other",
      date: new Date().toISOString(),
      prediction,
      severity,
      disability,
      confidence,
      data: {
        left: {
          250: audiogramData.L250,
          500: audiogramData.L500,
          1000: audiogramData.L1000,
          2000: audiogramData.L2000,
          4000: audiogramData.L4000,
          8000: audiogramData.L8000,
        },
        right: {
          250: audiogramData.R250,
          500: audiogramData.R500,
          1000: audiogramData.R1000,
          2000: audiogramData.R2000,
          4000: audiogramData.R4000,
          8000: audiogramData.R8000,
        }
      },
      recommendations
    };

    // Save prediction in history
    const history = JSON.parse(localStorage.getItem("audai_history") || "[]");
    history.unshift(newResult);
    localStorage.setItem("audai_history", JSON.stringify(history));

    return newResult;
  },

  // History Retrieve Mock
  getHistory: async () => {
    await delay(600);
    return JSON.parse(localStorage.getItem("audai_history") || "[]");
  },

  // Profile Mock
  getProfile: async () => {
    await delay(400);
    return JSON.parse(localStorage.getItem("audai_profile") || "{}");
  },

  updateProfile: async (profileData) => {
    await delay(600);
    const currentProfile = JSON.parse(localStorage.getItem("audai_profile") || "{}");
    const updated = { ...currentProfile, ...profileData };
    localStorage.setItem("audai_profile", JSON.stringify(updated));
    return updated;
  },

  logout: async () => {
    await delay(300);
    localStorage.removeItem("audai_token");
    localStorage.removeItem("audai_user_email");
    return { success: true };
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("audai_token");
  }
};
