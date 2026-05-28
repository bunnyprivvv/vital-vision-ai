import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TelemetryBar from './TelemetryBar';
import CustomCursor from './CustomCursor';

const MainLayout = ({ logs, botStatus }) => {
  const location = useLocation();
  
  // Minimalist Breadcrumb Generator
  const getBreadcrumb = () => {
    const path = location.pathname.split('/').filter(x => x);
    if (path.length === 0) return 'DASHBOARD';
    return path.map(p => p.toUpperCase()).join(' // ');
  };

  return (
    <div className="layout-shell relative overflow-hidden flex h-screen w-screen bg-black">
      
      {/* 1. Universal Aesthetic Layer */}
      <div className="noise-overlay" />
      <CustomCursor />

      {/* 2. Primary Navigation Manifest */}
      <Sidebar logs={logs} />

      {/* 3. Operational Viewport */}
      <main className="flex-grow flex flex-col relative overflow-hidden">
        {/* Top Operational bar (Consolidated Metadata & Breadcrumbs) */}
        <div className="absolute top-8 left-12 md:left-24 flex items-center gap-12 opacity-40 pointer-events-none z-[1002]">
           <div className="flex flex-col">
              <span className="text-[7px] font-black uppercase tracking-[0.6em] text-cyber-cyan mb-1">TRACE_MANIFEST</span>
              <span className="text-[10px] font-black tracking-[0.2em] font-mono">ROOT // {getBreadcrumb()}</span>
           </div>
        </div>

        <div className="absolute top-8 right-12 flex items-center gap-12 opacity-20 pointer-events-none z-[1002]">
           <div className="flex flex-col items-end">
              <span className="text-[7px] font-black uppercase tracking-[0.4em]">Node_Alpha // 77_B</span>
              <span className="text-[10px] font-mono">CALIBRATION_STABLE</span>
           </div>
           <div className="h-8 w-[1px] bg-white/20" />
           <div className="barcode-sim w-24" />
        </div>

        {/* Dynamic Manifest Outlet - Full height scrolling */}
        <div className="flex-grow overflow-y-auto no-scrollbar pt-32 pb-48 px-4 md:px-24">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </div>

        {/* 4. Bottom Autopilot Bar */}
        <TelemetryBar botStatus={botStatus} logs={logs} />
      </main>

      {/* Mobile Interaction Layer (Simulated) */}
      <div className="md:hidden fixed bottom-12 left-0 w-full h-1 bg-cyber-cyan/20" />
    </div>
  );
};

export default MainLayout;
