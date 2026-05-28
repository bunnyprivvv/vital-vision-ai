import React, { useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import confetti from 'canvas-confetti';
import { Download, Shield, Activity } from 'lucide-react';
import TrendChart from './TrendChart';

const RiskDashboard = ({ logs }) => {
  const dashboardRef = useRef(null);

  useEffect(() => {
    if (logs && logs.length > 0) {
      const latestLog = logs[0];
      if (latestLog && latestLog.data.score >= 80) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00ffff', '#3b82f6', '#8b5cf6']
        });
      }
    }
  }, [logs]);

  const handleExport = () => {
    const element = dashboardRef.current;
    
    const opt = {
      margin:       0.5,
      filename:     `VITASCAN_REPORT_${new Date().toLocaleDateString()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#000000' },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-24 tech-ticket bg-white/[0.01] border-none">
        <div className="status-dot animate-pulse mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">MANIFEST_EMPTY // NO_ACTIVE_TELEMETRY</p>
      </div>
    );
  }

  const latestHema = logs.find(l => l.type === 'HemaScan');
  const latestAudio = logs.find(l => l.type === 'AudioTriage');
  
  const scoresToAvg = logs.map(l => l.data.score);
  const averageScore = scoresToAvg.length > 0 
    ? scoresToAvg.reduce((a,c) => a + c, 0) / scoresToAvg.length
    : 0;
    
  let overallCategory = 'Low';
  if (averageScore < 50) overallCategory = 'High';
  else if (averageScore < 80) overallCategory = 'Moderate';

  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="px-4 py-2 lumina-glass flex items-center gap-3">
             <div className="status-dot" />
             <span className="text-[9px] font-black uppercase tracking-widest text-white/40">SYSTEM_NOMINAL</span>
          </div>
          <div className="px-4 py-2 lumina-glass flex items-center gap-3">
             <Shield size={12} className="text-cyber-cyan" />
             <span className="text-[9px] font-black uppercase tracking-widest text-white/40">PRIVACY_LOCKED</span>
          </div>
        </div>
        <button 
          onClick={handleExport}
          className="px-6 py-3 bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] cursor-none clickable hover:bg-cyber-cyan transition-all"
        >
          GENERATE_MANIFEST_PDF
        </button>
      </div>

      <div ref={dashboardRef} className="flex flex-col gap-12 bg-black">
        
        {/* Core Metrics Manifest */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="tech-ticket md:col-span-2 flex flex-col justify-between">
            <div className="flex items-center gap-4 mb-4">
              <Activity size={16} className="text-cyber-cyan" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Longitudinal_Risk_Trend</span>
            </div>
            <div className="h-[250px]">
               <TrendChart logs={logs} />
            </div>
          </div>

          <div className="tech-ticket flex flex-col items-center justify-center p-12 overflow-hidden">
            <div className="relative">
               {/* Orbital (Pure CSS Animation) */}
               <div className="absolute inset-[-16px] w-32 h-32 border border-cyber-cyan/10 rounded-full animate-rotate" />
               <div className="relative text-5xl font-black text-white tracking-tighter">
                 {Math.round(averageScore)}
               </div>
            </div>
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-cyber-cyan text-center">Wellness_Score</p>
            <div className="mt-4 px-4 py-1 bg-cyber-cyan/10 border border-cyber-cyan/20 rounded-sm">
                <span className="text-[8px] font-bold text-cyber-cyan uppercase">{overallCategory}_Risk_Profile</span>
            </div>
          </div>
        </div>

        {/* Diagnostic History */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-white/5" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">DIAGNOSTIC_HISTORY_STACK</span>
          </div>
          
          <div className="flex flex-col gap-4">
            {logs.map((log, i) => (
              <div key={i} className="tech-ticket flex items-center justify-between group transition-all">
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-white/60 tracking-widest uppercase">{log.type}</span>
                      <div className="h-1 w-1 bg-white/10 rounded-full" />
                      <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{new Date().toLocaleTimeString()}</span>
                   </div>
                   <p className="text-[10px] text-white/30 uppercase leading-relaxed max-w-xl">{log.data.advice}</p>
                </div>
                <div className="flex items-center gap-12">
                   <div className="flex flex-col items-end">
                      <span className="text-[8px] font-bold text-white/10 uppercase mb-1">SCORE</span>
                      <span className="text-lg font-black text-white group-hover:text-cyber-cyan transition-colors">{log.data.score}</span>
                   </div>
                   <div className="barcode-sim opacity-10 group-hover:opacity-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-rotate { animation: rotate 20s linear infinite; }
      `}</style>
    </div>
  );
};

export default RiskDashboard;
