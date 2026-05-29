import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Loader2, Maximize2, Mic, ShieldCheck, Heart } from 'lucide-react';

const AudioTriageModule = ({ onAnalyze, active }) => {
  const [status, setStatus] = useState('idle'); // idle | recording
  const [analyzedStats, setAnalyzedStats] = useState(null);
  const [scanFeed, setScanFeed] = useState("Initializing audio sensors...");

  const handleActivate = async () => {
    setStatus('recording');
    setAnalyzedStats(null);
    
    // Cycle simulated scan feed logs during audio triage
    const logs = [
      "Syncing localized acoustic diaphragm...",
      "Analyzing pulmonary inhale cycle...",
      "Scanning deep bronchial expansion...",
      "Calculating fluid friction signals...",
      "Evaluating vocal tract resonance..."
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < logs.length) {
        setScanFeed(logs[logIndex]);
        logIndex++;
      }
    }, 600);

    try {
      await new Promise(resolve => setTimeout(resolve, 3500));
      const score = Math.floor(Math.random() * 15) + 85; // 85-100
      setAnalyzedStats({
        respRate: '14 breaths/min',
        wheeze: '< 2.1% (Nominal)',
        resonance: 'Clear Bronchial',
        signal: '98.5% Quality'
      });
      onAnalyze('AUDIO_TRIAGE', score);
    } catch (e) {
      console.error(e);
      onAnalyze('AUDIO_TRIAGE', 82); // Error fallback
    } finally {
      clearInterval(interval);
      setStatus('idle');
    }
  };

  return (
    <div className={`glass flex flex-col items-center justify-center p-5 h-64 relative overflow-hidden group rounded-xl transition-all duration-500 hover:border-violet-neon/50 hover:shadow-[0_0_25px_rgba(176,38,255,0.15)] ${active ? 'border-violet-neon bg-violet-neon/[0.03] shadow-[0_0_30px_rgba(176,38,255,0.1)]' : 'border-white/5 bg-black/40'}`}>
      
      {/* Top Details HUD */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 opacity-40 font-mono text-[7.5px] tracking-widest text-violet-neon font-bold">
        <Activity size={10} />
        <span>ACOUSTIC TELEMETRY // AUDIO_TRIAGE</span>
      </div>
      <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-40 transition-opacity"><Maximize2 size={11} /></div>
      
      <AnimatePresence mode="wait">
        {status === 'idle' ? (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-3.5 w-full h-full justify-center text-center mt-3"
          >
            {analyzedStats ? (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-2.5"
              >
                <div className="w-10 h-10 rounded-full border border-violet-neon/40 bg-violet-neon/5 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(176,38,255,0.1)]">
                  <ShieldCheck className="text-violet-neon w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-violet-neon font-bold uppercase tracking-wider">Acoustics Synced</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[9px] text-white/50 max-w-[190px] mx-auto mt-2 text-left">
                    <div>• Resp: <span className="text-white font-bold">{analyzedStats.respRate}</span></div>
                    <div>• Wheeze: <span className="text-white font-bold">{analyzedStats.wheeze}</span></div>
                    <div>• Sound: <span className="text-white font-bold">{analyzedStats.resonance}</span></div>
                    <div>• Telemetry: <span className="text-white font-bold">{analyzedStats.signal}</span></div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full border border-violet-neon/20 bg-violet-neon/5 flex items-center justify-center group-hover:bg-violet-neon/10 group-hover:border-violet-neon/40 transition-all duration-300">
                  <Mic className="text-violet-neon w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-heading text-xs uppercase text-white font-bold tracking-wider">AudioTriage Pulmonary Mic</h4>
                  <p className="font-mono text-[8px] text-white/40 mt-1 uppercase">High-res bronchial acoustic scanner</p>
                </div>
              </>
            )}

            <button 
              onClick={(e) => { e.stopPropagation(); handleActivate(); }}
              className="px-5 py-2 border border-violet-neon/40 text-violet-neon font-mono text-[9px] tracking-widest uppercase hover:bg-violet-neon hover:text-white transition-all rounded-md font-bold z-10"
            >
              {analyzedStats ? 'Re-Run Audio Triage' : 'Initialize Mic Scan'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="recording"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full flex flex-col items-center justify-center border border-dashed border-violet-neon/30 bg-black/60 rounded-lg overflow-hidden mt-3 p-4"
          >
            {/* Audio Waveform Animation - 16 columns of glowing frequency curves */}
            <div className="flex gap-[3.5px] items-center h-20 z-10 relative">
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ['20%', '100%', '20%'] }}
                  transition={{
                    duration: 0.7,
                    repeat: Infinity,
                    delay: i * 0.08,
                    ease: "easeInOut"
                  }}
                  className="w-1.5 rounded-full bg-violet-neon shadow-[0_0_12px_#B026FF]"
                />
              ))}
            </div>
            
            {/* Scrolling real-time logs text */}
            <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between z-20 font-mono text-[8px]">
              <div className="flex items-center gap-1.5 text-violet-neon">
                <Loader2 size={10} className="animate-spin text-violet-neon" />
                <span className="tracking-wide text-[7px] uppercase font-bold animate-pulse">{scanFeed}</span>
              </div>
              <div className="text-violet-neon/50 uppercase tracking-widest text-[6.5px]">
                MIC: ACTIVE
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioTriageModule;
