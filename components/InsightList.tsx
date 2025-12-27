
import React from 'react';
import { Sparkles, AlertCircle, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { OptimizationInsight } from '../types';

const InsightList: React.FC<{ insights: OptimizationInsight[], loading: boolean }> = ({ insights, loading }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col">
      <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-300" />
            AI Efficiency Advisor
          </h2>
          <p className="text-indigo-200 text-xs mt-1 uppercase font-semibold">Gemini Intelligence Integration</p>
        </div>
        {loading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>}
      </div>

      <div className="p-4 space-y-4 flex-grow overflow-y-auto">
        {insights.map((insight) => (
          <div 
            key={insight.id}
            className={`p-4 rounded-xl border-l-4 flex gap-4 ${
              insight.type === 'warning' ? 'bg-orange-50 border-orange-400' :
              insight.type === 'success' ? 'bg-emerald-50 border-emerald-400' :
              'bg-blue-50 border-blue-400'
            }`}
          >
            <div className="mt-1">
              {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-orange-600" />}
              {insight.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {insight.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
            </div>
            <div className="flex-grow">
              <h3 className={`font-bold text-sm ${
                insight.type === 'warning' ? 'text-orange-900' :
                insight.type === 'success' ? 'text-emerald-900' :
                'text-blue-900'
              }`}>
                {insight.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{insight.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Potential Savings</span>
                <span className="text-xs font-bold text-slate-800 bg-white px-2 py-1 rounded-lg border border-slate-200">{insight.potentialSavings}</span>
              </div>
            </div>
          </div>
        ))}
        
        <button className="w-full py-3 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
          GENERATE FULL AUDIT REPORT <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default InsightList;
