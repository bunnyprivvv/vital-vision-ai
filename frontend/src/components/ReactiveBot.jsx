import React from 'react';

const ReactiveBot = ({ status = 'idle', size = 150 }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'thinking': return 'var(--cyber-cyan)';
      case 'responding': return 'var(--cyber-lime)';
      case 'listening': return 'var(--sunset-orange)';
      case 'error': return 'var(--tesla-red)';
      default: return 'rgba(255,255,255,0.1)';
    }
  };

  return (
    <div 
      className="reactive-bot-container relative flex items-center justify-center p-4"
      style={{ width: size, height: size }}
    >
      {/* 1. Orbitals (Pure CSS) */}
      <div className={`absolute inset-0 border border-white/5 rounded-full ${status !== 'idle' ? 'animate-spin-slow' : ''}`} />
      <div className={`absolute inset-4 border border-white/5 rounded-full ${status !== 'idle' ? 'animate-spin-reverse' : ''}`} />
      
      {/* 2. Neural Core */}
      <div 
        className="relative z-10 w-1/3 h-1/3 rounded-full transition-all duration-500"
        style={{ 
          backgroundColor: getStatusColor(),
          boxShadow: `0 0 30px ${getStatusColor()}`,
          transform: status === 'thinking' ? 'scale(1.2)' : 'scale(1)'
        }}
      >
        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-30" />
      </div>

      {/* 3. Status Ring */}
      <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
        <circle
          cx="50%"
          cy="50%"
          r="48%"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        {status !== 'idle' && (
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke={getStatusColor()}
            strokeWidth="1"
            strokeDasharray="10 300"
            className="animate-spin-fast"
          />
        )}
      </svg>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 8s linear infinite; }
        .animate-spin-fast { animation: spin-fast 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default ReactiveBot;
