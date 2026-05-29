import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DigitalTwin = ({ activeScan = 'idle', size = 180 }) => {
  const isHema = activeScan === 'HEMA_SCAN';
  const isAudio = activeScan === 'AUDIO_TRIAGE';

  const baseStroke = 'rgba(255, 255, 255, 0.12)';
  const pulseTransition = { duration: 1.6, repeat: Infinity, ease: 'easeInOut' };

  return (
    <div className="relative flex items-center justify-center p-2" style={{ width: size, height: size * 1.4 }}>
      {/* Dynamic Background Circular Pulse Glow */}
      <motion.div 
        animate={{ 
          opacity: isHema || isAudio ? 0.35 : 0.12,
          scale: isHema || isAudio ? [1, 1.08, 1] : 1
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,229,255,0.22)_0%,_transparent_70%)] rounded-full blur-[25px]" 
      />

      <svg 
        viewBox="0 0 200 300" 
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        style={{ filter: "drop-shadow(0px 0px 6px rgba(0, 229, 255, 0.15))" }}
      >
        {/* === HOLOGRAM SCOPE BOUNDS (Circular grid overlays) === */}
        <motion.circle 
          cx="100" cy="150" r="140" fill="none" stroke="rgba(0, 229, 255, 0.03)" strokeWidth="1"
        />
        <motion.circle 
          cx="100" cy="150" r="110" fill="none" stroke="rgba(176, 38, 255, 0.02)" strokeWidth="1" strokeDasharray="3 6"
        />
        
        {/* Rotating outer targeting scope */}
        <motion.circle
          cx="100" cy="150" r="95"
          fill="none"
          stroke="rgba(0, 229, 255, 0.05)"
          strokeWidth="1"
          strokeDasharray="40 180"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.circle
          cx="100" cy="150" r="85"
          fill="none"
          stroke="rgba(176, 38, 255, 0.04)"
          strokeWidth="0.8"
          strokeDasharray="20 90"
          animate={{ rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        />

        {/* === HEAD MODULE (CEREBRAL) === */}
        <motion.path
          d="M 100 25 C 72 25, 72 65, 77 82 C 82 98, 90 98, 90 115 L 110 115 C 110 98, 118 98, 123 82 C 128 65, 128 25, 100 25 Z"
          fill="none"
          stroke={isHema ? '#B026FF' : baseStroke}
          strokeWidth={isHema ? 2.5 : 1}
          animate={{
            strokeOpacity: isHema ? [0.5, 1, 0.5] : 1
          }}
          transition={pulseTransition}
          style={{ filter: isHema ? "drop-shadow(0 0 6px #B026FF)" : "none" }}
        />
        
        {/* Brain Neural Net nodes */}
        <motion.path
           d="M 85 48 Q 100 38 115 48 M 82 62 Q 100 52 118 62 M 81 76 Q 100 66 119 76"
           fill="none"
           stroke={isHema ? '#B026FF' : 'rgba(255,255,255,0.06)'}
           strokeWidth="0.8"
           animate={{ strokeOpacity: isHema ? [0.3, 0.9, 0.3] : 0.4 }}
           transition={{ ...pulseTransition, delay: 0.2 }}
        />
        
        {/* Glowing Head Node */}
        {isHema && (
          <motion.circle
            cx="100" cy="55" r="4"
            fill="#B026FF"
            animate={{ scale: [1, 1.6, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ filter: "drop-shadow(0 0 8px #B026FF)" }}
          />
        )}

        {/* === SHOULDERS & TORSO WIREFRAME === */}
        <path
          d="M 90 115 C 60 120, 42 135, 32 165 L 22 275 M 110 115 C 140 120, 158 135, 168 165 L 178 275 M 60 275 L 60 175 C 60 155, 140 155, 140 175 L 140 275"
          fill="none"
          stroke={baseStroke}
          strokeWidth="0.8"
        />

        {/* === RESPIRATORY PULMONARY INTERFACE (LUNGS) === */}
        {/* Bronchial Trachea pathway */}
        <motion.line 
          x1="100" y1="115" x2="100" y2="145" 
          stroke={isAudio ? '#00E5FF' : baseStroke} 
          strokeWidth={isAudio ? 2.5 : 1}
          animate={{ strokeOpacity: isAudio ? [0.6, 1, 0.6] : 1 }}
          transition={pulseTransition}
        />
        
        {/* Left Lung Silhouette */}
        <motion.path
          d="M 96 145 C 72 150, 52 185, 62 225 C 72 235, 90 225, 96 205 Z"
          fill={isAudio ? 'rgba(0, 229, 255, 0.03)' : 'none'}
          stroke={isAudio ? '#00E5FF' : baseStroke}
          strokeWidth={isAudio ? 2 : 1}
          animate={{
             strokeOpacity: isAudio ? [0.4, 1, 0.4] : 0.7,
             fillOpacity: isAudio ? [0.05, 0.2, 0.05] : 0
          }}
          transition={pulseTransition}
          style={{ filter: isAudio ? "drop-shadow(0 0 5px #00E5FF)" : "none" }}
        />
        
        {/* Right Lung Silhouette */}
        <motion.path
          d="M 104 145 C 128 150, 148 185, 138 225 C 128 235, 110 225, 104 205 Z"
          fill={isAudio ? 'rgba(0, 229, 255, 0.03)' : 'none'}
          stroke={isAudio ? '#00E5FF' : baseStroke}
          strokeWidth={isAudio ? 2 : 1}
          animate={{
             strokeOpacity: isAudio ? [0.4, 1, 0.4] : 0.7,
             fillOpacity: isAudio ? [0.05, 0.2, 0.05] : 0
          }}
          transition={{ ...pulseTransition, delay: 0.15 }}
          style={{ filter: isAudio ? "drop-shadow(0 0 5px #00E5FF)" : "none" }}
        />

        {/* === CIRCULATORY SYSTEM (CARDIAC CARDIO) === */}
        {/* Pulsating Heart core */}
        <motion.circle
           cx="106" cy="175" r="7"
           fill={isHema ? '#B026FF' : 'rgba(0, 229, 255, 0.1)'}
           stroke={isHema ? '#B026FF' : 'rgba(0, 229, 255, 0.3)'}
           strokeWidth="1"
           animate={{
              scale: isHema ? [1, 1.45, 1] : [1, 1.15, 1],
              opacity: isHema ? [0.7, 1, 0.7] : [0.4, 0.7, 0.4]
           }}
           transition={{ duration: 0.85, repeat: Infinity, ease: 'easeOut' }}
           style={{ filter: isHema ? "drop-shadow(0 0 12px #B026FF)" : "drop-shadow(0 0 4px #00E5FF)" }}
        />
        
        {/* Branching Arteries/Vessels flow lines */}
        <motion.path
           d="M 106 175 Q 82 155 42 175 M 106 175 Q 130 155 158 175 M 106 175 L 106 270 M 106 175 Q 82 225 42 270 M 106 175 Q 130 225 158 270"
           fill="none"
           stroke={isHema ? '#B026FF' : 'rgba(0, 229, 255, 0.12)'}
           strokeWidth={isHema ? 1.5 : 0.6}
           strokeDasharray="4 6"
           animate={{
              strokeDashoffset: isHema ? [0, -24] : [0, -12],
              strokeOpacity: isHema ? [0.4, 1, 0.4] : 0.6
           }}
           transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Hologram targeting metrics text (simulated data coordinates) */}
        <text x="18" y="290" fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="monospace">X: 42.1</text>
        <text x="150" y="290" fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="monospace">Y: 89.4</text>
      </svg>

      {/* Sweeping laser target scanning line */}
      <AnimatePresence>
         {(isHema || isAudio) && (
            <motion.div
               key="scope-laser"
               initial={{ top: '10%', opacity: 0 }}
               animate={{ top: ['10%', '90%', '10%'], opacity: 0.45 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
               className={`absolute left-[15%] right-[15%] h-[1.5px] z-20 mix-blend-overlay ${isHema ? 'bg-violet-neon shadow-[0_0_10px_#B026FF]' : 'bg-cyan-biomed shadow-[0_0_10px_#00E5FF]'}`}
            />
         )}
      </AnimatePresence>
    </div>
  );
};

export default DigitalTwin;
