
import React from 'react';
import Layout, { TabType } from './components/Layout';
import RealTimeGauges from './components/RealTimeGauges';
import RealTimeChart from './components/RealTimeChart';
import AuditCalculator from './components/AuditCalculator';
import InsightList from './components/InsightList';
import MarketInsight from './components/MarketInsight';
import AuditVisualizer from './components/AuditVisualizer';
import PowerQualityHeatmap from './components/PowerQualityHeatmap';
import { EnergyReading, OptimizationInsight, SearchResult } from './types';
import { generateReading } from './services/simulationService';
import { getAIInsights, getGlobalMarketInsights } from './services/geminiService';
import { MOCK_CHART_HISTORY_LENGTH } from './constants';
import { Activity, BarChart3, Search, History, Database, FileText, Settings, ShieldCheck, Construction, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabType>('Dashboard');
  const [currentReading, setCurrentReading] = React.useState<EnergyReading>(generateReading());
  const [history, setHistory] = React.useState<EnergyReading[]>([]);
  const [historicalComparison, setHistoricalComparison] = React.useState<EnergyReading[] | undefined>(undefined);
  const [insights, setInsights] = React.useState<OptimizationInsight[]>([]);
  const [marketInsights, setMarketInsights] = React.useState<SearchResult | null>(null);
  const [loadingInsights, setLoadingInsights] = React.useState(false);
  const [loadingMarket, setLoadingMarket] = React.useState(false);
  const [showComparison, setShowComparison] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReading(prev => {
        const next = generateReading(prev);
        setHistory(h => {
          const newHistory = [...h, next];
          if (newHistory.length > MOCK_CHART_HISTORY_LENGTH) return newHistory.slice(1);
          return newHistory;
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (showComparison) {
      const simulated = history.map(h => ({
        ...h,
        activePower: h.activePower * (0.85 + Math.random() * 0.3)
      }));
      setHistoricalComparison(simulated);
    } else {
      setHistoricalComparison(undefined);
    }
  }, [showComparison, history]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoadingInsights(true);
      setLoadingMarket(true);
      try {
        const [newInsights, newMarket] = await Promise.all([
          getAIInsights(currentReading),
          getGlobalMarketInsights()
        ]);
        setInsights(newInsights);
        setMarketInsights(newMarket);
      } catch (err) {
        console.error("Dashboard Refresh Error:", err);
      } finally {
        setLoadingInsights(false);
        setLoadingMarket(false);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 120000); 
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="space-y-8 pb-16 animate-in fade-in duration-700">
            {/* 1. Header & Actions */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-6">
              <div>
                <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                  <span>Industrial</span>
                  <span>/</span>
                  <span>Facility 409</span>
                  <span>/</span>
                  <span className="text-blue-500">Live Telemetry</span>
                </nav>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Facility Intelligence</h2>
                <div className="flex items-center gap-4 mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black border border-blue-100 uppercase tracking-widest">
                    <Search className="w-3 h-3" /> Node: FAC-409-A1
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black border border-emerald-100 uppercase tracking-widest">
                    <Activity className="w-3 h-3" /> Link: Stable
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowComparison(!showComparison)}
                  className={`flex items-center gap-2 px-6 py-3 text-xs font-bold border rounded-2xl transition-all active:scale-95 shadow-sm ${
                    showComparison 
                      ? "bg-blue-600 border-blue-600 text-white shadow-blue-100" 
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <History className="w-4 h-4" /> Compare History
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                  <BarChart3 className="w-4 h-4" /> Full Audit Export
                </button>
              </div>
            </div>

            {/* 2. Critical Metrics Row */}
            <RealTimeGauges data={currentReading} />

            {/* 3. Main Operational View */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Load Profile (8 cols) */}
              <div className="xl:col-span-8 flex flex-col gap-8">
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden min-h-[480px]">
                  <RealTimeChart history={history} comparisonHistory={historicalComparison} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <AuditCalculator />
                  <AuditVisualizer />
                </div>
              </div>

              {/* Intelligence Sidecar (4 cols) */}
              <div className="xl:col-span-4 flex flex-col gap-8">
                <div className="flex-1 min-h-[400px]">
                  <InsightList insights={insights} loading={loadingInsights} />
                </div>
                <div className="flex-1 min-h-[400px]">
                  <MarketInsight data={marketInsights} loading={loadingMarket} />
                </div>
              </div>
            </div>

            {/* 4. Power Quality & Compliance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
                 <div className="flex items-center justify-between mb-8">
                   <div>
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Phase Balance</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Vector Integrity</p>
                   </div>
                   <ShieldCheck className="w-6 h-6 text-emerald-500" />
                 </div>
                 <div className="space-y-6">
                   {['L1-L2', 'L2-L3', 'L3-L1'].map((pair) => (
                     <div key={pair}>
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-slate-600">{pair} Deviation</span>
                         <span className="text-xs font-mono font-bold text-emerald-600">0.4%</span>
                       </div>
                       <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                         <div 
                           className="h-full bg-blue-500/80 rounded-full transition-all duration-1000 shadow-sm" 
                           style={{ width: `${96 + Math.random() * 3}%` }} 
                         />
                       </div>
                     </div>
                   ))}
                 </div>
                 <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Compliance</span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase">IEEE 519 Pass</span>
                 </div>
               </div>

               <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                 <PowerQualityHeatmap data={currentReading} />
               </div>
            </div>

            {/* 5. Detailed Telemetry Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Telemetry</h3>
                  <p className="text-sm text-slate-500 font-medium">IEEE & ASHRAE Verified High-Precision Data</p>
                </div>
                <div className="flex items-center gap-8 text-right">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grid Avg</p>
                    <p className="text-2xl font-mono font-bold text-slate-900">
                      {(currentReading.voltage.reduce((a,b)=>a+b,0)/3).toFixed(1)}V
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Carbon Load</p>
                    <p className="text-2xl font-mono font-bold text-emerald-600">
                      {(currentReading.activePower * 0.42).toFixed(2)}<span className="text-xs ml-1">kg/h</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="p-8">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> Voltage Phasors (L-N)
                  </h4>
                  <div className="space-y-4">
                    {['L1', 'L2', 'L3'].map((phase, i) => (
                      <div key={phase} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-md transition-all group">
                        <span className="text-sm font-bold text-slate-700">Phase Vector {phase}</span>
                        <div className="flex items-center gap-3">
                           <span className="text-xl font-mono font-black text-slate-900 group-hover:text-blue-600">{currentReading.voltage[i].toFixed(2)}</span>
                           <span className="text-[10px] font-bold text-slate-400">VOLTS</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Load Distribution (RMS)
                  </h4>
                  <div className="space-y-4">
                    {['I1', 'I2', 'I3'].map((phase, i) => (
                      <div key={phase} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-md transition-all group">
                        <span className="text-sm font-bold text-slate-700">Amperage {phase}</span>
                        <div className="flex items-center gap-3">
                           <span className="text-xl font-mono font-black text-slate-900 group-hover:text-emerald-600">{currentReading.current[i].toFixed(2)}</span>
                           <span className="text-[10px] font-bold text-slate-400">AMPS</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Assets':
        return (
          <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center mx-auto max-w-4xl animate-in zoom-in-95 duration-500">
            <div className="p-12 bg-blue-50 rounded-full mb-10 shadow-inner">
              <Database className="w-20 h-20 text-blue-500" />
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">Digital Twin Console</h2>
            <p className="text-slate-500 max-w-xl mt-6 text-xl font-medium leading-relaxed">
              Unified sub-metering orchestration and edge-gateway synchronization for distributed energy resources.
            </p>
            <div className="mt-12 flex gap-6">
              <div className="flex items-center gap-3 px-8 py-4 bg-blue-100 text-blue-700 rounded-2xl text-xs font-black uppercase tracking-widest border border-blue-200">
                <Construction className="w-5 h-5" /> Module Staging
              </div>
              <div className="flex items-center gap-3 px-8 py-4 bg-emerald-100 text-emerald-700 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-200">
                <ShieldCheck className="w-5 h-5" /> NIST Verified
              </div>
            </div>
          </div>
        );
      case 'Reports':
        return (
          <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center mx-auto max-w-4xl animate-in slide-in-from-bottom-8 duration-500">
            <div className="p-12 bg-emerald-50 rounded-full mb-10 shadow-inner">
              <FileText className="w-20 h-20 text-emerald-500" />
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">Audit Engine</h2>
            <p className="text-slate-500 max-w-xl mt-6 text-xl font-medium leading-relaxed">
              Standardized ASHRAE Level 1, 2, and 3 investment-grade report generation. Secure export of compliance-ready datasets.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-24">
               <button className="p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-slate-100 transition-all font-black text-[10px] uppercase tracking-widest text-slate-600 shadow-sm">
                  Weekly Snapshot
               </button>
               <button className="p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-slate-100 transition-all font-black text-[10px] uppercase tracking-widest text-slate-600 shadow-sm">
                  Facility Baseline
               </button>
               <button className="p-6 bg-slate-900 border border-slate-900 rounded-3xl hover:bg-slate-800 transition-all font-black text-[10px] uppercase tracking-widest text-white shadow-2xl hover:scale-105">
                  Full IGA Report
               </button>
            </div>
          </div>
        );
      case 'Setup':
        return (
          <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center mx-auto max-w-4xl animate-in fade-in duration-500">
            <div className="p-12 bg-slate-100 rounded-full mb-10 shadow-inner">
              <Settings className="w-20 h-20 text-slate-600" />
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">Core Parameters</h2>
            <p className="text-slate-500 max-w-xl mt-6 text-xl font-medium leading-relaxed">
              Facility baseline calibration, tariff modeling, and intelligent alert thresholding for operational continuity.
            </p>
            <div className="grid grid-cols-2 gap-8 mt-12 w-full max-w-2xl px-12">
              <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-200 text-left hover:bg-white hover:shadow-2xl transition-all">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm mb-6 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Billing Cycle</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">1st of Month</p>
              </div>
              <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-200 text-left hover:bg-white hover:shadow-2xl transition-all">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm mb-6 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Grid Sync</p>
                <p className="text-3xl font-bold text-emerald-600 tracking-tight">12.4 kV Active</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
