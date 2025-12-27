
import React from 'react';
import { DollarSign, TrendingUp, Calendar, Zap } from 'lucide-react';
import { calculateROI } from '../services/simulationService';

const AuditCalculator: React.FC = () => {
  const [cost, setCost] = React.useState(120000);
  const [savings, setSavings] = React.useState(35000);
  const [rate, setRate] = React.useState(8);
  const [years, setYears] = React.useState(5);

  const metrics = calculateROI(cost, savings, rate, years);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full">
      <div className="bg-slate-900 p-6 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          Investment-Grade Audit Tool
        </h2>
        <p className="text-slate-400 text-xs mt-1 uppercase font-semibold">Simulate ECM Profitability</p>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Initial Investment ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Annual Savings ($)</label>
              <div className="relative">
                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  value={savings}
                  onChange={(e) => setSavings(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Discount Rate (%)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Project Life (Years)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900 p-4 rounded-xl text-white text-center">
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Net Present Value</p>
            <p className="text-lg font-mono font-bold">${metrics.npv.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="bg-blue-600 p-4 rounded-xl text-white text-center">
            <p className="text-[10px] text-blue-200 uppercase font-bold mb-1">Return on Inv.</p>
            <p className="text-lg font-mono font-bold">{metrics.roi.toFixed(1)}%</p>
          </div>
          <div className="bg-emerald-600 p-4 rounded-xl text-white text-center">
            <p className="text-[10px] text-emerald-100 uppercase font-bold mb-1">Simple Payback</p>
            <p className="text-lg font-mono font-bold">{metrics.payback.toFixed(1)} yrs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditCalculator;
