import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Hospital, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Activity,
  CheckCircle,
  Save
} from 'lucide-react';
import { mockApi } from '../../services/api';
import DashboardCard from '../../components/DashboardCard/DashboardCard';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    hospital: '',
    department: '',
    title: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await mockApi.getProfile();
        setProfile(data);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          hospital: data.hospital,
          department: data.department,
          title: data.title
        });
      } catch (err) {
        console.error("Failed to load doctor profile", err);
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
      setSuccessMessage('Clinical profile updated successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Activity className="h-8 w-8 text-primary-600 dark:text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div>
        <h2 className="text-3xl font-extrabold font-heading text-slate-800 dark:text-slate-100 tracking-tight">
          Clinician Profile
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review credentials and manage hospital workspace identities.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Details */}
        <div className="md:col-span-1 space-y-6">
          <DashboardCard className="text-center">
            <div className="flex flex-col items-center">
              <img
                src={profile?.avatar}
                alt={profile?.name}
                className="h-24 w-24 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800 shadow-sm"
              />
              <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-slate-200 mt-4 leading-none">
                {profile?.name}
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1.5">{profile?.title}</p>
              
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border border-primary-200/10">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Audiologist
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 dark:border-slate-800/80 pt-6 text-left space-y-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2.5">
                <Hospital className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">{profile?.hospital}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{profile?.phone}</span>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Profile Form */}
        <div className="md:col-span-2">
          <DashboardCard title="Edit Clinic Credentials" subtitle="Ensure details align with state audiology boards.">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 rounded-xl focus:bg-white text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Clinical Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 rounded-xl focus:bg-white text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 rounded-xl focus:bg-white text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 rounded-xl focus:bg-white text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hospital Facility</label>
                  <input
                    type="text"
                    required
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 rounded-xl focus:bg-white text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Clinical Department</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 rounded-xl focus:bg-white text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50 hover:scale-[1.02]"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? 'Saving changes...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </DashboardCard>
        </div>

      </div>

    </div>
  );
}
