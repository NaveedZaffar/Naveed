
import React from 'react';
import { EnergyReading } from '../types';

const PowerQualityHeatmap: React.FC<{ data: EnergyReading }> = ({ data }) => {
  // Mock data for a harmonic spectrum visualization
  const harmonics = Array.from({ length: 15 }, (_, i) => ({
    order: i + 1,
    value: i === 0 ? 100 : (Math.random() * (data.thd / (i + 1))) * 2
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Harmonic Spectrum Analysis</h3>
        <p className="text-xs text-slate-400 mt-1">Fundamental vs Harmonic Content (IEEE 519)</p>
      </div>

      <div className="flex-grow flex items-end justify-between gap-1 min-h-[140px]">
        {harmonics.map((h) => (
          <div key={h.order} className="flex flex-col items-center flex-1 gap-2 group">
            <div className="w-full relative h-32 flex flex-col justify-end">
               <div 
                 className={`w-full rounded-t-sm transition-all duration-500 ${
                   h.order === 1 ? 'bg-blue-500' : h.value > 2 ? 'bg-orange-400' : 'bg-slate-200 group-hover:bg-slate-300'
                 }`}
                 style={{ height: `${h.value}%` }}
               />
               {h.order === 1 && (
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 text-[8px] font-bold text-blue-500">100%</div>
               )}
            </div>
            <span className="text-[8px] font-bold text-slate-400">H{h.order}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <p className="text-[10px] font-bold text-slate-500 uppercase">Fundamental (60Hz)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-orange-400" />
          <p className="text-[10px] font-bold text-slate-500 uppercase">Distortion Factor</p>
        </div>
      </div>
    </div>
  );
};

export default PowerQualityHeatmap;
