import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Shield, ChevronRight, Activity, Zap } from 'lucide-react';

export default function Landing() {
  const features = [
    { icon: BrainCircuit, title: "Career Intelligence", desc: "Deep analysis of your skills to predict the best career path using advanced classification models." },
    { icon: Activity, title: "Placement Readiness", desc: "Know exactly where you stand with hiring companies and what you need to improve to get placed." },
    { icon: Shield, title: "Verified Analytics", desc: "High fidelity analytics that provide a true picture of performance and skill sets." }
  ];

  return (
    <div className="relative overflow-hidden">
      <section className="min-h-screen flex flex-col items-center justify-center pt-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-mono mb-8 uppercase tracking-widest">
            <Zap className="w-3 h-3" /> AI-Powered Career Intelligence
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            Map Your Future With Your Performance
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            The next-generation intelligence platform for students. Real-time visual analytics and career roadmap intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth" className="px-8 py-4 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-all flex items-center gap-2 group shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              Get Started for Free <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/auth" className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-lg transition-all">Sign In</Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="mt-20 relative w-full max-w-6xl">
          <div className="aspect-video bg-gray-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="p-8 grid grid-cols-3 gap-6 opacity-40">
              {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white/5 rounded-xl border border-white/10"></div>)}
              <div className="col-span-2 h-64 bg-white/5 rounded-xl border border-white/10"></div>
              <div className="h-64 bg-white/5 rounded-xl border border-white/10"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/80 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 flex items-center gap-4">
                <BrainCircuit className="w-10 h-10 text-blue-500 animate-pulse" />
                <div className="text-left">
                  <p className="text-xs font-mono text-gray-500 uppercase">Analysis Status</p>
                  <p className="text-sm font-bold text-white tracking-wider">SYSTEMS OPERATIONAL</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all hover:translate-y-[-8px]">
              <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6">
                <f.icon className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
