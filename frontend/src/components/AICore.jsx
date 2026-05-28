import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AICore = ({ status = 'idle', size = 200 }) => {
  const getAccentColor = () => {
    switch (status) {
      case 'scanning': return '#B026FF'; // Neon Violet
      case 'typing': return '#00E5FF';   // Electric Cyan
      case 'error': return '#FF3D00';
      default: return '#00E5FF';
    }
  };

  const accentColor = getAccentColor();

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Rings - Static/Glow */}
      <div className="absolute inset-0 rounded-full border border-white/5 bg-white/[0.01]" />
      
      {/* Ripple Animation for Scanning/Working */}
      <AnimatePresence>
        {(status === 'scanning' || status === 'typing') && (
          <>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.6,
                  ease: "easeOut" 
                }}
                className="absolute inset-0 rounded-full border border-cyan-biomed/30"
                style={{ borderColor: accentColor + '44' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Orbiting Particles */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2"
      >
        <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-cyan-biomed rounded-full blur-[2px] shadow-[0_0_8px_#00E5FF]" />
      </motion.div>

      {/* Main Core */}
      <motion.div
        animate={{ 
          scale: status === 'idle' ? [1, 1.05, 1] : status === 'scanning' ? [1, 1.2, 1] : 1,
          boxShadow: status === 'idle' 
            ? `0 0 40px -10px ${accentColor}33` 
            : `0 0 60px -5px ${accentColor}66`
        }}
        transition={{ 
          duration: status === 'idle' ? 4 : 0.4, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="relative z-10 w-1/3 h-1/3 rounded-full flex items-center justify-center bg-black border"
        style={{ borderColor: accentColor + '66' }}
      >
        {/* Inner Waveform/Visualizer */}
        <div className="flex gap-[2px] items-center h-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                height: status === 'idle' ? [4, 12, 4] : [8, 16, 8]
              }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity, 
                delay: i * 0.1,
                ease: "easeInOut" 
              }}
              className="w-[3px] rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          ))}
        </div>
      </motion.div>

      {/* Status Ring */}
      <div className="absolute inset-8 rounded-full border border-white/5 border-dashed animate-[spin_20s_linear_infinite]" />
      
    </div>
  );
};

export default AICore;
