import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BrainCircuit, ArrowRight, Loader2, User, Mail, Landmark, GraduationCap, Lock } from 'lucide-react';
import axios from 'axios';

export default function StudentSignup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', college: '', department: '', year: 1, role: 'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/signup', formData);
      navigate('/login/student');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputs = [
    { label: "Full Name", key: "name", type: "text", icon: User, placeholder: "Alex Johnson" },
    { label: "Email ID", key: "email", type: "email", icon: Mail, placeholder: "alex@university.edu" },
    { label: "College / University", key: "college", type: "text", icon: Landmark, placeholder: "Tech Institute" },
    { label: "Branch / Department", key: "department", type: "text", icon: GraduationCap, placeholder: "AI & Data Science" }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#050505]">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <BrainCircuit className="text-white w-7 h-7" />
          </motion.div>
          <h1 className="text-3xl font-black text-white">Student Registry</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Setup Personal Study-Track Metrics</p>
        </div>

        <div className="p-8 rounded-2xl bg-[#0f0f0f] border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inputs.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{field.label}</label>
                  <div className="relative">
                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input type={field.type} value={formData[field.key]} onChange={e => setFormData({ ...formData, [field.key]: e.target.value })} className="w-full bg-[#050505] border border-white/10 rounded-xl px-11 py-3 text-white focus:border-cyan-400 outline-none text-sm" placeholder={field.placeholder} required />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Create Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full bg-[#050505] border border-white/10 rounded-xl px-11 py-3 text-white focus:border-cyan-400 outline-none text-sm" placeholder="••••••••" required />
              </div>
            </div>

            {error && <p className="text-red-400 text-xs text-center font-bold">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(34,211,238,0.2)] uppercase tracking-widest text-sm">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Register Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Already registered? <Link to="/login/student" className="text-cyan-400 hover:text-cyan-300 font-bold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
