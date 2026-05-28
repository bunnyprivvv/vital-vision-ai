import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Loader2, Maximize } from 'lucide-react';

const HemaScanModule = ({ onAnalyze }) => {
  const [status, setStatus] = useState('idle'); // idle | scanning

  const handleActivate = async () => {
    setStatus('scanning');
    
    // Simulate API fetch request
    try {
      // In a real app: const res = await fetch('/api/hemascan', { method: 'POST' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      const score = Math.floor(Math.random() * 30) + 70; // 70-100
      onAnalyze('HEMA_SCAN', score);
    } catch (e) {
      console.error(e);
      onAnalyze('HEMA_SCAN', 50); // Error fallback
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="glass-cyan flex flex-col items-center justify-center p-6 h-64 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-2 left-2 text-[8px] font-mono opacity-30 tracking-widest">MODULE: HEMA</div>
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
            <div className="w-16 h-16 rounded-full border border-cyan-biomed/30 flex items-center justify-center bg-cyan-biomed/5 group-hover:bg-cyan-biomed/10 transition-colors">
              <Eye className="text-cyan-biomed w-8 h-8" />
            </div>
            <button 
              onClick={handleActivate}
              className="px-6 py-2 border border-cyan-biomed/50 text-cyan-biomed font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-cyan-biomed hover:text-black transition-all"
            >
              Activate Camera
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full flex items-center justify-center border border-dashed border-cyan-biomed/30 bg-black/40"
          >
            {/* High-tech grid background */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(rgba(0, 229, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.2) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
            {/* Sweeping Laser */}
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              className="absolute left-0 w-full h-1 bg-cyan-biomed shadow-[0_0_15px_#00E5FF] z-10"
            />
            {/* Target Reticle */}
            <div className="absolute inset-4 border border-cyan-biomed/20" />
            <div className="absolute inset-8 border border-cyan-biomed/10 rounded-full" />
            
            <div className="absolute bottom-2 left-2 flex items-center gap-2">
              <Loader2 size={12} className="animate-spin text-cyan-biomed" />
              <span className="text-[8px] font-mono text-cyan-biomed tracking-widest animate-pulse">Awaiting Server Response...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HemaScanModule;
