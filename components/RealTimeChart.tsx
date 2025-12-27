
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EnergyReading } from '../types';

interface RealTimeChartProps {
  history: EnergyReading[];
  comparisonHistory?: EnergyReading[];
}

const RealTimeChart: React.FC<RealTimeChartProps> = ({ history, comparisonHistory }) => {
  const chartData = history.map((h, index) => ({
    time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    current: h.activePower,
    historical: comparisonHistory?.[index]?.activePower || null,
  }));

  return (
    <div className="bg-white p-10 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h2 className="font-black text-slate-900 text-2xl tracking-tight">Load Profile Trend <span className="text-slate-300 font-medium ml-1">/ kW</span></h2>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">
            {comparisonHistory ? "Current vs Last Period Comparison" : "Real-Time Operational Load"}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full shadow-sm animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Feed</span>
          </div>
          {comparisonHistory && (
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-slate-300 rounded-full border border-slate-400"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Historical</span>
             </div>
          )}
        </div>
      </div>
      <div className="flex-grow min-h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.05}/>
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="time" hide />
            <YAxis 
              domain={['auto', 'auto']} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700, fontFamily: 'JetBrains Mono' }} 
            />
            <Tooltip 
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              contentStyle={{ 
                borderRadius: '16px', 
                border: '1px solid #f1f5f9', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
                padding: '12px',
                fontSize: '12px',
                fontWeight: 700
              }}
            />
            <Legend 
              verticalAlign="top" 
              align="right"
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
            />
            {comparisonHistory && (
              <Area 
                name="Historical Trend"
                type="monotone" 
                dataKey="historical" 
                stroke="#94a3b8" 
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1} 
                fill="url(#colorHist)" 
                animationDuration={0}
              />
            )}
            <Area 
              name="Active Load (kW)"
              type="monotone" 
              dataKey="current" 
              stroke="#3b82f6" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorPower)" 
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealTimeChart;
