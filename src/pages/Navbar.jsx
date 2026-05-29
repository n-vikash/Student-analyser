import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Activity, LogOut, BrainCircuit, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar({ user, onLogout, isDarkMode, setIsDarkMode }) {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: "ML Predictor", path: '/analysis', icon: Activity },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-xl border-b px-6 flex items-center justify-between transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#0a0a0a]/80 border-white/5 text-white' 
        : 'bg-white/85 border-black/5 text-black animate-none'
    }`}>
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <BrainCircuit className="text-white w-full h-full" />
          </div>
          <span className={`text-xl font-bold tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            FUTURE AI
          </span>
        </Link>
        {user && (
          <div className="flex items-center text-sm font-medium">
            <span className={`h-4 w-[1px] mx-3 ${isDarkMode ? 'bg-white/20' : 'bg-slate-300'}`}></span>
            <span className={`text-sm tracking-tight ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {user.name}
            </span>
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isActive 
                  ? isDarkMode 
                    ? 'bg-white/5 text-cyan-400 border border-cyan-400/20' 
                    : 'bg-black/5 text-cyan-600 border border-cyan-500/20 font-semibold' 
                  : isDarkMode 
                    ? 'text-slate-400 hover:text-white hover:bg-white/5' 
                    : 'text-slate-600 hover:text-black hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-lg transition-all duration-300 border border-transparent cursor-pointer ${
            isDarkMode 
              ? 'text-slate-400 hover:text-amber-400 hover:bg-white/5' 
              : 'text-slate-500 hover:text-amber-500 hover:bg-slate-100'
          }`}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>
        <button
          onClick={onLogout}
          className={`p-2 rounded-lg transition-all duration-300 border border-transparent cursor-pointer ${
            isDarkMode 
              ? 'text-slate-400 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20' 
              : 'text-slate-500 hover:text-red-600 hover:bg-red-500/10 hover:border-red-500/20'
          }`}
          aria-label="Log Out"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>
      </div>
    </nav>
  );
}
