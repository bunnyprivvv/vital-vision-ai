import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Clock, LogOut, Zap, Download, AlertTriangle, ShieldAlert,
  Activity, Heart, Thermometer, ShieldCheck, Database, RefreshCw,
  FileText, CornerDownRight, ChevronRight, MessageSquare, AlertOctagon,
  PhoneCall
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

import DigitalTwin from './DigitalTwin';
import HemaScanModule from './HemaScanModule';
import AudioTriageModule from './AudioTriageModule';
import ProgressRing from './ProgressRing';

/* ─── Immersive Clinical Sound Engine ─── */
const playClinicalSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    
    if (type === 'beep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, now);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'chime') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(800, now + 0.08);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'alarm') {
      // red alert dual siren
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.35);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'scan') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(450, now + 0.5);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch (e) {
    console.warn("Web Audio blocked by interaction policy", e);
  }
};

const VitalsDashboard = ({ user, onLogout }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: `VitalsVision Secure Diagnostic Core initialized. Syncing telemetry channels for Operator ${user}...`, type: 'system' }
  ]);
  const [input, setInput] = useState('');
  
  // States for diagnostic scans
  const [botStatus, setBotStatus] = useState('idle'); // idle | scanning | typing
  const [activeScan, setActiveScan] = useState('idle'); // idle | HEMA_SCAN | AUDIO_TRIAGE

  const [latestScore, setLatestScore] = useState(100);
  const [history, setHistory] = useState([
    { id: 101, type: 'HEMA_SCAN', score: 84, date: '28 MAY 26' },
    { id: 102, type: 'AUDIO_TRIAGE', score: 92, date: '27 MAY 26' }
  ]);
  
  // SOS State
  const [isSOSActive, setIsSOSActive] = useState(false);

  // Fluctuating Heart Rate Telemetry
  const [liveBPM, setLiveBPM] = useState(72);
  const [liveSPO2, setLiveSPO2] = useState(98);

  const chatEndRef = useRef(null);
  const dashboardRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSOSActive]);

  /* ─── Heart-rate telemetry fluctuation ─── */
  useEffect(() => {
    const bpmInterval = setInterval(() => {
      setLiveBPM(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const target = prev + delta;
        return target >= 68 && target <= 78 ? target : prev;
      });
    }, 2500);

    const spo2Interval = setInterval(() => {
      setLiveSPO2(prev => {
        if (Math.random() > 0.8) {
          const next = prev === 98 ? 99 : 98;
          return next;
        }
        return prev;
      });
    }, 6000);

    return () => {
      clearInterval(bpmInterval);
      clearInterval(spo2Interval);
    };
  }, []);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || botStatus !== 'idle' || isSOSActive) return;

    playClinicalSound('beep');
    const userMsg = { id: Date.now(), sender: 'user', text: input, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setBotStatus('typing');

    // Simulate AI Response
    setTimeout(() => {
      let botResponse = "Analyzing diagnostic core signals. Based on active telemetry metrics, your system operates within normal clinical parameters.";
      
      const textLower = input.toLowerCase();
      if (textLower.includes('blood') || textLower.includes('pathology') || textLower.includes('hema')) {
        botResponse = "Biometric HemaScan diagnostics scanned. Red cell morphology is nominal, and leukocyte count tracks at 6.8 K/uL. No flags generated.";
      } else if (textLower.includes('cough') || textLower.includes('breath') || textLower.includes('audio') || textLower.includes('lung')) {
        botResponse = "Acoustic AudioTriage diagnostic synced. Frequency pattern matches deep bronchial resonance. Wheezing frequency tracks below 2%, indicating clear pathways.";
      } else if (textLower.includes('help') || textLower.includes('override') || textLower.includes('sos')) {
        botResponse = "To override standard operations and establish an direct ER link, please click the red 'SOS Override' console button above.";
      }

      const botMsg = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: botResponse,
        type: 'text' 
      };
      setMessages(prev => [...prev, botMsg]);
      setBotStatus('idle');
      playClinicalSound('chime');
    }, 1200);
  };

  const handleScanInit = (type) => {
    if (botStatus !== 'idle' || isSOSActive) return;
    playClinicalSound('scan');
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
        text: `SCAN_COMPLETE: ${type === 'HEMA_SCAN' ? 'Blood Smear micro-analysis' : 'Respiratory AudioTriage'} successfully compiled. aggregate Risk Score resolved. Diagnostic status determined as: ${score >= 80 ? 'NOMINAL' : 'REQUIRES ATTENTION'}.`, 
        type: 'result',
        score: score,
        scanType: type
      };
      setMessages(prev => [...prev, resultMsg]);
      setHistory(prev => [{ id: Date.now(), type, score, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase() }, ...prev]);
      setBotStatus('idle');
      setActiveScan('idle');
      playClinicalSound('chime');
    }, 1000);
  };

  const triggerSOS = () => {
    playClinicalSound('alarm');
    setIsSOSActive(true);
  };

  const handleExportPDF = () => {
    playClinicalSound('chime');
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
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-red-950/70"
          >
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGg0MHYxSDB6IiBmaWxsPSJyZ2JhKDI1NSwgMCwgMCwgMC4yKSIvPgo8L3N2Zz4=')] opacity-20 pointer-events-none" />
             
             <motion.div 
                initial={{ scale: 0.95, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 30 }}
                className="border border-red-500 bg-black/95 p-6 md:p-10 max-w-xl w-full shadow-[0_0_80px_rgba(239,68,68,0.3)] relative overflow-hidden rounded-lg mx-4"
             >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500 animate-[scan_2.5s_linear_infinite]" />
                
                <div className="flex flex-col items-center text-center gap-5">
                  <div className="w-20 h-20 rounded-full border-2 border-red-500 flex items-center justify-center bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse">
                    <ShieldAlert className="text-red-500 w-10 h-10" />
                  </div>
                  <h1 className="font-heading text-3xl md:text-4xl text-red-500 uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    Clinician Emergency Override
                  </h1>
                  
                  <div className="font-mono text-xs text-red-400/90 space-y-2 text-left w-full mt-4 border border-red-500/20 bg-red-500/5 p-4 rounded h-40 overflow-hidden relative">
                    <motion.div 
                      initial={{ y: "100%" }}
                      animate={{ y: "-100%" }}
                      transition={{ duration: 12, ease: "linear", repeat: Infinity }}
                      className="absolute inset-x-4 space-y-3"
                    >
                      <p>&gt; WARNING: Clinician bypass engaged.</p>
                      <p>&gt; Suspending localized automated diagnosis...</p>
                      <p>&gt; Exposing raw telemetry data feeds...</p>
                      <p>&gt; Syncing secure 256-bit P2P relay channel...</p>
                      <p>&gt; Mapping emergency geolocation node: 40.7128° N, 74.0060° W</p>
                      <p>&gt; Transmitting medical PDF telemetry history...</p>
                      <p>&gt; Establishing voice channel connection with Duty Director...</p>
                      <p className="text-white pt-2 font-bold animate-pulse">&gt; EMERGENCY CHANNEL COMPILATION SUCCESS. OPERATOR CONNECTED.</p>
                    </motion.div>
                  </div>

                  <div className="w-full flex flex-col sm:flex-row gap-3 mt-6">
                    <a
                      href="tel:911"
                      className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-bold tracking-widest text-center rounded transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                    >
                      <PhoneCall size={14} /> Dial Emergency (911)
                    </a>
                    <button 
                      onClick={() => { playClinicalSound('beep'); setIsSOSActive(false); }}
                      className="flex-1 px-6 py-3 border border-white/20 text-white/50 font-mono text-xs uppercase hover:bg-white/[0.05] hover:text-white rounded transition-colors"
                    >
                      Terminate Override
                    </button>
                  </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 1. Futuristic CLINICAL HEADER */}
      <header className="relative z-20 flex flex-col md:flex-row items-center justify-between px-6 md:px-8 py-5 border-b border-white/5 backdrop-blur-md bg-black/40 gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-3 h-3 rounded-full bg-cyan-biomed flex items-center justify-center animate-ping" />
          <div className="flex flex-col">
            <h2 className="font-heading text-xl tracking-tighter flex items-center gap-2">
              VITALS<span className="text-cyan-biomed">VISION</span>
              <span className="font-mono text-[9px] text-cyan-biomed border border-cyan-biomed/30 px-2 py-0.5 rounded bg-cyan-biomed/5">CORE V2</span>
            </h2>
            <div className="flex items-center gap-1 opacity-40 font-mono text-[7px] tracking-[0.25em]">
              <Database size={8} /> DATA_LINK: COMPILER_STABLE // SECURED_NODE
            </div>
          </div>
        </div>

        {/* Global Action HUD */}
        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto flex-wrap no-export">
          <button 
            onClick={triggerSOS}
            className="flex items-center gap-2 px-3 py-2 bg-red-600/10 border border-red-500/40 text-red-500 hover:bg-red-600 hover:text-white transition-all text-[10px] font-mono tracking-wider uppercase rounded-md shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse"
          >
            <AlertTriangle size={12} />
            SOS Override
          </button>
          
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-2 border border-cyan-biomed/40 text-cyan-biomed hover:bg-cyan-biomed hover:text-black transition-all text-[10px] font-mono tracking-wider uppercase rounded-md"
          >
            <Download size={12} />
            Export Med-PDF
          </button>

          <div className="flex items-center gap-3 border-l border-white/10 pl-4">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-mono text-white/30 uppercase">Operator</span>
              <span className="text-xs font-mono text-cyan-biomed font-bold">{user}</span>
            </div>
            <button 
              onClick={() => { playClinicalSound('beep'); onLogout(); }}
              className="p-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all rounded"
              title="Disconnect Server"
            >
              <LogOut size={14} className="text-white/50" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Responsive Clinical Console Grid Layout */}
      <main ref={dashboardRef} className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row relative z-10 w-full h-full">
        
        {/* Column A: Telemetry Dashboard & History Logs (Width: 28%) */}
        <section className="w-full lg:w-[28%] flex flex-col p-6 border-b lg:border-b-0 lg:border-r border-white/5 gap-6 bg-white/[0.01] overflow-y-auto custom-scrollbar">
          
          <div>
            <div className="flex items-center gap-2 mb-3 text-[10px] font-mono tracking-widest text-white/40 uppercase">
              <Activity size={12} color={C.cyan-biomed} />
              <span>LIVE BIOMETRIC TELEMETRY</span>
            </div>
            
            {/* Live Telemetry Monitors list */}
            <div className="flex flex-col gap-3">
              
              {/* Heart Rate / Pulse */}
              <div className="glass border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-cyan-biomed/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <Heart size={18} className="text-red-400 animate-[heartbeat_0.8s_infinite_ease-out]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-white/40 uppercase">Cardiac Pulse</div>
                    <div className="text-xs font-mono text-white/70">BioTelemetry</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-bold text-white tracking-tighter">{liveBPM}</span>
                  <span className="text-[9px] font-mono text-red-400 ml-1">BPM</span>
                </div>
              </div>

              {/* SPO2 Oxygen Levels */}
              <div className="glass border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-cyan-biomed/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-biomed/10 flex items-center justify-center border border-cyan-biomed/20">
                    <Zap size={18} className="text-cyan-biomed animate-pulse" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-white/40 uppercase">Oxygen Saturation</div>
                    <div className="text-xs font-mono text-white/70">SPO2 Monitor</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-bold text-cyan-biomed tracking-tighter">{liveSPO2}%</span>
                </div>
              </div>

              {/* Body Temperature */}
              <div className="glass border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-cyan-biomed/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Thermometer size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-white/40 uppercase">Core Temperature</div>
                    <div className="text-xs font-mono text-white/70">Internal Sensor</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-bold text-amber-400 tracking-tighter">36.8</span>
                  <span className="text-[9px] font-mono text-amber-400 ml-1">°C</span>
                </div>
              </div>

            </div>
          </div>

          {/* Historical Log list */}
          <div className="flex-1 flex flex-col min-h-[220px]">
            <div className="flex items-center gap-2 mb-3 text-[10px] font-mono tracking-widest text-white/40 uppercase">
              <Clock size={12} />
              <span>DIAGNOSTIC LOG RECORDS</span>
            </div>
            
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[280px] lg:max-h-none pr-1">
              {history.map((item, idx) => (
                <div 
                  key={`${item.id}-${idx}`} 
                  className="p-3 bg-white/[0.01] border border-white/5 rounded-lg flex items-center justify-between group hover:bg-white/[0.03] hover:border-white/10 transition-all"
                >
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-white/30 uppercase">{item.date}</span>
                    <span className="text-xs font-mono font-bold text-white/80 mt-1">{item.type.replace('_', ' ')}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-base font-mono font-black ${item.score >= 80 ? 'text-cyan-biomed' : item.score >= 50 ? 'text-violet-neon' : 'text-red-500'}`}>
                      {item.score}%
                    </div>
                    <span className="text-[8px] font-mono text-white/30 uppercase">Score</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Column B: Diagnostic Scanner & Wireframe (Width: 38%) */}
        <section className="w-full lg:w-[38%] flex flex-col p-6 md:p-8 gap-6 border-b lg:border-b-0 lg:border-r border-white/5 items-center justify-between bg-black/10 overflow-y-auto custom-scrollbar">
          
          <div className="w-full flex justify-between items-center opacity-30 font-mono text-[8px] tracking-wider uppercase">
            <span>Uplink: ACTIVE</span>
            <span>Ref: CLINIC_X77_SYS</span>
          </div>

          {/* Biometric Holographic Scope */}
          <div className="flex flex-col items-center justify-center my-auto py-4 relative w-full max-w-[280px]">
            {/* Compass Rings Decors */}
            <div className="absolute inset-0 rounded-full border border-cyan-biomed/5 animate-[spin_40s_linear_infinite]" />
            <div className="absolute inset-8 rounded-full border border-dashed border-violet-neon/5 animate-[spin_20s_linear_infinite_reverse]" />
            
            <DigitalTwin activeScan={activeScan} size={150} />
            
            <span className="text-[9px] font-mono text-cyan-biomed/60 tracking-[0.4em] mt-6 uppercase text-center block">
              {activeScan === 'idle' ? 'Twin Hologram Idle' : activeScan === 'HEMA_SCAN' ? 'Running Blood Scan...' : 'Analyzing Lung Acoustics...'}
            </span>
          </div>

          {/* Interactive Hardware Scanning Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-auto">
             <div onClick={() => handleScanInit('HEMA_SCAN')} className="cursor-pointer">
               <HemaScanModule onAnalyze={handleScanResult} active={activeScan === 'HEMA_SCAN'} />
             </div>
             <div onClick={() => handleScanInit('AUDIO_TRIAGE')} className="cursor-pointer">
               <AudioTriageModule onAnalyze={handleScanResult} active={activeScan === 'AUDIO_TRIAGE'} />
             </div>
          </div>

        </section>

        {/* Column C: Secure AI Chat & Analysis Panel (Remaining Space) */}
        <section className="flex-1 flex flex-col overflow-hidden bg-black/20 backdrop-blur-sm h-[500px] lg:h-auto">
          
          {/* AI Core State Panel Header */}
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare size={13} className="text-cyan-biomed" />
              <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">AI SECURE CORE DIAGNOSTIC UPLINK</span>
            </div>
            
            <AnimatePresence mode="wait">
              {botStatus === 'typing' ? (
                <motion.span key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[9px] font-mono text-cyan-biomed animate-pulse uppercase">
                  Core AI is drafting telemetry diagnosis...
                </motion.span>
              ) : botStatus === 'scanning' ? (
                <motion.span key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[9px] font-mono text-violet-neon animate-pulse uppercase">
                  Biometrics scanning in progress...
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[9px] font-mono text-white/30 uppercase flex items-center gap-1.5">
                  <ShieldCheck size={10} className="text-cyan-biomed" /> Core AI Secure
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Secure Biometric Chat Thread */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[85%] p-4 font-mono text-xs rounded-xl relative leading-relaxed tracking-wide
                  ${msg.sender === 'user' 
                    ? 'bg-cyan-biomed text-black font-bold border border-cyan-biomed shadow-[0_0_15px_rgba(0,229,255,0.15)]' 
                    : msg.type === 'result' 
                      ? 'border border-cyan-biomed/20 bg-cyan-biomed/5 text-white' 
                      : msg.type === 'system_alert'
                        ? 'border border-violet-neon/20 bg-violet-neon/5 text-violet-neon/90 font-bold'
                        : 'border border-white/5 bg-white/[0.02] text-white/90'}
                `}>
                  {/* Speaker Badge label */}
                  <div className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1 flex items-center gap-1">
                    <CornerDownRight size={8} />
                    {msg.sender === 'user' ? 'Operator' : msg.type === 'system' || msg.type === 'system_alert' ? 'System Feed' : 'Core AI'}
                  </div>

                  {msg.type === 'result' ? (
                     <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-1.5">
                           <span className="text-[9px] text-cyan-biomed font-bold tracking-wider uppercase">
                             {msg.scanType === 'HEMA_SCAN' ? '🔬 HEMASCAN PATHOLOGY V2' : '🎙️ AUDIOTRIAGE AUDIOMETRY'}
                           </span>
                           <div className={`ml-auto text-lg font-black ${msg.score >= 80 ? 'text-cyan-biomed' : msg.score >= 50 ? 'text-violet-neon' : 'text-red-500'}`}>
                             {msg.score}%
                           </div>
                        </div>
                        <p className="text-white/80 leading-normal">{msg.text}</p>
                        
                        {/* Simulated Medical parameters readout */}
                        <div className="mt-1 pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[9px] text-white/50">
                          {msg.scanType === 'HEMA_SCAN' ? (
                            <>
                              <div>• Erythrocytes (RBC): <span className="text-cyan-biomed">Nominal</span></div>
                              <div>• Lymphocytes (WBC): <span className="text-cyan-biomed">Stable</span></div>
                              <div>• Morphology Index: <span className="text-cyan-biomed">4.8M/uL</span></div>
                              <div>• Diagnostic Core: <span className="text-cyan-biomed">Secure</span></div>
                            </>
                          ) : (
                            <>
                              <div>• Respiration Rate: <span className="text-cyan-biomed">14/min</span></div>
                              <div>• Wheeze Index: <span className="text-cyan-biomed">&lt;2.1%</span></div>
                              <div>• Audio Resonance: <span className="text-cyan-biomed">Clear</span></div>
                              <div>• Telemetry Sync: <span className="text-cyan-biomed">99%</span></div>
                            </>
                          )}
                        </div>
                     </div>
                  ) : (
                    <span className="leading-normal">{msg.text}</span>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Secure Biometric Input Interface */}
          <div className="no-export p-4 md:p-6 bg-black/40 border-t border-white/5 flex-shrink-0">
            <form onSubmit={handleSend} className="relative flex gap-3">
              <div className="relative flex-1 group">
                 <input 
                   type="text" 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   disabled={botStatus !== 'idle'}
                   placeholder={botStatus === 'idle' ? "Enter medical query or command..." : "Telemetry analyzer busy..."}
                   className="w-full bg-white/[0.03] border border-white/10 px-5 py-4 pr-12 font-mono text-xs rounded-lg placeholder:text-white/15 focus:outline-none focus:border-cyan-biomed/50 focus:bg-white/[0.05] transition-all disabled:opacity-30 text-white"
                 />
                 <Zap className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all ${botStatus === 'idle' ? 'text-white/15' : 'text-cyan-biomed animate-pulse opacity-100'}`} size={14} />
              </div>
              
              <button 
                type="submit" 
                disabled={botStatus !== 'idle' || !input.trim()}
                className="px-6 py-4 bg-white text-black hover:bg-cyan-biomed transition-all disabled:opacity-20 flex items-center justify-center rounded-lg font-bold"
              >
                <Send size={15} />
              </button>
            </form>
          </div>

        </section>

      </main>
      
      {/* Global CSS adjustments */}
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.15); }
          28% { transform: scale(1); }
          42% { transform: scale(1.15); }
          70% { transform: scale(1); }
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 229, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default VitalsDashboard;
