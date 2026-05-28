import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RiskDashboard from '../components/RiskDashboard';
import ChatPanel from '../components/ChatPanel';

const Dashboard = ({ logs }) => {
  const protocols = [
    { id: 'hema', label: 'HEMA_SCAN', desc: 'Anemia & Pallor Monitoring', icon: 'O', path: '/hemascan' },
    { id: 'audio', label: 'AUDIO_TRIAGE', desc: 'Acoustic Signature Analysis', icon: '~', path: '/audiotriage' },
    { id: 'dermo', label: 'DERMO_SCAN', desc: 'Dermal Asymmetry Mapping', icon: '#', path: '/dermoscan' },
    { id: 'emotion', label: 'EMOTION_AI', desc: 'Cognitive Equilibrium Protocol', icon: 'E', path: '/emotionscan' },
  ];

  return (
    <div className="flex flex-col gap-24 py-12">
      
      {/* 1. Header & Procedural ID */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-display leading-none">MANIFEST</h1>
            <p className="text-[10px] font-black tracking-[0.5em] text-cyber-cyan mt-6 uppercase">VITASCAN_SENTINEL_SYSTEM_PROTOCOL_ALPHA</p>
          </div>
          <div className="hidden lg:flex flex-col items-end gap-2 text-white/10 uppercase italic">
            <span className="text-[8px] tracking-[0.3em]">X_COORD // 52.3392</span>
            <span className="text-[8px] tracking-[0.3em]">Y_COORD // 4.8903</span>
            <div className="barcode-sim w-32 mt-2 opacity-50" />
          </div>
        </div>

        <div className="h-[1px] w-full bg-white/5 relative mt-4">
          <div 
            className="absolute left-0 top-0 h-full bg-cyber-cyan transition-all duration-[10000ms] ease-linear"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* 2. Tech-Ticket Grid */}
      <section>
        <div className="flex items-center gap-4 mb-16">
          <div className="w-10 h-10 border border-cyber-cyan/30 flex items-center justify-center">
             <span className="text-cyber-cyan text-xs font-bold font-mono">#</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-black uppercase tracking-tight">Active Diagnostic Modules</h2>
            <span className="text-[8px] font-bold text-white/20 tracking-[0.4em] uppercase">Select a protocol to initialize scanning</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {protocols.map((p) => (
            <Link 
              key={p.id}
              to={p.path}
              className="tech-ticket group cursor-none clickable hover:border-cyber-cyan/40 hover:shadow-[0_0_30px_rgba(0,255,255,0.05)] transition-all block decoration-none text-inherit relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-cyber-cyan text-[10px] font-black">{">"}</span>
              </div>

              <div className="flex items-start justify-between mb-16">
                <div className="w-12 h-12 lumina-glass flex items-center justify-center text-white/40 group-hover:text-cyber-cyan group-hover:bg-cyber-cyan/5 transition-all font-black border-white/5 group-hover:border-cyber-cyan/20">
                  {p.icon}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-white/20 mb-1">REF_ID</span>
                  <span className="text-[10px] font-mono font-bold text-white/40">00{protocols.indexOf(p) + 1}</span>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-lg mb-2 tracking-tighter group-hover:text-cyber-cyan transition-colors">{p.label}</h3>
                <p className="text-[10px] text-white/30 font-medium leading-relaxed uppercase">{p.desc}</p>
              </div>

              <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <span className="text-[8px] font-black text-white/20 tracking-[0.2em] group-hover:text-cyber-cyan/50 transition-all uppercase">[ READY_TO_SCAN ]</span>
                   <div className="barcode-sim opacity-10 group-hover:opacity-40 transition-opacity" />
                </div>
                <div className="py-3 bg-white/[0.02] border border-white/5 text-center group-hover:bg-cyber-cyan/10 group-hover:border-cyber-cyan/30 transition-all">
                   <span className="text-[9px] font-black tracking-[0.3em] text-white/30 group-hover:text-cyber-cyan uppercase">CLICK_TO_INITIALIZE</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Telemetric Risk Stream */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-16 pt-24 border-t border-white/5">
        <section className="lg:col-span-2 relative">
          <div className="absolute -top-12 left-0 flex items-center gap-4">
             <span className="text-[8px] font-black tracking-[0.4em] text-white/20 uppercase">Telemetric Risk Stream</span>
             <div className="h-[1px] w-32 bg-white/5" />
          </div>
          <div className="tech-ticket border-none bg-white/[0.01]">
            <RiskDashboard logs={logs} />
          </div>
        </section>

        <section className="flex flex-col gap-12">
          <div className="tech-ticket bg-white/[0.01] border-none">
             <ChatPanel logs={logs} />
          </div>
        </section>
      </div>

    </div>
  );
};

export default Dashboard;
