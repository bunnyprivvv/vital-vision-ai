import React from 'react';
import { motion } from 'framer-motion';
import AudioTriageMic from '../components/AudioTriageMic';
import { Mic, Activity } from 'lucide-react';

const AudioPage = ({ userId, onResult }) => {
  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
      
      {/* Page Manifest */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-display leading-none text-4xl">AUDIO_TRIAGE</h1>
            <p className="text-[10px] font-black tracking-[0.5em] text-cyber-cyan mt-6 uppercase">Acoustic_Respiratory_Array_Protocol</p>
          </div>
          <div className="p-4 lumina-glass text-white/20">
            <Mic size={24} />
          </div>
        </div>
        <div className="h-[1px] w-full bg-white/5 relative">
          <motion.div 
            className="absolute left-0 top-0 h-full bg-cyber-cyan/30"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Instruction Block */}
        <div className="md:col-span-1 flex flex-col gap-8">
          <div className="flex items-center gap-3">
             <div className="status-dot scale-75" />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Sonic_Capture_Manifest</span>
          </div>
          <div className="text-xs text-white/40 leading-relaxed font-medium uppercase tracking-wider">
            Minimize ambient interference. Capture a high-fidelity acoustic sample of respiratory activity. System will analyze spectral density and harmonic anomalies.
          </div>
          <div className="mt-auto pt-8 border-t border-white/5">
             <Activity size={16} className="text-white/10" />
             <p className="text-[8px] font-bold text-white/10 mt-2 uppercase">Acoustic_Sentinel_v11.A</p>
          </div>
        </div>

        {/* Diagnostic Block */}
        <div className="md:col-span-2">
           <AudioTriageMic userId={userId} onResult={onResult} />
        </div>
      </div>

      {/* Decorative vertical line */}
      <div className="fixed top-0 left-12 w-[1px] h-full bg-white/5 pointer-events-none hidden lg:block" />
    </div>
  );
};

export default AudioPage;
