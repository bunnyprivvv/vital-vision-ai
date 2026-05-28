import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { id: 'dashboard', label: 'SYSTEM_DASH', path: '/dashboard', icon: '⌂' },
    { id: 'diagnostics', label: 'DYNAMICS', path: '/hemascan', icon: '#' },
    { id: 'security', label: 'PRIVACY_SEC', path: '/profile', icon: 'L' },
    { id: 'maintenance', label: 'CORE_SET', path: '/settings', icon: 'S' },
  ];

  return (
    <aside className="sidebar-container hidden md:flex h-screen w-[260px] p-8 flex-col justify-between flex-shrink-0 relative no-scrollbar" style={{ backgroundColor: '#000', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
      
      {/* 1. Brand & Status */}
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-24">
          <div className="relative">
            <span className="text-cyber-cyan font-bold">+</span>
            <div className="absolute -top-1 -right-1 status-dot" />
          </div>
          <span className="text-xs font-black tracking-[0.2em] font-mono">VITASCAN_OS</span>
        </div>

        <nav className="flex flex-col gap-10 w-full">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink 
                key={item.id}
                to={item.path}
                className="flex items-center gap-5 group transition-all duration-300 cursor-none clickable decoration-none"
              >
                <div className={`w-8 h-8 rounded-sm border ${isActive ? 'border-cyber-cyan bg-cyber-cyan/10' : 'border-white/5 bg-white/[0.02]'} flex items-center justify-center transition-all group-hover:border-white/20`}>
                   <span className={`text-[12px] font-bold font-mono ${isActive ? 'text-cyber-cyan' : 'text-white/20'}`}>
                     {item.icon}
                   </span>
                </div>
                <div className="flex flex-col">
                  <span className={`text-[10px] font-black tracking-[0.2em] uppercase transition-all ${isActive ? 'text-white' : 'text-white/20 group-hover:text-white/60'}`}>
                    {item.label}
                  </span>
                  {isActive && <span className="text-[6px] font-black text-cyber-cyan tracking-[0.3em] mt-1 animate-pulse">ACTIVE_NODE</span>}
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* 2. Bottom Manifest */}
      <div className="flex items-center gap-4 mb-8">
         <div className="h-10 w-[1px] bg-cyber-cyan/30" />
         <div className="flex flex-col gap-1">
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.4em]">Active Manifest</span>
            <div className="flex items-center gap-2">
              <span className="text-sunset-orange font-bold">{">"}</span>
              <span className="text-[9px] font-black text-white/40 uppercase">77_PROT_NOMINAL</span>
            </div>
         </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[1px] h-full bg-white/5" />
    </aside>
  );
};

export default Sidebar;
