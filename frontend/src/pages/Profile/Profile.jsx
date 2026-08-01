import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Hospital, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Activity,
  CheckCircle,
  Save,
  Camera,
  Upload,
  Check
} from 'lucide-react';
import { mockApi } from '../../services/api';
import DashboardCard from '../../components/DashboardCard/DashboardCard';

const AVATAR_PRESETS = [
  "https://ui-avatars.com/api/?name=Dr+Mayank+Sharma&background=2563eb&color=ffffff&size=250&bold=true",
  "https://ui-avatars.com/api/?name=Dr+Sarah+Jenkins&background=0d9488&color=ffffff&size=250&bold=true",
  "https://ui-avatars.com/api/?name=Dr+Robert+Chen&background=4f46e5&color=ffffff&size=250&bold=true",
  "https://ui-avatars.com/api/?name=Dr+Elena+Rostova&background=0284c7&color=ffffff&size=250&bold=true"
];

const SPECIALIZATION_TAGS = [
  "Pure Tone Audiometry (PTA)",
  "Speech Audiometry",
  "Cochlear Implant Fitting",
  "Hearing Loss Disability Calculation",
  "ENT Surgical Evaluation",
  "Pediatric Hearing Rehabilitation"
];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    hospital: '',
    department: '',
    title: '',
    licenseNumber: '',
    avatar: '',
    reportTitle: '',
    disabilityStandard: 'WHO',
    specializations: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'credentials', 'preferences'
  const avatarInputRef = useRef(null);

  const handleCustomAvatarUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file (PNG, JPG, JPEG).");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData(prev => ({
          ...prev,
          avatar: uploadEvent.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await mockApi.getProfile();
        setProfile(data);
        setFormData({
          name: data.name || 'Dr. Mayank Sharma',
          email: data.email || 'mayank@audai.com',
          phone: data.phone || '+91 98765 43210',
          hospital: data.hospital || 'AIIMS Audiology & ENT Center',
          department: data.department || 'Audiology & Otolaryngology',
          title: data.title || 'Chief Audiologist & ENT Specialist',
          licenseNumber: data.licenseNumber || 'RCI-AUD-2026-9042',
          avatar: data.avatar || AVATAR_PRESETS[0],
          reportTitle: data.reportTitle || 'AudAI Pure Tone Audiometry Diagnostic Report',
          disabilityStandard: data.disabilityStandard || 'WHO',
          specializations: data.specializations || [SPECIALIZATION_TAGS[0], SPECIALIZATION_TAGS[3]]
        });
      } catch (err) {
        console.error("Failed to load clinician profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    try {
      const updated = await mockApi.updateProfile(formData);
      setProfile(updated);
      setSuccessMessage('Clinician profile and report preferences saved successfully.');
      setTimeout(() => setSuccessMessage(''), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSpecialization = (tag) => {
    setFormData(prev => {
      const exists = prev.specializations.includes(tag);
      const updated = exists 
        ? prev.specializations.filter(t => t !== tag)
        : [...prev.specializations, tag];
      return { ...prev, specializations: updated };
    });
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Activity className="h-8 w-8 text-primary-600 dark:text-primary-500 animate-spin" />
      </div>
    );
  }

  // Common high-contrast input style
  const inputStyle = "w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-semibold rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs transition-all shadow-sm placeholder-slate-400 dark:placeholder-slate-500";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-heading text-slate-800 dark:text-slate-100 tracking-tight">
            Clinician Profile & Preferences
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Customize your doctor profile, avatar, medical license, and PDF report branding.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-200/80 dark:bg-slate-900 p-1 rounded-xl border border-slate-300/50 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              activeTab === 'credentials'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Credentials & Badges
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              activeTab === 'preferences'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            PDF Branding
          </button>
        </div>
      </div>

      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-sm rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 shadow-sm font-semibold"
        >
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
          <span>{successMessage}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card & Avatar Customizer */}
        <div className="md:col-span-1 space-y-6">
          <DashboardCard className="text-center">
            <div className="flex flex-col items-center">
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleCustomAvatarUpload}
                accept="image/*"
                className="hidden"
              />
              <div 
                onClick={() => avatarInputRef.current?.click()}
                className="relative group cursor-pointer"
                title="Click to upload custom profile picture"
              >
                <img
                  src={formData.avatar}
                  alt=""
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Doctor')}&background=2563eb&color=ffffff&size=250&bold=true`;
                  }}
                  className="h-28 w-28 rounded-2xl object-cover border-2 border-primary-500 dark:border-primary-400 shadow-md transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/70 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-bold gap-1">
                  <Camera className="h-6 w-6" />
                  <span>Upload Photo</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors shadow-sm"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload Custom PFP
              </button>

              <h3 className="text-lg font-extrabold font-heading text-slate-900 dark:text-slate-100 mt-3 leading-none">
                {formData.name}
              </h3>
              <p className="text-xs text-primary-600 dark:text-primary-400 font-extrabold mt-1.5">{formData.title}</p>
              
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                License: {formData.licenseNumber}
              </div>
            </div>

            {/* Avatar Selector */}
            <div className="mt-6 border-t border-slate-200/60 dark:border-slate-800/80 pt-4 text-left">
              <label className="block text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Or Select Preset PFP
              </label>
              <div className="flex items-center gap-2 justify-center">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: preset })}
                    className={`h-10 w-10 rounded-xl overflow-hidden border-2 transition-all hover:scale-110 ${
                      formData.avatar === preset ? 'border-primary-500 ring-2 ring-primary-500/40 opacity-100' : 'border-slate-300 dark:border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={preset} 
                      alt="" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=Dr+${idx+1}&background=2563eb&color=ffffff&size=100&bold=true`;
                      }}
                      className="h-full w-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="mt-6 border-t border-slate-200/60 dark:border-slate-800/80 pt-4 text-left space-y-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Hospital className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">{formData.hospital}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">{formData.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{formData.phone}</span>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Main Editable Form */}
        <div className="md:col-span-2">
          <DashboardCard 
            title={
              activeTab === 'profile' ? "Edit Personal Details" :
              activeTab === 'credentials' ? "Clinical Credentials & Badges" :
              "PDF Report Branding & Settings"
            } 
            subtitle="Customize how your profile and generated PDF reports appear to patients and colleagues."
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* TAB 1: PERSONAL PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Clinical Designation</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className={inputStyle}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Contact Phone</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={inputStyle}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Hospital Facility</label>
                      <input
                        type="text"
                        required
                        value={formData.hospital}
                        onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Clinical Department</label>
                      <input
                        type="text"
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CREDENTIALS & SPECIALIZATIONS */}
              {activeTab === 'credentials' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Medical / Rehabilitation Council License No.
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      placeholder="e.g. RCI-AUD-2026-9042"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                      Clinical Specializations & Badges
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SPECIALIZATION_TAGS.map((tag) => {
                        const active = formData.specializations.includes(tag);
                        return (
                          <button
                            type="button"
                            key={tag}
                            onClick={() => toggleSpecialization(tag)}
                            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all text-xs ${
                              active
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/60 text-primary-900 dark:text-primary-200 font-extrabold ring-1 ring-primary-500/50 shadow-sm'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <div className={`h-4.5 w-4.5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                              active ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                            }`}>
                              {active && <Check className="h-3 w-3 stroke-[3]" />}
                            </div>
                            <span className="leading-snug">{tag}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PDF REPORT PREFERENCES */}
              {activeTab === 'preferences' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Custom Report Title (Printed on PDF)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.reportTitle}
                      onChange={(e) => setFormData({ ...formData, reportTitle: e.target.value })}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Disability Calculation Guidelines Standard
                    </label>
                    <select
                      value={formData.disabilityStandard}
                      onChange={(e) => setFormData({ ...formData, disabilityStandard: e.target.value })}
                      className={inputStyle}
                    >
                      <option value="WHO">WHO Standard Pure Tone Average (500, 1000, 2000, 4000 Hz)</option>
                      <option value="MSJE">Ministry of Social Justice & Empowerment (Govt of India)</option>
                      <option value="ANSI">ANSI S3.6 Clinical Standard</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-500/20 transition-all disabled:opacity-50 hover:scale-[1.02]"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? 'Saving changes...' : 'Save Profile & Settings'}
                </button>
              </div>
            </form>
          </DashboardCard>
        </div>

      </div>

    </div>
  );
}
