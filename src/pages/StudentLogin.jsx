import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BrainCircuit, ArrowRight, Loader2, Mail, Lock } from 'lucide-react';
import axios from 'axios';

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/signin', { email, password });
      const { token, user } = response.data;
      if (!user || !token) throw new Error('Response missing critical metadata.');
      if (user.role !== 'student') {
        setError('Unauthorized: Administrative portal is separate.');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Incorrect access credentials or server timeout.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#050505]">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <BrainCircuit className="text-white w-7 h-7" />
          </motion.div>
          <h1 className="text-3xl font-black mb-2 tracking-tight text-white">Student Nexus</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Future AI Access</p>
        </div>

        <div className="p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Neural ID (Email)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-xl px-11 py-3 text-white focus:border-cyan-400 outline-none text-sm animate-none" placeholder="student@university.edu" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-xl px-11 py-3 text-white focus:border-cyan-400 outline-none text-sm" placeholder="••••••••" required />
              </div>
            </div>

            {error && <p className="text-red-400 text-xs text-center font-bold">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(34,211,238,0.2)] uppercase tracking-widest text-sm">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>Initialize Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            No profile? <Link to="/signup/student" className="text-cyan-400 hover:text-cyan-300 font-bold">Register Student</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
