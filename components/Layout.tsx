
import React from 'react';
import { Activity, ShieldCheck, FileBarChart, Settings, Clock } from 'lucide-react';

export type TabType = 'Dashboard' | 'Assets' | 'Reports' | 'Setup';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [time, setTime] = React.useState(new Date().toLocaleTimeString());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems: { label: TabType; id: TabType }[] = [
    { label: 'Dashboard', id: 'Dashboard' },
    { label: 'Assets', id: 'Assets' },
    { label: 'Reports', id: 'Reports' },
    { label: 'Setup', id: 'Setup' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setActiveTab('Dashboard')}
          >
            <div className="bg-blue-500 p-2 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">EnergyAudit <span className="text-blue-400">Pro</span></h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Real-Time Intelligence v3.5</p>
            </div>
          </div>

          <div className="hidden md:flex items-center h-full">
            <nav className="flex items-center gap-8 h-full">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-sm font-medium transition-all h-full flex items-center border-b-2 px-1 ${
                    activeTab === item.id
                      ? 'text-blue-400 border-blue-400'
                      : 'text-slate-400 border-transparent hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-green-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold uppercase">System Live</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                <Clock className="w-3 h-3" />
                {time}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-[1600px] mx-auto w-full p-6">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 px-6">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Compliant with IEEE 519-2022</span>
            <span className="flex items-center gap-1"><FileBarChart className="w-3 h-3" /> ASHRAE Level 3 Ready</span>
          </div>
          <p className="text-xs text-slate-400 font-medium italic underline decoration-slate-200">
            "Energy is the backbone of production; monitoring is the nervous system."
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
