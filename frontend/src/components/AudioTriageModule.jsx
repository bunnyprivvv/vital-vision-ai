import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Loader2, Maximize, Mic } from 'lucide-react';

const AudioTriageModule = ({ onAnalyze }) => {
  const [status, setStatus] = useState('idle'); // idle | recording

  const handleActivate = async () => {
    setStatus('recording');
    
    // Simulate API fetch request
    try {
      // In a real app: const res = await fetch('/api/audiotriage', { method: 'POST' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      const score = Math.floor(Math.random() * 20) + 80; // 80-100
      onAnalyze('AUDIO_TRIAGE', score);
    } catch (e) {
      console.error(e);
      onAnalyze('AUDIO_TRIAGE', 50); // Error fallback
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="glass flex flex-col items-center justify-center p-6 h-64 relative overflow-hidden group border-white/10 hover:border-violet-neon/50 hover:shadow-[0_0_20px_rgba(176,38,255,0.1)] transition-all">
      {/* Background decoration */}
      <div className="absolute top-2 left-2 text-[8px] font-mono opacity-30 tracking-widest text-violet-neon">MODULE: AUDIO</div>
      <div className="absolute top-2 right-2 opacity-20"><Maximize size={12} /></div>
      
      <AnimatePresence mode="wait">
        {status === 'idle' ? (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-4 w-full h-full justify-center"
          >
            <div className="w-16 h-16 rounded-full border border-violet-neon/30 flex items-center justify-center bg-violet-neon/5 group-hover:bg-violet-neon/10 transition-colors">
              <Mic className="text-violet-neon w-8 h-8" />
            </div>
            <button 
              onClick={handleActivate}
              className="px-6 py-2 border border-violet-neon/50 text-violet-neon font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-violet-neon hover:text-black transition-all"
            >
              Activate Microphone
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="recording"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full flex items-center justify-center bg-black/40"
          >
            {/* Audio Waveform Animation */}
            <div className="flex gap-1 items-center h-20">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ['20%', '100%', '20%'] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                  className="w-2 rounded-full bg-violet-neon shadow-[0_0_10px_#B026FF]"
                />
              ))}
            </div>
            
            <div className="absolute bottom-2 left-2 flex items-center gap-2">
              <Loader2 size={12} className="animate-spin text-violet-neon" />
              <span className="text-[8px] font-mono text-violet-neon tracking-widest animate-pulse">Awaiting Server Response...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioTriageModule;
