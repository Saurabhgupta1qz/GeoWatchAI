import { useState, useEffect } from 'react';
import { 
  ShieldAlert, Globe, Compass, Bell, Settings, FileText, 
  BarChart3, Database, Tv, Users2, Split
} from 'lucide-react';
import { mockAlerts } from '../data/mockData';
import { ArmorIQStatusWidget } from './ArmorIQ';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userEmail?: string;
}

export default function Navbar({ activeTab, setActiveTab, userEmail }: NavbarProps) {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const alertCount = mockAlerts.filter(a => a.status === 'Critical' || a.status === 'High').length;

  return (
    <header id="navbar-header" className="sticky top-0 z-55 w-full bg-slate-900 border-b border-slate-800/85 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between text-white shadow-xl select-none font-mono">
      {/* Brand & System Title */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
        <div className="p-2.2 bg-gradient-to-tr from-teal-550 to-emerald-650 rounded-lg shadow-inner ring-1 ring-white/10 flex items-center justify-center">
          <Globe className="w-4.5 h-4.5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-sans font-black text-sm uppercase tracking-wider text-white">
              GeoWatch
            </span>
            <span className="bg-teal-500/10 text-teal-400 font-mono text-[8px] font-black py-0.2 px-1.5 rounded border border-teal-500/20">
              IND-COMPLIANCE
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono tracking-widest hidden sm:inline-block">
            ENVIRONMENTAL MONITORING NETWORK
          </span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <nav className="hidden lg:flex items-center gap-1">
        <button
          onClick={() => setActiveTab('landing')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-semibold ${
            activeTab === 'landing'
              ? 'bg-slate-800 text-teal-400 border border-slate-700/80 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('situationroom')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-semibold ${
            activeTab === 'situationroom'
              ? 'bg-slate-800 text-teal-400 border border-slate-700/80 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <Tv className="w-3.5 h-3.5 text-teal-400" />
          <span>Situation Room</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-semibold ${
            activeTab === 'dashboard'
              ? 'bg-slate-800 text-teal-400 border border-slate-700/80 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Command Center</span>
        </button>

        <button
          onClick={() => setActiveTab('enforcement')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-semibold ${
            activeTab === 'enforcement'
              ? 'bg-slate-800 text-teal-400 border border-slate-700/80 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <Users2 className="w-3.5 h-3.5 text-teal-400" />
          <span>Directives Ops</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-semibold relative ${
            activeTab === 'alerts'
              ? 'bg-slate-800 text-teal-400 border border-slate-700/80 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Incident Deck</span>
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-0.5 bg-red-650 text-white font-mono text-[8px] font-bold h-3.5 min-w-[14px] px-1 rounded-full flex items-center justify-center border border-slate-900 animate-pulse">
              {alertCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-semibold ${
            activeTab === 'reports'
              ? 'bg-slate-800 text-teal-400 border border-slate-700/80 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Compliance Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-semibold ${
            activeTab === 'comparison'
              ? 'bg-slate-800 text-teal-300 border border-slate-700/85 shadow-md ring-1 ring-teal-500/10'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <Split className="w-3.5 h-3.5 text-teal-405 text-teal-400" />
          <span>Change Analysis</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-semibold ${
            activeTab === 'analytics'
              ? 'bg-slate-800 text-teal-400 border border-slate-700/80 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-semibold ${
            activeTab === 'settings'
              ? 'bg-slate-800 text-teal-400 border border-slate-700/80 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Rules Setup</span>
        </button>
      </nav>

      {/* Right Column: UTC Timestamp, Mobile Navigation, User profile */}
      <div className="flex items-center gap-3">
        {/* ArmorIQ Status Widget */}
        <div className="hidden md:flex">
          <ArmorIQStatusWidget />
        </div>

        {/* UTC Live clock */}
        <div className="hidden md:flex flex-col items-end text-[10px] select-none border-l border-slate-800 pl-3">
          <span className="text-teal-400 font-extrabold tracking-wider">{utcTime}</span>
          <span className="text-slate-500 text-[8px] uppercase tracking-widest font-bold">SYSTEM CADENCE OK</span>
        </div>

        {/* User identification */}
        {userEmail && (
          <div className="hidden xl:flex items-center gap-2 bg-slate-850/60 hover:bg-slate-850 px-2.5 py-1.2 rounded-lg border border-slate-850 transition-colors">
            <div className="w-4.5 h-4.5 bg-teal-500 rounded-full flex items-center justify-center font-black text-[9px] text-white">
              {userEmail[0].toUpperCase()}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-slate-300 font-bold truncate max-w-[100px]">
                {userEmail}
              </span>
              <span className="text-[7px] text-teal-400 uppercase tracking-wider font-extrabold font-black">
                COMPLIANCE OFFICER
              </span>
            </div>
          </div>
        )}

        {/* Mobile Navigation Dropdown Select */}
        <div className="lg:hidden flex items-center">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="bg-slate-800 border border-slate-700/80 text-teal-400 text-[11px] font-bold py-1.5 px-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm"
          >
            <option value="landing">Overview</option>
            <option value="situationroom">Situation Room</option>
            <option value="dashboard">Command Center</option>
            <option value="enforcement">Directives Ops</option>
            <option value="alerts">Incident Deck ({alertCount})</option>
            <option value="reports">Compliance Reports</option>
            <option value="comparison">Change Analysis</option>
            <option value="analytics">Analytics</option>
            <option value="settings">Rules Setup</option>
          </select>
        </div>
      </div>
    </header>
  );
}
