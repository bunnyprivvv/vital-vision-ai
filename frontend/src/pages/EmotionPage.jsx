import React from 'react';
import { motion } from 'framer-motion';
import EmotionScanCam from '../components/EmotionScanCam';
import { Activity, Shield } from 'lucide-react';

const EmotionPage = ({ userId, onResult }) => {
  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
      
      {/* Page Manifest */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-display leading-none text-4xl">EMOTION_AI</h1>
            <p className="text-[10px] font-black tracking-[0.5em] text-cyber-cyan mt-6 uppercase">Cognitive_Equilibrium_Analysis_Protocol</p>
          </div>
          <div className="p-4 lumina-glass text-white/20">
            <Activity size={24} />
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
             <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Cognitive_State_Manifest</span>
          </div>
          <div className="text-xs text-white/40 leading-relaxed font-medium uppercase tracking-wider">
            Maintain ocular contact with the sensor. System will perform a high-frequency micro-expression check to compute a cognitive equilibrium score.
          </div>
          <div className="mt-auto pt-8 border-t border-white/5">
             <Shield size={16} className="text-white/10" />
             <p className="text-[8px] font-bold text-white/10 mt-2 uppercase">Emotion_Sentinel_v11.A</p>
          </div>
        </div>

        {/* Diagnostic Block */}
        <div className="md:col-span-2">
           <EmotionScanCam userId={userId} onResult={onResult} />
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed bottom-12 right-12 text-white/5 font-mono text-[10px] pointer-events-none hidden lg:block italic">
        COGNITIVE_ARRAY_ACTIVE // PROTOCOL_77_A
      </div>
    </div>
  );
};

export default EmotionPage;
