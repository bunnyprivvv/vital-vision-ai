import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Loader2, Maximize2, ShieldCheck, Microscope } from 'lucide-react';

const HemaScanModule = ({ onAnalyze, active }) => {
  const [status, setStatus] = useState('idle'); // idle | scanning
  const [analyzedStats, setAnalyzedStats] = useState(null);

  const handleActivate = async () => {
    setStatus('scanning');
    setAnalyzedStats(null);
    
    // Simulate complex blood pathology scans
    try {
      await new Promise(resolve => setTimeout(resolve, 3500));
      const score = Math.floor(Math.random() * 20) + 80; // 80-100
      setAnalyzedStats({
        rbc: '4.82 M/uL',
        wbc: '6.8 K/uL',
        hemo: '14.2 g/dL',
        platelets: '280 K/uL'
      });
      onAnalyze('HEMA_SCAN', score);
    } catch (e) {
      console.error(e);
      onAnalyze('HEMA_SCAN', 75); // Error fallback
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className={`glass-cyan flex flex-col items-center justify-center p-5 h-64 relative overflow-hidden group rounded-xl transition-all duration-500 hover:shadow-[0_0_25px_rgba(0,229,255,0.15)] ${active ? 'border-cyan-biomed bg-cyan-biomed/[0.03] shadow-[0_0_30px_rgba(0,229,255,0.1)]' : 'border-white/5 bg-black/40'}`}>
      
      {/* Top Details HUD */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 opacity-40 font-mono text-[7.5px] tracking-widest text-cyan-biomed font-bold">
        <Microscope size={10} />
        <span>PATHOLOGY ANALYZER // HEMA_SCAN</span>
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
                <div className="w-10 h-10 rounded-full border border-cyan-biomed/40 bg-cyan-biomed/5 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                  <ShieldCheck className="text-cyan-biomed w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-cyan-biomed font-bold uppercase tracking-wider">Analysis Complete</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[9px] text-white/50 max-w-[190px] mx-auto mt-2 text-left">
                    <div>• RBC: <span className="text-white font-bold">{analyzedStats.rbc}</span></div>
                    <div>• WBC: <span className="text-white font-bold">{analyzedStats.wbc}</span></div>
                    <div>• HEMO: <span className="text-white font-bold">{analyzedStats.hemo}</span></div>
                    <div>• PLT: <span className="text-white font-bold">{analyzedStats.platelets}</span></div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full border border-cyan-biomed/20 bg-cyan-biomed/5 flex items-center justify-center group-hover:bg-cyan-biomed/10 group-hover:border-cyan-biomed/40 transition-all duration-300">
                  <Eye className="text-cyan-biomed w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-heading text-xs uppercase text-white font-bold tracking-wider">HemaScan Smear Analyser</h4>
                  <p className="font-mono text-[8px] text-white/40 mt-1 uppercase">Automated cell morphology scanner</p>
                </div>
              </>
            )}

            <button 
              onClick={(e) => { e.stopPropagation(); handleActivate(); }}
              className="px-5 py-2 border border-cyan-biomed/40 text-cyan-biomed font-mono text-[9px] tracking-widest uppercase hover:bg-cyan-biomed hover:text-black transition-all rounded-md font-bold z-10"
            >
              {analyzedStats ? 'Re-Run Blood Analysis' : 'Initialize HemaScan'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full flex items-center justify-center border border-dashed border-cyan-biomed/30 bg-black/60 rounded-lg overflow-hidden mt-3"
          >
            {/* Holographic Microscope Aperture Scope */}
            <div className="absolute inset-4 rounded-full border border-cyan-biomed/10 flex items-center justify-center">
              <div className="absolute inset-4 rounded-full border border-dashed border-cyan-biomed/20 animate-[spin_8s_linear_infinite]" />
              <div className="absolute inset-8 rounded-full border border-cyan-biomed/10" />
            </div>

            {/* Drifting Red & White Blood Cells */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              {/* Red cells */}
              {[
                { top: '30%', left: '20%', size: 14, delay: 0 },
                { top: '65%', left: '70%', size: 16, delay: 0.5 },
                { top: '20%', left: '60%', size: 12, delay: 1 },
                { top: '75%', left: '30%', size: 15, delay: 0.2 },
                { top: '45%', left: '80%', size: 13, delay: 0.8 },
              ].map((c, i) => (
                <motion.div
                  key={`rbc-${i}`}
                  animate={{ 
                    x: [0, Math.random() * 20 - 10, 0],
                    y: [0, Math.random() * 20 - 10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: c.delay, ease: "easeInOut" }}
                  style={{
                    position: 'absolute', top: c.top, left: c.left,
                    width: c.size, height: c.size, borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.45)', border: '1px solid rgba(239, 68, 68, 0.7)',
                    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.5)'
                  }}
                />
              ))}

              {/* White cells (Leukocytes) */}
              {[
                { top: '40%', left: '45%', size: 18, delay: 0.3 },
                { top: '60%', left: '15%', size: 20, delay: 0.9 },
              ].map((c, i) => (
                <motion.div
                  key={`wbc-${i}`}
                  animate={{ 
                    x: [0, Math.random() * 15 - 7, 0],
                    y: [0, Math.random() * 15 - 7, 0],
                    rotate: [0, 360]
                  }}
                  transition={{ duration: 5, repeat: Infinity, delay: c.delay, ease: "easeInOut" }}
                  style={{
                    position: 'absolute', top: c.top, left: c.left,
                    width: c.size, height: c.size, borderRadius: '50%',
                    background: 'rgba(0, 229, 255, 0.25)', border: '1px dashed rgba(0, 229, 255, 0.65)',
                    boxShadow: '0 0 8px rgba(0, 229, 255, 0.3)'
                  }}
                />
              ))}
            </div>

            {/* Sweeping Laser Sweep */}
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              className="absolute left-0 w-full h-[1.5px] bg-cyan-biomed shadow-[0_0_15px_#00E5FF] z-10"
            />
            
            {/* Dynamic Telemetry variables HUD */}
            <div className="absolute bottom-2.5 left-3 flex items-center gap-2 z-20">
              <Loader2 size={12} className="animate-spin text-cyan-biomed" />
              <span className="text-[7.5px] font-mono text-cyan-biomed tracking-[0.15em] animate-pulse uppercase">PATHOLOGY_SCAN: EXTRAPOLATING_TELEMETRY...</span>
            </div>
            
            {/* Mini digital scale indicator */}
            <div className="absolute top-2.5 right-3 font-mono text-[7px] text-cyan-biomed/50 uppercase tracking-widest z-20">
              CELL_ZOOM: 1200X
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HemaScanModule;
