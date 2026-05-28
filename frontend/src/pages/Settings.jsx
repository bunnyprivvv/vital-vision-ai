import React from 'react';

const Settings = () => {
  return (
    <div className="flex flex-col gap-16 py-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="status-dot bg-cyber-lime shadow-[0_0_8px_var(--cyber-lime)]" />
          <h1 className="text-display leading-none">CORE_MAINTENANCE</h1>
        </div>
        <p className="text-[10px] font-black tracking-[0.6em] text-white/30 uppercase">SYSTEM_CALIBRATION_MANIFEST</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {[
          { label: 'Neural Core Sensitivity', value: 'OPTIMIZED', color: 'text-cyber-cyan' },
          { label: 'Uplink Frequency', value: '440MHz', color: 'text-white' },
          { label: 'Data Hashing Algorithm', value: 'SHA-3-512', color: 'text-white' },
          { label: 'Telemetry Verbosity', value: 'MODERATE', color: 'text-white' },
        ].map((s, i) => (
          <div key={i} className="tech-ticket flex items-center justify-between group cursor-none clickable hover:border-white/20 transition-all">
             <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{s.label}</span>
                <span className={`text-sm font-black tracking-tighter ${s.color}`}>{s.value}</span>
             </div>
             <div className="flex items-center gap-4">
                <div className="barcode-sim opacity-10 group-hover:opacity-40" />
                <button className="px-4 py-2 border border-white/10 text-[8px] font-black uppercase hover:border-white/40 transition-all">ADJUST</button>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-end">
         <button className="px-12 py-5 bg-cyber-cyan text-black font-black text-[10px] uppercase tracking-[0.3em] cursor-none clickable hover:bg-white transition-all">
           COMMIT_SYSTEM_WIDE_CHANGES
         </button>
      </div>
    </div>
  );
};

export default Settings;
