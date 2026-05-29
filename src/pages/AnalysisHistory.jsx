import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { History, Calendar, ArrowLeft, ChevronRight, Sparkles, Award, Target, Zap, Clock, Trash2, AlertTriangle } from 'lucide-react';

export default function AnalysisHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/student/history', { headers: { Authorization: `Bearer ${token}` } });
      setHistory(response.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/student/analysis/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setHistory(prev => prev.filter(item => item._id !== id));
      setDeletingId(null);
    } catch (err) {
      alert('System failure during data purge.');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-16 h-16 border-t-2 border-purple-500 border-r-2 border-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 pb-32">
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setDeletingId(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 z-10">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500 mb-4"><AlertTriangle className="w-6 h-6" /></div>
                <h2 className="text-xl font-bold mb-2">Confirm Purge?</h2>
                <p className="text-slate-500 text-xs mb-6 max-w-xs">This action will permanently erase your metrics database references. This cannot be undone.</p>
                <div className="flex gap-4 w-full">
                  <button onClick={() => setDeletingId(null)} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase hover:bg-white/10 text-slate-400">Cancel</button>
                  <button onClick={() => handleDelete(deletingId)} className="flex-1 py-3 bg-rose-500 text-white rounded-xl text-xs font-bold uppercase hover:bg-rose-400">Purge</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => window.location.href = '/dashboard'} className="flex items-center gap-2 text-slate-500 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-widest">Back to Nexus</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-xl">
             <History className="w-3.5 h-3.5 text-purple-400" />
             <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">History</span>
          </div>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2">Analysis History</h1>
          <p className="text-slate-500 text-sm">Review previous telemetry runs inside the Campus Intelligence Matrix.</p>
        </div>

        <div className="space-y-6 relative">
          <div className="absolute left-[27px] top-4 bottom-4 w-px bg-slate-800"></div>
          {history.map((record) => (
            <div key={record._id} className="flex gap-6">
              <div className="relative z-10 shrink-0">
                <div className="w-14 h-14 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center">
                   <Clock className="w-5 h-5 text-slate-600" />
                </div>
              </div>
              <div className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1">
                       <Calendar className="w-3 h-3" /> {new Date(record.timestamp).toLocaleDateString()}
                    </p>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white mb-2">{record.analysisName || record.careerIntelligence?.recommendedDomain || 'Strategic Profile'}</h3>
                      <button onClick={() => setDeletingId(record._id)} className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all">
                         <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                       <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase">Ready: {record.placementReadiness?.probability}%</span>
                       <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-bold uppercase">Score: {record.performanceIntelligence?.score}</span>
                    </div>
                  </div>
                  <button onClick={() => window.location.href = `/dashboard?historyId=${record._id}`} className="px-5 py-3 bg-white text-black font-bold text-xs rounded-xl hover:bg-purple-500 hover:text-white transition-all flex items-center gap-2">
                    RESTORE <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {history.length === 0 && (
            <div className="py-16 text-center bg-[#0a0a0a] border border-white/5 rounded-2xl">
               <Award className="w-12 h-12 text-slate-800 mx-auto mb-4" />
               <h3 className="text-lg font-bold text-white mb-1">No Analysis Records</h3>
               <p className="text-slate-500 text-xs max-w-xs mx-auto mb-4">Initialize your first telemetry performance score to track evolution.</p>
               <button onClick={() => window.location.href = '/dashboard'} className="px-5 py-2.5 bg-purple-500 text-white font-bold text-xs rounded-lg">START ANALYSIS</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
