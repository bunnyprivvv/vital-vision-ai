import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Eye, EyeOff, UserPlus, LogIn, AlertOctagon } from 'lucide-react';

const LoginGate = ({ onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [userId, setUserId] = useState('');
  const [secureKey, setSecureKey] = useState('');
  const [userRole, setUserRole] = useState('Emergency Clinician');
  const [showKey, setShowKey] = useState(false);
  const [isAccessing, setIsAccessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: 'info', text: 'SYSTEM STANDBY' });

  // Initialize DB on mount
  useEffect(() => {
    const existingUsers = localStorage.getItem('vital_vision_users');
    if (!existingUsers) {
      const defaultUsers = [
        { userId: 'USER_X_77', secureKey: 'ADMIN1234', role: 'Lead Pathologist' }
      ];
      localStorage.setItem('vital_vision_users', JSON.stringify(defaultUsers));
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!userId || !secureKey) return;
    
    setIsAccessing(true);
    setStatusMessage({ type: 'info', text: 'VERIFYING CREDENTIALS...' });

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('vital_vision_users') || '[]');
      const matchedUser = users.find(
        (u) => u.userId.toLowerCase().trim() === userId.toLowerCase().trim() && u.secureKey === secureKey
      );

      if (matchedUser) {
        setStatusMessage({ type: 'success', text: 'ACCESS GRANTED. SYNCING BIOMETRIC CONSOLE...' });
        setTimeout(() => {
          onLogin(matchedUser.userId, matchedUser.role);
        }, 1000);
      } else {
        setIsAccessing(false);
        setStatusMessage({ type: 'error', text: 'AUTHENTICATION FAILED: INVALID CREDENTIALS' });
      }
    }, 1500);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!userId || !secureKey || !userRole) return;

    setIsAccessing(true);
    setStatusMessage({ type: 'info', text: 'CREATING OPERATOR PROFILE...' });

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('vital_vision_users') || '[]');
      const userExists = users.some(
        (u) => u.userId.toLowerCase().trim() === userId.toLowerCase().trim()
      );

      if (userExists) {
        setIsAccessing(false);
        setStatusMessage({ type: 'error', text: 'REGISTRATION FAILED: OPERATOR_ID EXISTS' });
      } else {
        const newUser = { userId: userId.trim(), secureKey, role: userRole };
        users.push(newUser);
        localStorage.setItem('vital_vision_users', JSON.stringify(users));

        setStatusMessage({ type: 'success', text: 'OPERATOR CREATED! LOGGING IN...' });
        setTimeout(() => {
          onLogin(newUser.userId, newUser.role);
        }, 1000);
      }
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-obsidian">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-biomed/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-violet-neon/5 rounded-full blur-[100px]" />
      <div className="noise" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[450px]"
      >
        <div className="glass-cyan p-8 md:p-10 border-white/5 relative overflow-hidden rounded-md">
          {/* Scanning Line Effect */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-biomed/30 animate-[scan_4s_linear_infinite]" />
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-cyan-biomed/10 flex items-center justify-center rounded-sm mb-4 border border-cyan-biomed/20">
              <Shield className="text-cyan-biomed w-7 h-7" />
            </div>
            <h1 className="font-heading text-2xl md:text-3xl text-center tracking-tighter mb-1">
              VITALS<span className="text-cyan-biomed">VISION</span> <span className="text-white/40">AI</span>
            </h1>
            <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.4em]">Secure Diagnostic Core v1.0.4</p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex border-b border-white/5 mb-6">
            <button
              onClick={() => {
                if (isAccessing) return;
                setMode('login');
                setStatusMessage({ type: 'info', text: 'SYSTEM STANDBY' });
              }}
              className={`flex-1 py-2 font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-all ${
                mode === 'login'
                  ? 'border-cyan-biomed text-cyan-biomed bg-cyan-biomed/5'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}
              disabled={isAccessing}
            >
              <LogIn size={12} /> Log_In
            </button>
            <button
              onClick={() => {
                if (isAccessing) return;
                setMode('register');
                setStatusMessage({ type: 'info', text: 'SYSTEM STANDBY' });
              }}
              className={`flex-1 py-2 font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-all ${
                mode === 'register'
                  ? 'border-cyan-biomed text-cyan-biomed bg-cyan-biomed/5'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}
              disabled={isAccessing}
            >
              <UserPlus size={12} /> Register
            </button>
          </div>

          {/* Alert / Diagnostic Status Indicator */}
          <div className={`p-3 border font-mono text-[10px] uppercase tracking-wider mb-6 flex items-center gap-3 transition-colors ${
            statusMessage.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : statusMessage.type === 'success'
              ? 'bg-cyan-biomed/10 border-cyan-biomed/30 text-cyan-biomed'
              : 'bg-white/[0.02] border-white/10 text-white/60'
          }`}>
            <AlertOctagon size={14} className={statusMessage.type === 'error' ? 'animate-bounce' : ''} />
            <span>{statusMessage.text}</span>
          </div>

          <form onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest block ml-1">Operator_ID</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="USER_X_77"
                  className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 font-mono text-sm placeholder:text-white/10 focus:outline-none focus:border-cyan-biomed/50 focus:bg-white/[0.05] transition-all rounded-sm"
                  required
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest block ml-1">Operator_Role</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full bg-obsidian-card border border-white/10 px-4 py-3 font-mono text-sm focus:outline-none focus:border-cyan-biomed/50 focus:bg-white/[0.05] transition-all rounded-sm text-white"
                  required
                >
                  <option value="Lead Pathologist">Lead Pathologist</option>
                  <option value="Emergency Clinician">Emergency Clinician</option>
                  <option value="AI Software Engineer">AI Software Engineer</option>
                  <option value="Medical Director">Medical Director</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest block ml-1">Access_Key</label>
              <div className="relative group">
                <input 
                  type={showKey ? "text" : "password"} 
                  value={secureKey}
                  onChange={(e) => setSecureKey(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 font-mono text-sm placeholder:text-white/10 focus:outline-none focus:border-cyan-biomed/50 focus:bg-white/[0.05] transition-all rounded-sm"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute inset-y-0 right-4 flex items-center text-white/20 hover:text-cyan-biomed transition-colors"
                >
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isAccessing}
              className="btn-primary w-full relative overflow-hidden group mt-4 py-3 text-sm cursor-none"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isAccessing 
                  ? (mode === 'login' ? "DECRYPTING..." : "SYNCING...") 
                  : (mode === 'login' ? "ACCESS SYSTEM" : "INITIALIZE SECURITY CORE")}
                {!isAccessing && <Key size={16} className="rotate-45" />}
              </span>
              {isAccessing && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="absolute bottom-0 left-0 h-1 bg-white/40"
                  transition={{ duration: 1.5 }}
                />
              )}
            </button>
          </form>

          {/* Quick Info Block */}
          {mode === 'login' && (
            <div className="mt-4 text-center">
              <p className="font-mono text-[8px] text-white/20">
                Default Credentials: <span className="text-cyan-biomed/60 font-bold">USER_X_77</span> / <span className="text-cyan-biomed/60 font-bold">ADMIN1234</span>
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center opacity-30">
            <span className="font-mono text-[7px] uppercase tracking-widest">Protocol: 0x77_ALFA</span>
            <div className="flex gap-2">
              <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-white rounded-full animate-pulse [animation-delay:200ms]" />
              <div className="w-1 h-1 bg-white rounded-full animate-pulse [animation-delay:400ms]" />
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LoginGate;
