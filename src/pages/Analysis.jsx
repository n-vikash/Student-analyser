import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BrainCircuit, Loader2, Cpu, Database, Network, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function Analysis() {
  const [formData, setFormData] = useState({
    analysisName: `Analysis - ${new Date().toLocaleDateString()}`,
    codingScore: 75,
    communicationScore: 70,
    aptitudeScore: 80,
    attendance: 85,
    cgpa: 8.2,
    internalMarks: 78,
    projects: 3,
    certifications: 2,
    technicalSkills: 'React, Node.js, Python, SQL, Machine Learning, Web Development'
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const stepsText = [
    "Gathering Academic Intelligence...", "Syncing with Academic Bio-Data...",
    "Connecting to MongoDB Neural Storage...", "Processing AI Predictive Analytics...",
    "Running Gradient Boosted Career Models...", "Executing SVM Skill Identification...",
    "Finalizing Cluster-Based Career Insights...", "Generating Future Career Roadmap..."
  ];

  const handleRunAnalysis = async (e) => {
    e.preventDefault();
    setAnalyzing(true);
    setError('');
    for (let i = 0; i < stepsText.length; i++) {
        setStep(i);
        await new Promise(r => setTimeout(r, 450));
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/analyze/student', formData, { headers: { Authorization: `Bearer ${token}` } });
      navigate('/dashboard');
    } catch (err) {
      console.error("Analysis failed", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login/student';
        return;
      }
      setError(err.response?.data?.details || err.response?.data?.error || "Pipeline analysis failed. Please verify your connection or retry later.");
      setAnalyzing(false);
    }
  };

  if (analyzing) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#050505]">
      <div className="relative w-48 h-48 mb-12">
         <div className="absolute inset-0 bg-cyan-500/10 blur-[60px] rounded-full animate-pulse" />
         <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="w-full h-full border border-cyan-500/10 rounded-full flex items-center justify-center">
            <div className="w-40 h-40 border border-dashed border-cyan-500/20 rounded-full" />
         </motion.div>
         <div className="absolute inset-0 flex items-center justify-center">
           <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
             <BrainCircuit className="w-16 h-16 text-cyan-400" />
           </motion.div>
         </div>
      </div>
      <div className="text-center">
         <h2 className="text-3xl font-light mb-4">Neural <span className="font-bold text-cyan-400">Intelligence</span> Pipeline</h2>
         <div className="font-mono text-xs text-cyan-300 flex items-center gap-2 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> {stepsText[step]}
         </div>
      </div>
      <div className="mt-12 w-full max-w-sm bg-white/5 rounded-full h-1 overflow-hidden">
         <motion.div initial={{ width: 0 }} animate={{ width: `${(step + 1) * (100 / stepsText.length)}%` }} className="h-full bg-cyan-400" />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-4">Autonomous Analysis Engine v2.0</div>
        <h1 className="text-4xl font-black mb-4">Complete Your <span className="text-cyan-400">AI Profile</span></h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">Provide performance telemetry parameters to compile your placement probabilities.</p>
      </div>

      <form onSubmit={handleRunAnalysis} className="space-y-6">
        <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/5">
          <div className="flex items-center gap-3 mb-6"><Cpu className="w-5 h-5 text-cyan-400" /> <h3 className="font-bold text-white text-sm">Session Name</h3></div>
          <input type="text" value={formData.analysisName} onChange={e => setFormData({ ...formData, analysisName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-cyan-400 text-sm" required />
        </div>

        <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/5">
          <div className="flex items-center gap-3 mb-6"><Database className="w-5 h-5 text-cyan-400" /> <h3 className="font-bold text-white text-sm">Academic Highs</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[['Attendance %', 'attendance', 'number'], ['Current CGPA', 'cgpa', 'number'], ['Internal Marks (%)', 'internalMarks', 'number']].map(([label, key, type]) => (
              <div key={key} className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
                <input type={type} step={key === 'cgpa' ? '0.01' : '1'} value={formData[key]} onChange={e => setFormData({ ...formData, [key]: type === 'number' ? (key === 'cgpa' ? parseFloat(e.target.value) : parseInt(e.target.value)) : e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-cyan-400 text-white text-sm" required />
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/5">
          <div className="flex items-center gap-3 mb-6"><Network className="w-5 h-5 text-purple-400" /> <h3 className="font-bold text-white text-sm">Competency Scores</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[['Coding', 'codingScore'], ['Communication', 'communicationScore'], ['Aptitude', 'aptitudeScore']].map(([label, key]) => (
              <div key={key} className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500"><span>{label}</span><span className="text-cyan-400">{formData[key]}</span></div>
                <input type="range" min="0" max="100" value={formData[key]} onChange={e => setFormData({ ...formData, [key]: parseInt(e.target.value) })} className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-white/5" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 space-y-4">
             {[['Projects Completed', 'projects'], ['Certifications', 'certifications']].map(([label, key]) => (
                <div key={key} className="space-y-1.5">
                   <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</label>
                   <input type="number" value={formData[key]} onChange={e => setFormData({ ...formData, [key]: parseInt(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-cyan-400 text-white text-sm" />
                </div>
             ))}
          </div>
          <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 space-y-1.5">
             <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Areas of Interest</label>
             <textarea value={formData.technicalSkills} onChange={e => setFormData({ ...formData, technicalSkills: e.target.value })} className="w-full h-[110px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 text-white text-sm resize-none" placeholder="e.g. AWS, React, Python, ML" />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono rounded-xl flex items-center gap-2">
             <span>⚠️</span>
             <span>{error}</span>
          </div>
        )}

        <button type="submit" className="w-full py-5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-black text-lg rounded-2xl transition-all shadow-[0_10px_30px_rgba(34,211,238,0.2)] flex items-center justify-center gap-2 uppercase tracking-widest">
          Execute Intelligence Pipeline <ChevronRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
