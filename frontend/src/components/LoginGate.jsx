import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Eye, EyeOff } from 'lucide-react';

const LoginGate = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [secureKey, setSecureKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isAccessing, setIsAccessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId || !secureKey) return;
    
    setIsAccessing(true);
    // Simulate biometric/system sync
    setTimeout(() => {
      onLogin(userId);
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
        <div className="glass-cyan p-10 md:p-12 border-white/5 relative overflow-hidden">
          {/* Scanning Line Effect */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-biomed/30 animate-[scan_4s_linear_infinite]" />
          
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 bg-cyan-biomed/10 flex items-center justify-center rounded-sm mb-6 border border-cyan-biomed/20">
              <Shield className="text-cyan-biomed w-8 h-8" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl text-center tracking-tighter mb-2">
              VITALS<span className="text-cyan-biomed">VISION</span> <span className="text-white/40">AI</span>
            </h1>
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.4em]">Secure Diagnostic Core v1.0.4</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest block ml-1">Operator_ID</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="USER_X_77"
                  className="w-full bg-white/[0.03] border border-white/10 px-5 py-4 font-mono text-sm placeholder:text-white/10 focus:outline-none focus:border-cyan-biomed/50 focus:bg-white/[0.05] transition-all"
                  required
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20">
                  <span className="text-[10px] font-mono">REQ</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest block ml-1">Access_Key</label>
              <div className="relative group">
                <input 
                  type={showKey ? "text" : "password"} 
                  value={secureKey}
                  onChange={(e) => setSecureKey(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 px-5 py-4 font-mono text-sm placeholder:text-white/10 focus:outline-none focus:border-cyan-biomed/50 focus:bg-white/[0.05] transition-all"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute inset-y-0 right-4 flex items-center text-white/20 hover:text-cyan-biomed transition-colors"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isAccessing}
              className="btn-primary w-full relative overflow-hidden group mt-4"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isAccessing ? "SYNCING_BIOMETRICS" : "ACCESS_SYSTEM"}
                {!isAccessing && <Key size={18} className="rotate-45" />}
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

          <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center opacity-30">
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
