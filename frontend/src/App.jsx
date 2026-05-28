import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginGate from './components/LoginGate';
import VitalsDashboard from './components/VitalsDashboard';
import './index.css';

function App() {
  const [user, setUser] = useState(localStorage.getItem('vitals_session') || null);
  const [view, setView] = useState(user ? 'DASHBOARD' : 'LOGIN');

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem('vitals_session', username);
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('vitals_session');
    setView('LOGIN');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black selection:bg-cyan-biomed selection:text-black">
      {/* Global Noise Overlay */}
      <div className="noise" />

      <AnimatePresence mode="wait">
        {view === 'LOGIN' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <LoginGate onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full w-full"
          >
            <VitalsDashboard user={user} onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
