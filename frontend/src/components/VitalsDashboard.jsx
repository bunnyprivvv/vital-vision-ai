import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Clock, LogOut, Zap, Download, AlertTriangle, ShieldAlert } from 'lucide-react';
import html2pdf from 'html2pdf.js';

import DigitalTwin from './DigitalTwin';
import HemaScanModule from './HemaScanModule';
import AudioTriageModule from './AudioTriageModule';
import ProgressRing from './ProgressRing';

const VitalsDashboard = ({ user, onLogout }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: `VitalsVision AI Initialized. Welcome, Operator ${user}. Syncing biometric channels...`, type: 'system' }
  ]);
  const [input, setInput] = useState('');
  
  // States for diagnostic scans
  const [botStatus, setBotStatus] = useState('idle'); // idle | scanning | typing
  const [activeScan, setActiveScan] = useState('idle'); // idle | HEMA_SCAN | AUDIO_TRIAGE

  const [latestScore, setLatestScore] = useState(100);
  const [history, setHistory] = useState([
    { id: 101, type: 'HEMA_SCAN', score: 84, date: '14 APR 26' },
  ]);
  
  // SOS State
  const [isSOSActive, setIsSOSActive] = useState(false);

  const chatEndRef = useRef(null);
  const dashboardRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSOSActive]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || botStatus !== 'idle' || isSOSActive) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setBotStatus('typing');

    // Simulate AI Response
    setTimeout(() => {
      const botMsg = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: "Analyzing telemetry data. Based on current system state, all primary indicators remain within nominal range.", 
        type: 'text' 
      };
      setMessages(prev => [...prev, botMsg]);
      setBotStatus('idle');
    }, 1500);
  };

  const handleScanInit = (type) => {
    if (botStatus !== 'idle' || isSOSActive) return;
    setBotStatus('scanning');
    setActiveScan(type);
    setMessages(prev => [...prev, { id: Date.now(), sender: 'system', text: `INITIATING_${type}_PROTOCOL...`, type: 'system_alert' }]);
  };

  const handleScanResult = (type, score) => {
    setLatestScore(score);
    
    // Simulate AI Core announcing the result
    setBotStatus('typing');
    setTimeout(() => {
      const resultMsg = { 
        id: Date.now(), 
        sender: 'bot', 
        text: `SCAN_COMPLETE: ${type} resolved. Risk Score determined. Status: ${score >= 80 ? 'NOMINAL' : 'REQUIRES ATTENTION'}. Results secure.`, 
        type: 'result',
        score: score,
        scanType: type
      };
      setMessages(prev => [...prev, resultMsg]);
      setHistory(prev => [{ id: Date.now(), type, score, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase() }, ...prev]);
      setBotStatus('idle');
      setActiveScan('idle');
    }, 1000);
  };

  const triggerSOS = () => {
    setIsSOSActive(true);
  };

  const handleExportPDF = () => {
    const element = dashboardRef.current;
    if (!element) return;
    const opt = {
      margin:       0.5,
      filename:     `VITALSVISION_${user}_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#000000', ignoreElements: (el) => el.classList.contains('no-export') },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
  };

  // Determine background pulse class based on score
  const bgPulseClass = latestScore < 80 ? 'animate-heartbeat-fast' : 'animate-heartbeat-normal';

  return (
    <div className={`min-h-screen flex flex-col text-white font-body selection:bg-cyan-biomed selection:text-black relative overflow-hidden transition-colors duration-1000 ${bgPulseClass}`}>
      <div className="noise" />

      {/* SOS MODAL OVERLAY */}
      <AnimatePresence>
        {isSOSActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md bg-red-900/40"
          >
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGg0MHYxSDB6IiBmaWxsPSJyZ2JhKDI1NSwgMCwgMCwgMC4yKSIvPgo8L3N2Zz4=')] opacity-20 pointer-events-none" />
             
             <motion.div 
               initial={{ scale: 0.9, y: 50 }}
               animate={{ scale: 1, y: 0 }}
               className="border border-red-500 bg-black/90 p-12 max-w-2xl w-full shadow-[0_0_100px_rgba(255,0,0,0.4)] relative overflow-hidden"
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-[scan_2s_linear_infinite]" />
                
                <div className="flex flex-col items-center text-center gap-6">
                  <div className="w-24 h-24 rounded-full border-2 border-red-500 flex items-center justify-center bg-red-500/10 mb-4 shadow-[0_0_30px_rgba(255,0,0,0.6)] animate-pulse">
                    <ShieldAlert className="text-red-500 w-12 h-12" />
                  </div>
                  <h1 className="font-heading text-5xl text-red-500 uppercase tracking-tighter shadow-red-500/50 drop-shadow-md">Emergency Override Active</h1>
                  
                  <div className="font-mono text-sm text-red-400/80 space-y-3 text-left w-full mt-8 border border-red-500/20 bg-red-500/5 p-6 h-48 overflow-hidden relative">
                    <motion.div 
                      initial={{ y: "100%" }}
                      animate={{ y: "-100%" }}
                      transition={{ duration: 15, ease: "linear", repeat: Infinity }}
                      className="absolute inset-x-6 space-y-4"
                    >
                      <p>&gt; WARNING: Standard diagnostic protocols suspended.</p>
                      <p>&gt; Bypassing AI analysis layer...</p>
                      <p>&gt; Securing 256-bit encrypted data link...</p>
                      <p>&gt; Establishing peer-to-peer relay with Priority Contact / Local ER.</p>
                      <p>&gt; Transmitting biometric snapshot and localized geolocation.</p>
                      <p>&gt; ...</p>
                      <p>&gt; EMERGENCY UPLINK ESTABLISHED.</p>
                      <p className="text-white pt-4 shadow-white/50 drop-shadow-sm font-bold">AWAITING EXTERNAL RESPONSE.</p>
                    </motion.div>
                  </div>
                  
                  <button 
                    onClick={() => setIsSOSActive(false)}
                    className="mt-8 px-8 py-3 border border-white/20 text-white/50 font-mono text-xs uppercase hover:bg-white hover:text-black transition-all"
                  >
                    [Demo Only: Terminate Override]
                  </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 1. Top Navigation Manifest */}
      <header className="relative z-20 flex items-center justify-between px-8 py-6 border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h2 className="font-heading text-xl tracking-tighter">VITALS<span className="text-cyan-biomed">VISION</span></h2>
            <div className="flex items-center gap-2 opacity-30 font-mono text-[7px] tracking-[0.3em]">
              <div className="w-1 h-1 bg-cyan-biomed rounded-full animate-pulse" />
              SYSTEM_READY // CHANNEL_S77
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={triggerSOS}
            className="no-export flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500 text-red-500 font-mono text-[9px] font-black tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all shadow-[0_0_15px_rgba(255,0,0,0.3)] animate-pulse"
          >
            <AlertTriangle size={14} />
            SOS Override
          </button>
          <button 
            onClick={handleExportPDF}
            className="no-export hidden md:flex items-center gap-2 px-4 py-2 border border-cyan-biomed/50 text-cyan-biomed font-mono text-[9px] tracking-widest uppercase hover:bg-cyan-biomed hover:text-black transition-all"
          >
            <Download size={14} />
            Export Med-PDF
          </button>
          <div className="hidden md:flex flex-col items-end border-l border-white/10 pl-6">
            <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Operator</span>
            <span className="text-xs font-mono text-cyan-biomed">{user}</span>
          </div>
          <button 
            onClick={onLogout}
            className="no-export p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors rounded-sm ml-2"
            title="Disconnect"
          >
            <LogOut size={16} className="text-white/40" />
          </button>
        </div>
      </header>

      {/* 2. Main Terminal Deck */}
      <main ref={dashboardRef} className="flex-1 overflow-hidden flex flex-col md:flex-row relative z-10 w-full h-full pr-[1px]">
        
        {/* Left Workspace: Digital Twin, Ring, & Hardware Modules */}
        <section className="w-full md:w-[50%] flex flex-col items-center p-8 gap-8 border-r border-white/5 relative bg-white/[0.01] overflow-y-auto custom-scrollbar">
          
          <div className="w-full flex justify-between items-start">
            <div className="flex flex-col gap-1 opacity-20 font-mono">
              <span className="text-[7px] tracking-[0.2em] uppercase">Core_State: {botStatus.toUpperCase()}</span>
              <span className="text-[7px] tracking-[0.2em] uppercase">Uplink: STABLE</span>
            </div>
          </div>

          {/* Top Section: Digital Twin & Score Ring */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 w-full mt-4">
            <div className="flex flex-col items-center relative group">
               <DigitalTwin activeScan={activeScan} size={160} />
               <span className="text-xs font-mono text-cyan-biomed tracking-[0.5em] mt-8 opacity-50 relative z-20">
                {botStatus === 'idle' ? 'HOLOGRAM_IDLE' : botStatus === 'typing' ? 'PROCESSING' : 'SCANNING_TELEMETRY'}
               </span>
            </div>
            
            <div className="flex flex-col items-center">
              <ProgressRing score={latestScore} size={140} />
              <span className="text-[9px] uppercase tracking-widest text-white/40 mt-4 font-mono">Telemetry Aggregate</span>
            </div>
          </div>

          {/* Bottom Section: Hardware Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mt-auto">
             <div onClick={() => handleScanInit('HEMA_SCAN')}>
               <HemaScanModule onAnalyze={handleScanResult} />
             </div>
             <div onClick={() => handleScanInit('AUDIO_TRIAGE')}>
               <AudioTriageModule onAnalyze={handleScanResult} />
             </div>
          </div>

        </section>

        {/* Right Workspace: Chat & History */}
        <section className="flex-1 flex flex-col overflow-hidden bg-obsidian-dark/50 backdrop-blur-sm">
          
          {/* Diagnostic History Rail */}
          <div className="px-8 py-6 border-b border-white/5 overflow-x-auto no-scrollbar flex items-center gap-4 bg-white/[0.02]">
            <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border border-white/5 font-mono text-[9px] text-white/30 uppercase tracking-widest">
               <Clock size={12} /> Recent_Logs
            </div>
            {history.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex-shrink-0 flex items-center gap-4 px-4 py-3 bg-black/40 border border-white/10 group hover:border-cyan-biomed/30 transition-all">
                <span className="text-[9px] font-bold opacity-40">{item.type}</span>
                <span className={`text-sm font-black ${item.score >= 80 ? 'text-cyan-biomed' : item.score >= 50 ? 'text-violet-neon' : 'text-red-500'}`}>{item.score}</span>
              </div>
            ))}
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 custom-scrollbar">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                   max-w-[85%] p-6 font-mono text-[11px] relative leading-relaxed tracking-wide
                   ${msg.sender === 'user' 
                     ? 'bg-cyan-biomed text-black border-cyan-biomed' 
                     : msg.type === 'result' ? 'glass-cyan bg-black/60' : 'glass bg-black/40'}
                `}>
                  {/* Speaker Label */}
                  <div className={`absolute top-0 ${msg.sender === 'user' ? 'right-0' : 'left-0'} -translate-y-full mb-1 flex items-center gap-2`}>
                    <span className="text-[7px] font-black uppercase tracking-[0.3em] opacity-40">
                      {msg.sender === 'user' ? 'OPERATOR' : msg.type === 'system' || msg.type === 'system_alert' ? 'SYSTEM' : 'CORE_AI'}
                    </span>
                  </div>

                  {msg.type === 'result' ? (
                     <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                           <span className="text-[8px] opacity-60 uppercase">{msg.scanType} // OUTPUT</span>
                           <div className={`ml-auto text-xl font-black ${msg.score >= 80 ? 'text-cyan-biomed' : msg.score >= 50 ? 'text-violet-neon' : 'text-red-500'}`}>{msg.score}</div>
                        </div>
                        <p className="text-white/80">{msg.text}</p>
                     </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Interface */}
          <div className="no-export p-8 bg-black/40 border-t border-white/5">
            <form onSubmit={handleSend} className="relative flex gap-4">
              <div className="relative flex-1 group">
                 <input 
                   type="text" 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   disabled={botStatus !== 'idle'}
                   placeholder={botStatus === 'idle' ? "Enter query or biometric command..." : "System restricted while processing..."}
                   className="w-full bg-white/[0.03] border border-white/10 px-6 py-5 pr-16 font-mono text-sm placeholder:text-white/10 focus:outline-none focus:border-cyan-biomed/50 focus:bg-white/[0.05] transition-all disabled:opacity-30"
                 />
                 <Zap className={`absolute right-6 top-1/2 -translate-y-1/2 transition-all ${botStatus === 'idle' ? 'text-white/10' : 'text-cyan-biomed animate-pulse opacity-100'}`} size={16} />
              </div>
              <button 
                type="submit" 
                disabled={botStatus !== 'idle' || !input.trim()}
                className="px-8 bg-white text-black hover:bg-cyan-biomed transition-all disabled:opacity-20 flex items-center gap-2"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </section>
      </main>
      
      {/* Global CSS for SOS Scan animation */}
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

export default VitalsDashboard;
