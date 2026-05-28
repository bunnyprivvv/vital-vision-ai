import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target;
      const isClickable = window.getComputedStyle(target).cursor === 'pointer' || 
                         target.classList.contains('clickable') ||
                         target.tagName === 'BUTTON' ||
                         target.tagName === 'A';
      setIsPointer(isClickable);
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div className="fixed top-0 left-0 pointer-events-none z-[10000] hidden md:block">
      {/* Outer Ring */}
      <div 
        className="absolute -translate-x-1/2 -translate-y-1/2 border border-cyber-cyan/30 rounded-full transition-all duration-300"
        style={{ 
          left: position.x, 
          top: position.y,
          width: isPointer ? '48px' : '24px',
          height: isPointer ? '48px' : '24px',
          opacity: 0.5
        }}
      />
      
      {/* Inner Dot */}
      <div 
        className="absolute -translate-x-1/2 -translate-y-1/2 bg-cyber-cyan rounded-full transition-all duration-150"
        style={{ 
          left: position.x, 
          top: position.y,
          width: isPointer ? '4px' : '6px',
          height: isPointer ? '4px' : '6px',
          boxShadow: '0 0 10px var(--cyber-cyan)'
        }}
      />

      {/* Crosshair horizontal */}
      <div 
        className="absolute -translate-x-1/2 -translate-y-1/2 h-[1px] bg-cyber-cyan/10 transition-all duration-300"
        style={{ 
          left: position.x, 
          top: position.y,
          width: isPointer ? '100px' : '40px'
        }}
      />
      
      {/* Crosshair vertical */}
      <div 
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[1px] bg-cyber-cyan/10 transition-all duration-300"
        style={{ 
          left: position.x, 
          top: position.y,
          height: isPointer ? '100px' : '40px'
        }}
      />
    </div>
  );
};

export default CustomCursor;
