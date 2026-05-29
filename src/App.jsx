import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Navbar from './pages/Navbar';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import StudentLogin from './pages/StudentLogin';
import StudentSignup from './pages/StudentSignup';
import AnalysisHistory from './pages/AnalysisHistory';
import Landing from './pages/Landing';
import Footer from './Footer';

function App() {
  const getInitialUser = () => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored || stored === 'undefined') return null;
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  };

  const [user, setUser] = useState(getInitialUser());
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const PrivateRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/auth" />;
    if (role && user.role !== role) {
      return <Navigate to="/dashboard" />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-white text-black'}`}>
        {/* Animated Background */}
        <div className="fixed inset-0 z-[-1] overflow-hidden opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600 blur-[120px] animate-pulse delay-700"></div>
        </div>

        {user && <Navbar user={user} onLogout={handleLogout} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
        
        <main className={user ? 'pt-20' : ''}>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
            
            {/* Auth Routes */}
            <Route path="/auth" element={user ? <Navigate to="/" /> : <Navigate to="/login/student" />} />
            <Route path="/login/student" element={user ? <Navigate to="/" /> : <StudentLogin />} />
            <Route path="/signup/student" element={user ? <Navigate to="/" /> : <StudentSignup />} />

            {/* Student Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute role="student"><Dashboard /></PrivateRoute>} />
            <Route path="/dashboard/history" element={<PrivateRoute role="student"><AnalysisHistory /></PrivateRoute>} />
            <Route path="/analysis" element={<PrivateRoute role="student"><Analysis /></PrivateRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {!user && <Footer />}
      </div>
    </Router>
  );
}

export default App;
