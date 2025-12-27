
import React from 'react';
import { Globe, ExternalLink, Loader2, BookOpen, Quote } from 'lucide-react';
import { SearchResult } from '../types';

interface MarketInsightProps {
  data: SearchResult | null;
  loading: boolean;
}

const MarketInsight: React.FC<MarketInsightProps> = ({ data, loading }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col">
      <div className="bg-slate-900 p-6 text-white flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Global Context
          </h2>
          <p className="text-slate-400 text-[10px] mt-1 uppercase font-semibold tracking-widest">Grounding Intelligence</p>
        </div>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
      </div>
      
      <div className="p-6 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full py-12 space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-100 rounded-full animate-spin border-t-blue-500"></div>
              <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse">Scanning Global Markets</p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="relative p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Quote className="absolute -left-2 -top-2 w-8 h-8 text-slate-200 -z-0" />
              <p className="text-sm text-slate-700 leading-relaxed relative z-10 italic">
                {data.text}
              </p>
            </div>
            
            {data.sources && data.sources.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Citations</p>
                </div>
                <div className="space-y-2">
                  {data.sources.map((source: any, idx: number) => (
                    <a 
                      key={idx} 
                      href={source.web?.uri || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex flex-col p-3 bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md rounded-xl transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[11px] font-bold text-slate-800 truncate pr-4 group-hover:text-blue-600 transition-colors">
                          {source.web?.title || 'External Reference'}
                        </p>
                        <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-500 shrink-0" />
                      </div>
                      <p className="text-[9px] text-slate-400 truncate font-mono bg-slate-50 px-1.5 py-0.5 rounded">
                        {source.web?.uri}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400 opacity-50">
            <Globe className="w-12 h-12 mb-3 stroke-1" />
            <p className="text-xs font-medium uppercase tracking-widest">No market data found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketInsight;
