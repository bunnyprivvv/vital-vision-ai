import React from 'react';

const Profile = () => {
  return (
    <div className="flex flex-col gap-16 py-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="status-dot" />
          <h1 className="text-display leading-none">SECURITY_PROFILE</h1>
        </div>
        <p className="text-[10px] font-black tracking-[0.6em] text-cyber-cyan uppercase">UPLINK_IDENTITY_0077_B</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="tech-ticket">
          <h2 className="text-lg mb-6">Operator Metadata</h2>
          <div className="space-y-4">
             <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[9px] text-white/20 uppercase font-black">Designation</span>
                <span className="text-[10px] font-mono">SENIOR_SENTINEL_OPERATOR</span>
             </div>
             <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[9px] text-white/20 uppercase font-black">Encryption Level</span>
                <span className="text-[10px] font-mono text-cyber-lime">LEVEL_5_QUANTUM</span>
             </div>
             <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[9px] text-white/20 uppercase font-black">Last Sync</span>
                <span className="text-[10px] font-mono">T-45M // AMSTERDAM_NODE</span>
             </div>
          </div>
        </div>

        <div className="tech-ticket flex flex-col justify-center items-center gap-8">
           <div className="w-24 h-24 rounded-full border border-cyber-cyan/30 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-cyber-cyan/5 animate-pulse" />
              <span className="text-2xl font-black text-white/40">77</span>
           </div>
           <button className="px-8 py-3 bg-white text-black font-black text-[9px] uppercase tracking-widest cursor-none clickable hover:bg-cyber-cyan transition-all">
             REGENERATE_IDENTITY_KEY
           </button>
        </div>
      </div>
      
      <div className="tech-ticket border-none bg-white/[0.01]">
         <div className="flex items-center justify-between opacity-20 italic">
            <span className="text-[8px] tracking-[0.4em]">PRIVACY_MANIFEST_77_A // SYSTEM_SECURED</span>
            <div className="barcode-sim" />
         </div>
      </div>
    </div>
  );
};

export default Profile;
