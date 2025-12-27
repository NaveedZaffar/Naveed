
import React from 'react';
import { EnergyReading } from '../types';

interface GaugeProps {
  label: string;
  value: string | number;
  unit: string;
  color: string;
  progress: number; // 0 to 100
}

const Gauge: React.FC<GaugeProps> = ({ label, value, unit, color, progress }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center relative transition-all hover:shadow-lg hover:-translate-y-1 group">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-slate-50"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${color} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{unit}</span>
        </div>
      </div>
      <p className="mt-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
};

const RealTimeGauges: React.FC<{ data: EnergyReading }> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Gauge
        label="Power Factor"
        value={data.powerFactor.toFixed(2)}
        unit="Cos φ"
        color="text-blue-500"
        progress={data.powerFactor * 100}
      />
      <Gauge
        label="Harmonics"
        value={data.thd.toFixed(1)}
        unit="% THD"
        color={data.thd > 5 ? "text-amber-500" : "text-emerald-500"}
        progress={Math.min(100, data.thd * 10)}
      />
      <Gauge
        label="Phasor Balance"
        value={(Math.abs(data.voltage[0] - data.voltage[1])).toFixed(1)}
        unit="Δ Volts"
        color="text-indigo-500"
        progress={Math.max(10, 100 - Math.abs(data.voltage[0] - data.voltage[1]) * 15)}
      />
      <Gauge
        label="Current Load"
        value={data.activePower.toFixed(0)}
        unit="kW"
        color="text-purple-600"
        progress={(data.activePower / 150) * 100}
      />
    </div>
  );
};

export default RealTimeGauges;
