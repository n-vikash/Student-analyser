import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Trophy, Target, Briefcase, Zap, BrainCircuit, Loader2, FileText, CheckCircle2, AlertCircle, Sparkles, ChevronRight, History, Upload, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const historyId = searchParams.get('historyId');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMlTab, setActiveMlTab] = useState('lr');
  const [error, setError] = useState('');
  const [isHistorical, setIsHistorical] = useState(false);
  const [resumeIntelData, setResumeIntelData] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const url = historyId ? `/api/student/analysis/${historyId}` : '/api/student/analytics';
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setAnalytics(response.data);
      setIsHistorical(!!historyId);
      if (response.data?.resumeIntel) setResumeIntelData(response.data.resumeIntel);
    } catch (err) {
      console.error("[FETCH ANALYTICS ERROR]", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login/student';
        return;
      }
      setError(err.response?.data?.details || err.response?.data?.error || err.message || "Failed to retrieve compiled ML predictions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, [historyId]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF resume files are accepted.');
      return;
    }
    setUploadLoading(true);
    setUploadError('');
    setResumeIntelData(null); // Clear previous results to prevent stale screen state during new processing
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/student/resume/analyze', formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setResumeIntelData(response.data);
    } catch (err) {
      console.error("Resume ingestion failed:", err);
      const serverErr = err.response?.data?.details || err.response?.data?.error || 'Neural ingestion of resume PDF failed.';
      setUploadError(serverErr);
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-cyan-500 font-mono text-xs uppercase animate-pulse">Running ML Core predictions...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-16 text-center min-h-[70vh] flex flex-col justify-center items-center">
      <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 text-rose-500 text-2xl">⚠️</div>
      <h2 className="text-3xl font-black mb-4">Telemetry Connection Failure</h2>
      <p className="text-slate-400 mb-8 max-w-md text-xs font-mono bg-white/5 py-4 px-5 rounded-2xl border border-white/10">{error}</p>
      <button onClick={fetchAnalytics} className="px-6 py-4 bg-cyan-500 text-black rounded-xl font-bold hover:bg-cyan-400 transition-all text-xs uppercase flex items-center gap-2 cursor-pointer">Retry Connecting <RefreshCw className="w-4 h-4" /></button>
    </div>
  );

  if (!analytics) return (
    <div className="max-w-4xl mx-auto p-16 text-center min-h-[70vh] flex flex-col justify-center items-center">
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6"><BrainCircuit className="w-10 h-10 text-cyan-400" /></div>
      <h2 className="text-3xl font-black mb-4">No Performance Models Found</h2>
      <p className="text-slate-400 mb-8 max-w-sm text-sm">Initialize your academic, aptitude, and skill metric telemetry to compile ML predictions.</p>
      <a href="/analysis" className="px-6 py-4 bg-cyan-500 text-black rounded-xl font-bold hover:bg-cyan-400 transition-all text-xs uppercase flex items-center gap-2">Initialize Model <ChevronRight className="w-4 h-4" /></a>
    </div>
  );

  const { 
    performanceIntelligence = { score: 50, strength: "N/A" }, 
    placementReadiness = { isEligible: false, status: "Not Eligible" }, 
    careerIntelligence = { recommendedDomain: "Full Stack Developer", confidence: 50 }, 
    skillGrowth = { level: "Beginner", cluster: 0, radarData: [] }, 
    inputData = {}
  } = analytics;

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-8">
        <div>
          <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest inline-block mb-3">{isHistorical ? 'Historical Blueprint' : 'Active Prediction'}</div>
          <h1 className="text-4xl font-black tracking-tight">Future <span className="text-cyan-400">Career AI</span> Predictor</h1>
          <p className="text-slate-400 text-xs uppercase tracking-wider mt-1 font-mono">Telemetry outputs compiled from Linear Reg, Logistic Reg, SVM & K-Means</p>
        </div>
        <div className="flex gap-3">
          <a href="/dashboard/history" className="px-4 py-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold rounded-xl hover:bg-purple-500/20 text-xs uppercase flex items-center gap-1.5"><History className="w-4 h-4" /> Snapshot History</a>
          <a href="/analysis" className="px-5 py-3 bg-cyan-500 text-black font-black rounded-xl hover:bg-cyan-400 text-xs uppercase flex items-center gap-1.5 shadow-[0_4px_20px_rgba(34,211,238,0.25)]"><Zap className="w-4 h-4" /> Run Analytics</a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <PredictionCard title="Overall Score" subtitle="Linear Reg." value={performanceIntelligence.score} subValue={`Strength: ${performanceIntelligence.strength}`} icon={Trophy} color="text-cyan-400 bg-cyan-400/10 border-cyan-400/20" footer="Inputs: Attendance, CGPA, Aptitude" />
        <PredictionCard title="Placement Pool" subtitle="Logistic Reg." value={placementReadiness.isEligible ? "ELIGIBLE" : "NOT ELIGIBLE"} subValue={placementReadiness.isEligible ? "Threshold achieved" : "Enhance score criteria"} icon={Target} color="text-emerald-400 bg-emerald-400/10 border-emerald-400/20" footer="Threshold: performance >= 75%" />
        <PredictionCard title="Career Suitability" subtitle="SVM classifier" value={careerIntelligence.recommendedDomain} subValue={`Confidence: ${careerIntelligence.confidence}%`} icon={Briefcase} color="text-purple-400 bg-purple-400/10 border-purple-400/20" footer="Interests & skills alignment" isLarge />
        <PredictionCard title="Skill Segment" subtitle="K-Means node" value={skillGrowth.level} subValue={`Segment node #${skillGrowth.cluster}`} icon={Zap} color="text-amber-400 bg-amber-400/10 border-amber-400/20" footer="Multi-dimensional cluster density" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 p-8 bg-neutral-900 border border-white/5 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">Model Feature Projections</h3>
            {skillGrowth.radarData && skillGrowth.radarData.length > 0 ? (
              <div className="h-[200px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillGrowth.radarData}>
                    <PolarGrid stroke="#ffffff08" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                    <Radar dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.12} strokeWidth={1.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : <div className="h-[200px] flex items-center justify-center text-slate-600 text-xs">Dimensions missing</div>}
          </div>
          <div className="pt-4 border-t border-white/5 space-y-2 text-xs">
            {[['Attendance', `${inputData.attendance || 75}%`], ['CGPA Input', inputData.cgpa || 7.5], ['Aptitude Scale', `${inputData.aptitudeScore || 50}/100`], ['Coding Capacity', `${inputData.codingScore || 50}/100`]].map(([lbl, val]) => (
              <div key={lbl} className="flex justify-between"><span className="text-slate-500">{lbl}:</span><span className="text-slate-300 font-bold">{val}</span></div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 p-8 bg-neutral-900 border border-white/5 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl"><FileText className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white">ATS Resume Index Scan</h3><p className="text-[10px] text-slate-500 uppercase">{resumeIntelData ? "Analysis Complete" : "Interactive Block Locked"}</p></div>
            </div>
            {resumeIntelData && (
              <button onClick={() => document.getElementById('resume-trigger')?.click()} className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-[10px] font-bold uppercase border border-white/5 flex items-center gap-1.5"><RefreshCw className="w-3 h-3" /> Re-upload</button>
            )}
          </div>
          <input id="resume-trigger" type="file" accept=".pdf" hidden onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />

          {!resumeIntelData ? (
            <div onDragOver={e => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={e => { e.preventDefault(); setIsDragging(false); handleFileUpload(e.dataTransfer.files?.[0]); }} onClick={() => document.getElementById('resume-trigger')?.click()} className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${isDragging ? 'border-purple-400 bg-purple-500/5' : 'border-white/10 hover:border-purple-500/30'}`}>
              {uploadLoading ? (
                <div className="flex flex-col items-center gap-2"><Loader2 className="w-8 h-8 text-purple-400 animate-spin" /><p className="text-[10px] text-purple-400 uppercase tracking-widest animate-pulse">Running Ingestion Pipeline...</p></div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-slate-500" />
                  <p className="text-sm text-white font-bold">Drag and drop Resume PDF, or select file</p>
                  <p className="text-[10px] text-slate-500 uppercase">Limit 4MB pdf file size</p>
                </>
              )}
              {uploadError && <p className="text-xs text-rose-500 bg-rose-500/5 px-3 py-1.5 rounded border border-rose-500/10 mt-2">{uploadError}</p>}
            </div>
          ) : (
            <div className="space-y-6">


              <div className="flex items-center gap-4 p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                <div className="w-16 h-16 shrink-0 flex items-center justify-center border-2 border-purple-500 rounded-full font-mono font-black text-xl text-purple-400">{resumeIntelData.atsScore || 70}%</div>
                <div><h4 className="text-sm font-bold text-white">Overall ATS PARITY Coefficient</h4><p className="text-xs text-slate-500">Represents keywords suitability with SVM recommended metrics: {careerIntelligence.recommendedDomain}.</p></div>
              </div>

              {resumeIntelData.extractedSkills?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] text-purple-400 font-bold uppercase tracking-widest pl-0.5">Identified Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeIntelData.extractedSkills.map((s, i) => <span key={i} className="px-2.5 py-1 bg-purple-500/5 border border-purple-500/10 text-purple-300 rounded text-[10px] font-mono">{s}</span>)}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/[0.01] rounded-2xl border border-white/5"><span className="text-[9px] text-rose-400 font-bold uppercase block mb-3 pl-0.5">Missing Keys</span>
                  <ul className="space-y-2">
                    {resumeIntelData.missingKeywords?.length > 0 ? resumeIntelData.missingKeywords.map((k, i) => (
                      <li key={i} className="flex gap-2 text-[11px] text-slate-400"><AlertCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" /> {k}</li>
                    )) : <li className="text-[11px] text-slate-500 font-bold flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> No missing target keys</li>}
                  </ul>
                </div>
                <div className="p-4 bg-white/[0.01] rounded-2xl border border-white/5"><span className="text-[9px] text-emerald-400 font-bold uppercase block mb-3 pl-0.5">Actionable Target Adjustments</span>
                  <ul className="space-y-2">
                    {resumeIntelData.improvements?.length > 0 ? resumeIntelData.improvements.map((k, i) => (
                      <li key={i} className="flex gap-2 text-[11px] text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" /> {k}</li>
                    )) : <li className="text-[11px] text-slate-500 font-bold">Optimal format layout</li>}
                  </ul>
                </div>
              </div>

              {resumeIntelData.recommendedProjects?.length > 0 && (
                <div className="border-t border-white/5 pt-4">
                  <span className="text-[9px] text-cyan-400 font-bold uppercase block mb-3">Project Enhancements Recommendations</span>
                  <div className="grid grid-cols-1 gap-2">
                    {resumeIntelData.recommendedProjects.map((p, i) => <div key={i} className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl flex gap-2"><Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" /> <p className="text-[11px] text-slate-300 font-semibold">{p}</p></div>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>


    </div>
  );
}

function PredictionCard({ title, subtitle, value, subValue, icon: Icon, color, footer, isLarge }) {
  return (
    <div className="p-6 rounded-3xl bg-neutral-900 border border-white/5 relative overflow-hidden flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-2.5 rounded-xl ${color}`}><Icon className="w-5 h-5" /></div>
        <span className="text-[8px] font-mono text-slate-500 uppercase">{subtitle}</span>
      </div>
      <div className="space-y-1">
        <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
        <p className={`font-black tracking-tight text-white select-none ${isLarge ? 'text-lg leading-tight' : 'text-3xl'}`}>{value}</p>
        <p className="text-[10px] text-slate-400 font-medium pt-1.5">{subValue}</p>
      </div>
      <div className="pt-2.5 border-t border-white/5 mt-3 text-[8px] text-slate-600 font-mono text-left">{footer}</div>
    </div>
  );
}
