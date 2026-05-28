import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TrendChart = ({ logs = [] }) => {
  const chartData = [...logs].reverse().map((log, index) => {
    return {
      name: `PROT_${logs.length - index}`,
      score: log.data?.score || 0
    };
  });

  if (chartData.length < 5) {
    const baseline = [
      { name: 'INIT_B', score: 65 },
      { name: 'S_CALI', score: 72 },
      { name: 'D_CALI', score: 60 },
      { name: 'M_CALI', score: 68 },
    ];
    chartData.unshift(...baseline);
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="lumina-glass p-4 border border-cyber-cyan/20">
          <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">
            {payload[0].payload.name}
          </p>
          <p className="text-xl font-black text-cyber-cyan tracking-tighter">
            {payload[0].value.toFixed(1)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[200px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--cyber-cyan)" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="var(--cyber-cyan)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.05)" 
            tick={{fontSize: 8, fill: 'rgba(255,255,255,0.2)', fontWeight: 900}} 
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.05)" 
            tick={{fontSize: 8, fill: 'rgba(255,255,255,0.2)', fontWeight: 900}} 
            domain={[0, 100]} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{stroke: 'var(--cyber-cyan)', strokeWidth: 1, strokeDasharray: '4 4'}} />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="var(--cyber-cyan)" 
            fillOpacity={1} 
            fill="url(#colorScore)" 
            strokeWidth={2}
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
