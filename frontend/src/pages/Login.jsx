import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('OPERATOR_77');
  const [password, setPassword] = useState('********');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin(username);
    navigate('/dashboard');
  };

  return (
    <div className="login-page relative min-h-screen flex items-center justify-center p-4 overflow-hidden" style={{ backgroundColor: '#000' }}>
      
      {/* 1. Global Aesthetic Layer */}
      <div className="noise-overlay" />
      
      {/* Kinetic Background coordinates */}
      <div className="absolute inset-0 z-0 opacity-[0.02]" style={{ 
        backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', 
        backgroundSize: '80px 80px' 
      }} />

      <div className="w-full max-w-sm z-10">
        <div className="flex flex-col items-center mb-16">
          <div className="p-6 lumina-glass border mb-12" style={{ transform: 'rotate(45deg)', borderColor: 'rgba(0, 255, 255, 0.2)' }}>
            <div style={{ transform: 'rotate(-45deg)' }}>
              <span className="text-cyber-cyan font-black text-2xl">[*]</span>
            </div>
          </div>
          
          <h1 className="text-display leading-none text-center">SIGN_IN</h1>
          <p className="text-[10px] text-white/20 tracking-[0.6em] font-black uppercase mt-4 text-center">
            VITASCAN_SENTINEL_AUTH
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="tech-ticket !p-0 bg-transparent border-none">
            <div className="relative mb-4">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 font-bold text-xs">
                 ID
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="OPERATOR_ID"
                className="w-full bg-[#080808] border border-white/5 py-5 pl-14 pr-6 text-xs text-white placeholder-white/5 focus:outline-none focus:border-cyber-cyan/30 transition-all font-bold tracking-widest cursor-none clickable"
              />
            </div>

            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 font-bold text-xs">
                 PW
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ACCESS_PASS"
                className="w-full bg-[#080808] border border-white/5 py-5 pl-14 pr-6 text-xs text-white placeholder-white/5 focus:outline-none focus:border-cyber-cyan/30 transition-all font-bold tracking-widest cursor-none clickable"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-6 mt-12 bg-white text-black font-black text-[10px] tracking-[0.4em] uppercase hover:bg-cyber-cyan transition-all cursor-none clickable"
          >
             INITIALIZE_BOOT_SEQUENCE
          </button>
        </form>

        <div className="mt-20 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-8 bg-white/5" />
            <div className="status-dot animate-pulse" />
            <div className="h-[1px] w-8 bg-white/5" />
          </div>
          <p className="text-[8px] text-white/10 uppercase tracking-[0.5em] font-bold text-center">
            77_MANIFEST_SECURED // 52.3392 N
          </p>
        </div>
      </div>

      {/* Decorative corner brackets */}
      <div className="absolute top-12 left-12 text-white/5 font-mono text-[10px] hidden md:block">+ AUTH_GATE_ALPHA</div>
      <div className="absolute bottom-12 right-12 text-white/5 font-mono text-[10px] hidden md:block">+ CRYPTO_CORE_ACTIVE</div>
    </div>
  );
};

export default Login;
