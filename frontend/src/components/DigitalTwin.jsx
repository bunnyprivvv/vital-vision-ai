import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DigitalTwin = ({ activeScan = 'idle', size = 180 }) => {
  // Define animation states based on active scan
  const isHema = activeScan === 'HEMA_SCAN';
  const isAudio = activeScan === 'AUDIO_TRIAGE';

  // Base styling for the wireframe
  const baseStroke = 'rgba(255, 255, 255, 0.15)';
  const pulseTransition = { duration: 1.5, repeat: Infinity, ease: 'easeInOut' };

  return (
    <div className="relative flex items-center justify-center p-4" style={{ width: size, height: size * 1.5 }}>
      {/* Background Hologram Glow */}
      <motion.div 
        animate={{ 
          opacity: isHema || isAudio ? 0.3 : 0.1,
          scale: isHema || isAudio ? 1.05 : 1
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,229,255,0.2)_0%,_transparent_70%)] rounded-full blur-[20px]" 
      />

      <svg 
        viewBox="0 0 200 300" 
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        style={{ filter: "drop-shadow(0px 0px 8px rgba(0, 229, 255, 0.2))" }}
      >
        {/* === HEAD & NECK === */}
        <motion.path
          d="M 100 20 C 70 20, 70 60, 75 80 C 80 100, 90 100, 90 120 L 110 120 C 110 100, 120 100, 125 80 C 130 60, 130 20, 100 20 Z"
          fill="none"
          stroke={isHema ? '#B026FF' : baseStroke}
          strokeWidth={isHema ? 2.5 : 1}
          animate={{
            strokeOpacity: isHema ? [0.4, 1, 0.4] : 1
          }}
          transition={pulseTransition}
          style={{ filter: isHema ? "drop-shadow(0 0 8px #B026FF)" : "none" }}
        />
        
        {/* Brain / Cerebrum Lines (Inner Head) */}
        <motion.path
           d="M 85 45 Q 100 35 115 45 M 82 60 Q 100 50 118 60 M 80 75 Q 100 65 120 75"
           fill="none"
           stroke={isHema ? '#B026FF' : 'rgba(255,255,255,0.05)'}
           strokeWidth="1"
           animate={{ strokeOpacity: isHema ? [0.2, 0.8, 0.2] : 0.5 }}
           transition={{ ...pulseTransition, delay: 0.2 }}
        />

        {/* === SHOULDERS & TORSO OUTLINE === */}
        <path
          d="M 90 120 C 60 125, 40 140, 30 170 L 20 280 M 110 120 C 140 125, 160 140, 170 170 L 180 280 M 60 280 L 60 180 C 60 160, 140 160, 140 180 L 140 280"
          fill="none"
          stroke={baseStroke}
          strokeWidth="1"
        />

        {/* === LUNGS & RESPIRATORY (AUDIO TRIAGE) === */}
        {/* Trachea */}
        <motion.line 
          x1="100" y1="120" x2="100" y2="150" 
          stroke={isAudio ? '#00E5FF' : baseStroke} 
          strokeWidth={isAudio ? 3 : 1}
          animate={{ strokeOpacity: isAudio ? [0.5, 1, 0.5] : 1 }}
          transition={pulseTransition}
        />
        {/* Left Lung */}
        <motion.path
          d="M 95 150 C 70 155, 50 190, 60 230 C 70 240, 90 230, 95 210 Z"
          fill="rgba(0, 229, 255, 0.02)"
          stroke={isAudio ? '#00E5FF' : baseStroke}
          strokeWidth={isAudio ? 2 : 1}
          animate={{
             strokeOpacity: isAudio ? [0.3, 1, 0.3] : 0.8,
             fillOpacity: isAudio ? [0, 0.2, 0] : 0
          }}
          transition={pulseTransition}
          style={{ filter: isAudio ? "drop-shadow(0 0 6px #00E5FF)" : "none" }}
        />
        {/* Right Lung */}
        <motion.path
          d="M 105 150 C 130 155, 150 190, 140 230 C 130 240, 110 230, 105 210 Z"
          fill="rgba(0, 229, 255, 0.02)"
          stroke={isAudio ? '#00E5FF' : baseStroke}
          strokeWidth={isAudio ? 2 : 1}
          animate={{
             strokeOpacity: isAudio ? [0.3, 1, 0.3] : 0.8,
             fillOpacity: isAudio ? [0, 0.2, 0] : 0
          }}
          transition={{ ...pulseTransition, delay: 0.1 }}
          style={{ filter: isAudio ? "drop-shadow(0 0 6px #00E5FF)" : "none" }}
        />

        {/* === CIRCULATORY SYSTEM (HEMASCAN) === */}
        {/* Heart Core */}
        <motion.circle
           cx="105" cy="180" r="8"
           fill={isHema ? '#B026FF' : 'none'}
           stroke={isHema ? '#B026FF' : 'rgba(255,255,255,0.05)'}
           strokeWidth="1"
           animate={{
              scale: isHema ? [1, 1.4, 1] : 1,
              opacity: isHema ? [0.6, 1, 0.6] : 1
           }}
           transition={{ duration: 0.8, repeat: Infinity, ease: 'easeOut' }}
           style={{ filter: isHema ? "drop-shadow(0 0 10px #B026FF)" : "none" }}
        />
        {/* Main Arteries / Veins branching out */}
        <motion.path
           d="M 105 180 Q 80 160 40 180 M 105 180 Q 130 160 160 180 M 105 180 L 105 280 M 105 180 Q 80 230 40 280 M 105 180 Q 130 230 160 280"
           fill="none"
           stroke={isHema ? '#B026FF' : baseStroke}
           strokeWidth={isHema ? 1.5 : 0.5}
           strokeDasharray="4 4"
           animate={{
              strokeDashoffset: isHema ? [0, -20] : 0,
              strokeOpacity: isHema ? [0.3, 0.9, 0.3] : 0.5
           }}
           transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </svg>

      {/* Abstract Scanning Grid Overlay running across the body when active */}
      <AnimatePresence>
         {(isHema || isAudio) && (
            <motion.div
               key="scan-laser"
               initial={{ top: '0%', opacity: 0 }}
               animate={{ top: ['0%', '100%', '0%'], opacity: 0.4 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
               className="absolute left-0 w-full h-[2px] bg-white mix-blend-overlay shadow-[0_0_8px_#ffffff]"
            />
         )}
      </AnimatePresence>
    </div>
  );
};

export default DigitalTwin;
