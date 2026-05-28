import React from 'react';
import ReactiveBot from './ReactiveBot';

const TelemetryBar = ({ botStatus = 'idle', logs = [] }) => {
  return (
    <div className="autopilot-bar lumina-glass flex items-center h-[110px] px-12 fixed bottom-0 left-0 w-full z-[1001]">
      
      {/* 1. Identity Manifest */}
      <div className="flex items-center gap-6 w-[25%] group">
        <div className="relative">
          <ReactiveBot status={botStatus} size={60} />
          <div className="absolute -bottom-1 -right-1 status-dot animate-pulse" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-black tracking-widest uppercase text-white">SENTINEL_AI</span>
             <div className="h-[1px] w-4 bg-cyber-cyan/30" />
          </div>
          <span className="text-[8px] font-bold text-cyber-cyan/60 uppercase tracking-[0.3em] mt-1">PRO_ACTIVE // 77_A</span>
        </div>
      </div>

      {/* 2. Central Barcode Telemetry */}
      <div className="flex-grow flex flex-col items-center px-12">
        <div className="flex items-center gap-16 mb-4">
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">LAT_COORD</span>
            <span className="text-[10px] font-mono text-white/60 tracking-widest">52.3392 N</span>
          </div>

          <div className="h-8 w-[1px] bg-white/10" />

          <div className="flex flex-col items-center gap-2">
            <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">LNG_COORD</span>
            <span className="text-[10px] font-mono text-white/60 tracking-widest">4.8903 E</span>
          </div>

          <div className="h-8 w-[1px] bg-white/10" />

          <div className="flex flex-col items-center gap-2">
             <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">DATA_CERTAINTY</span>
             <span className="text-[10px] font-mono text-cyber-cyan">98.4%</span>
          </div>
        </div>
        
        {/* Procedural Barcode Stream */}
        <div className="w-full flex items-center gap-8 px-12">
          <div className="barcode-sim flex-grow h-[2px] opacity-[0.05]" />
          <div className="h-1.5 w-1.5 bg-cyber-cyan rounded-full animate-pulse shadow-[0_0_12px_var(--cyber-cyan)]" />
          <div className="barcode-sim flex-grow h-[2px] opacity-[0.05] rotate-180" />
        </div>
      </div>

      {/* 3. Operational Utilities */}
      <div className="flex items-center justify-end gap-12 w-[25%]">
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">Sync_Status</span>
            <span className="text-cyber-lime font-bold">{"^"}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-cyber-cyan/5 border border-cyber-cyan/10 rounded-sm">
             <span className="text-[8px] font-black text-cyber-cyan uppercase">NOMINAL</span>
          </div>
        </div>

        <div className="flex items-center gap-8 text-white/20">
          <button className="hover:text-cyber-cyan transition-all font-bold text-[10px] p-2">[!]</button>
          <button className="hover:text-cyber-cyan transition-all font-bold text-[10px] p-2">[?]</button>
        </div>
      </div>

    </div>
  );
};

export default TelemetryBar;
