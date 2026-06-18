import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, Globe, Radio, Activity, Flame, 
  Layers, Users, ShieldCheck, TrendingUp, Cpu, 
  Terminal, RefreshCw, MapPin, AlertTriangle, ArrowRight, Shield 
} from 'lucide-react';
import { Case, MonitoringZone } from '../types';

interface SituationRoomProps {
  cases: Case[];
  zones: MonitoringZone[];
  onSelectCase: (caseId: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function SituationRoom({ cases, zones, onSelectCase, onNavigateToTab }: SituationRoomProps) {
  const [lossHectares, setLossHectares] = useState(148204.62);
  const [activeRadarSweep, setActiveRadarSweep] = useState(true);
  const [selectedSubRegion, setSelectedSubRegion] = useState('National Ecological Posture');

  // Realistic ecological tick for environmental forest canopy loss counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLossHectares(prev => prev + 0.04 + Math.random() * 0.08);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Compute stats
  const totalActive = cases.filter(c => c.status !== 'Resolved').length;
  // Count case statuses aligned with Indian environmental workflow
  const criticalThreats = cases.filter(c => c.priority === 'CRITICAL' && c.status !== 'Resolved').length;
  const resolvedCount = cases.filter(c => c.status === 'Resolved').length + 84; 
  // Map "Inspection Crews Deployed" combining State Forest Departments & Pollution Control field teams
  const deployedTeams = cases.filter(c => c.status === 'Assigned' || c.status === 'Inspection Scheduled' || c.status === 'Under Investigation').length + 12;

  // Indian Environmental locations for summary lists
  const hotRegions = [
    { name: 'Hasdeo Forest Region', state: 'Chhattisgarh', risk: 92, threat: 'CRITICAL', trend: 'UP' },
    { name: 'Aravalli Hills', state: 'Haryana/Rajasthan', risk: 86, threat: 'HIGH', trend: 'UP' },
    { name: 'Sonbhadra Mining Belt', state: 'Uttar Pradesh', risk: 78, threat: 'HIGH', trend: 'STABLE' },
    { name: 'Dehradun Forest Region', state: 'Uttarakhand', risk: 61, threat: 'MEDIUM', trend: 'STABLE' },
    { name: 'Sariska Buffer Zone', state: 'Rajasthan', risk: 34, threat: 'LOW', trend: 'DOWN' }
  ];

  return (
    <div id="executive-situation-room" className="w-full bg-slate-950 text-slate-100 min-h-screen pb-16 font-mono selection:bg-teal-500 selection:text-black">
      {/* 1. COMPLIANCE SUB-HEADER STATUS LINE */}
      <div className="w-full bg-slate-900 border-b border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between text-[10px] text-slate-400 select-none gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-teal-400 font-bold">
            <span className="inline-block w-1.5 h-1.5 bg-teal-405 rounded-full animate-ping bg-teal-400" />
            INDIAN ENVIRONMENTAL INTELLIGENCE RADAR FEED [FSI / ORTHO-SAR]
          </span>
          <span className="border-l border-slate-700 pl-4">COMPLIANCE PROTOCOL V3.4</span>
          <span className="hidden md:inline border-l border-slate-700 pl-4 text-emerald-400">MoEFCC GOVERNANCE COMPLIANT</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveRadarSweep(!activeRadarSweep)} 
            className="flex items-center gap-1.5 hover:text-teal-300 transition-colors bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700 active:bg-slate-800 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${activeRadarSweep ? 'animate-spin' : ''}`} />
            <span>RADAR SWEEP: {activeRadarSweep ? 'ONLINE' : 'PAUSED'}</span>
          </button>
          <span className="bg-slate-800 px-2 py-0.5 rounded text-[9px] text-slate-300 font-bold">STATE: COMPLIANCE MONITOR</span>
        </div>
      </div>

      {/* 2. EXECUTIVE HERO METRICS BAR */}
      <section className="bg-slate-900/60 border-b border-slate-800 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          
          {/* Active Violations (Detected/Assigned Cases) */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-inner relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-full flex items-center justify-center pointer-events-none" />
            <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Active Violations</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-red-500 tracking-tight">{totalActive}</span>
              <span className="text-[10px] text-red-400 font-bold">ACTIVE CASES</span>
            </div>
            <div className="text-[9px] mt-2 text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span>{criticalThreats} Critical Red Flags Pending</span>
            </div>
          </div>

          {/* Environmental Canopy Loss Counter */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl lg:col-span-2 shadow-inner relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 text-emerald-500/10 pointer-events-none">
              <Flame className="w-10 h-10 animate-pulse text-emerald-500" />
            </div>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">National Bio-Canopy Loss Counter</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-widest tabular-nums font-mono">
                {lossHectares.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">HA FOREST TARGET</span>
            </div>
            <div className="text-[9px] mt-2 text-rose-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Estimated canopy loss trend index (+0.06 Ha/Sec)</span>
            </div>
          </div>

          {/* Officers / Rangers Deployed */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-inner relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 text-teal-400/10">
              <Users className="w-6 h-6 text-teal-400" />
            </div>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Operational Deployed Status</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-teal-400 tracking-tight">{deployedTeams}</span>
              <span className="text-[10px] text-teal-300 font-bold">OFFICERS IN-FIELD</span>
            </div>
            <div className="text-[9px] mt-2 text-slate-400">
              Dispatch units actively validating
            </div>
          </div>

          {/* Resolved Violations */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-inner relative overflow-hidden group">
            <div className="absolute top-0 right-1 p-3 text-cyan-400/10">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
            </div>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Compliance Restored</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-teal-500 tracking-tight">{resolvedCount}</span>
              <span className="text-[10px] text-teal-400 font-bold">CASES SECURED</span>
            </div>
            <div className="text-[9px] mt-2 text-emerald-400 flex items-center gap-1">
              <span>96.2% Restoration & Penalty Settlement</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DUAL WORKSPACE LAYOUT (SITUATION MATRIX) */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL LEFT: HIGH-DENSITY RADAR SCANNER POSTURE (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 select-none">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-400 animate-pulse" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-100">National Environmental Situation Room</h2>
              </div>
              <span className="bg-teal-500/15 text-teal-400 text-[8px] font-mono font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                Active Compliance Sweeper
              </span>
            </div>

            {/* Simulated Radar Screen Graphic Grid */}
            <div className="relative w-full aspect-[16/10] bg-slate-950 border border-emerald-500/20 rounded-lg overflow-hidden flex items-center justify-center select-none group">
              {/* Radar circular coordinate sweep line */}
              {activeRadarSweep && (
                <div className="absolute inset-x-0 w-full h-1 bg-gradient-to-b from-teal-500/40 to-transparent top-0 animate-bounce cursor-default pointer-events-none" />
              )}
              
              {/* Overlay telemetry crosshairs */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#115e5910_1px,transparent_1px),linear-gradient(to_bottom,#115e5910_1px,transparent_1px)] bg-[size:2rem_2rem]" />
              <div className="absolute w-[200px] h-[200px] border border-teal-500/10 rounded-full animate-pulse" />
              <div className="absolute w-[400px] h-[400px] border border-teal-500/5 rounded-full" />
              
              <div className="absolute left-6 top-6 text-[8px] font-mono text-slate-500 space-y-0.5">
                <p>ORBIT: FSI-INSAT-3D</p>
                <p>REFRESH: HOURLY DELTA</p>
                <p>COORDINATE RANGE: INDIA SUB-CONTINENT</p>
                <p>COMPLIANCE MODE: ACTIVE ENVIRONMENT THREAT DETECTION</p>
              </div>

              <div className="absolute right-6 bottom-6 text-[8px] font-mono text-teal-500/40 text-right">
                <p>SATELLITE COMPILER INTERFACE</p>
                <p>MINISTRY OF ENVIRONMENT, FOREST & CLIMATE CHANGE</p>
              </div>

              {/* Blinking critical case coordinates nodes */}
              {cases.map((cs, cidx) => (
                <div 
                  key={cidx}
                  onClick={() => {
                    setSelectedSubRegion(cs.locationName);
                    onSelectCase(cs.caseId);
                  }}
                  className="absolute cursor-pointer group flex flex-col items-center"
                  style={{
                    // Relative plotting coordinates localized for reasonable spread on Indian subcontinent view representation
                    left: `${20 + ((cs.lng - 60) * 2.8) % 65}%`,
                    top: `${80 - ((cs.lat - 10) * 2.5) % 65}%`
                  }}
                >
                  {/* Glowing ring */}
                  <span className={`absolute inline-flex h-4 w-4 rounded-full opacity-75 ${cs.priority === 'CRITICAL' ? 'animate-ping bg-red-400' : 'animate-ping bg-amber-400'}`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${cs.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  
                  {/* Tactical tooltips */}
                  <div className="absolute top-[16px] backdrop-blur-md bg-slate-900/90 border border-slate-700 p-2 rounded text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-2xl pointer-events-none">
                    <p className="font-bold text-slate-100">{cs.caseId}: {cs.locationName}</p>
                    <p className="text-slate-400 font-mono text-[7px]">LAT-LNG: {cs.lat.toFixed(4)}, {cs.lng.toFixed(4)}</p>
                    <p className={`font-bold uppercase ${cs.priority === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}`}>RISK Level: {cs.riskScore}%</p>
                  </div>
                </div>
              ))}

              <div className="text-center p-6 bg-slate-950/80 border border-slate-800 rounded-lg max-w-sm m-4 z-40 hidden sm:block pointer-events-none">
                <Activity className="w-5 h-5 text-teal-500 mx-auto animate-pulse mb-2" />
                <h3 className="text-[10px] font-bold text-slate-300">REAL-TIME CANOPY INTELLIGENCE</h3>
                <p className="text-[9px] text-slate-500 leading-relaxed mt-1">
                  Hover or click on active environmental alert nodes to load findings and dispatch forest regulatory teams.
                </p>
              </div>
            </div>

            {/* Indian Sub-Region and Area select indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
              <div className="p-2 border border-slate-800 bg-slate-950 rounded text-left">
                <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold">FSI Region</span>
                <span className="text-[10px] font-bold text-teal-400">HASDEO ARAND</span>
              </div>
              <div className="p-2 border border-slate-800 bg-slate-950 rounded text-left">
                <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold">SPCB Region</span>
                <span className="text-[10px] font-bold text-indigo-400">ARAVALLI ESZ</span>
              </div>
              <div className="p-2 border border-slate-800 bg-slate-950 rounded text-left">
                <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold">District Monitor</span>
                <span className="text-[10px] font-bold text-cyan-400">SONBHADRA BELT</span>
              </div>
              <div className="p-2 border border-slate-800 bg-slate-950 rounded text-left">
                <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold">Forest Circle</span>
                <span className="text-[10px] font-bold text-pink-400">DEHRADUN FOOTHILLS</span>
              </div>
            </div>
          </div>

          {/* SATELLITE IMAGE COMPARISON (SPOTLIGHT VIEW) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 select-none">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-100">Live Forest Canopy Variation Delta</h2>
              </div>
              <span className="bg-indigo-500/10 text-indigo-400 text-[8px] font-bold px-2 py-0.5 rounded">
                CANOPY INDEX DEFICIT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-[9px] text-slate-400 uppercase tracking-widest flex items-center justify-between">
                  <span>HISTORIC CANOPY BASELINE (BEFORE)</span>
                  <span className="font-bold text-slate-500">2026-01-15</span>
                </div>
                <div className="relative aspect-[16/10] bg-slate-950 border border-slate-800 rounded overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-emerald-950/40 border border-emerald-800/20" />
                  <svg className="w-full h-full opacity-60 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <circle cx="20" cy="30" r="15" fill="#064e3b" />
                    <circle cx="50" cy="25" r="18" fill="#065f46" />
                    <circle cx="80" cy="40" r="14" fill="#064e3b" />
                    <circle cx="35" cy="65" r="22" fill="#047857" />
                    <circle cx="65" cy="70" r="16" fill="#064e3b" />
                  </svg>
                  <span className="absolute bottom-2 left-2 bg-slate-900/90 border border-slate-700 text-[8px] font-mono px-1.5 py-0.5 rounded text-emerald-400">NDVI VALUE: 0.82 (High Density Canopy)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[9px] text-rose-400 font-bold uppercase tracking-widest flex items-center justify-between animate-pulse">
                  <span>CURRENT ENVELOPE (RECENT PASS)</span>
                  <span className="font-bold text-rose-500">2026-06-17</span>
                </div>
                <div className="relative aspect-[16/10] bg-slate-950 border border-slate-800 rounded overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-amber-950/30 border border-rose-900/40" />
                  <svg className="w-full h-full opacity-60 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <circle cx="20" cy="30" r="10" fill="#2d1610" />
                    <circle cx="50" cy="25" r="4" fill="#3b0712" />
                    <rect x="35" y="45" width="40" height="25" fill="#450a0a" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="10" y1="90" x2="90" y2="10" stroke="#f59e0b" strokeWidth="0.8" />
                    <line x1="15" y1="95" x2="95" y2="15" stroke="#f59e0b" strokeWidth="0.8" />
                  </svg>
                  <span className="absolute bottom-2 left-2 bg-slate-900/90 border border-slate-700 text-[8px] font-mono px-1.5 py-0.5 rounded text-red-400">NDVI VALUE: 0.38 (REDUCED TO SHRUB / CLEARING)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-300 block">Classified Land & Forest Infractions:</span>
                <span className="text-slate-500 text-[10px] block leading-normal">
                  Linear topsoil excavation trails, unauthorized access roads, heavy metal sediment wash plume patterns, and illegal quarrying layouts.
                </span>
              </div>
              <div className="flex flex-col items-end text-right whitespace-nowrap pl-4">
                <span className="text-[10px] text-amber-500 font-bold block">Canopy Loss: -45.1%</span>
                <span className="text-[10px] text-red-500 block">Critical Regression</span>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL RIGHT: ENVIRONMENTAL LAW COMPLIANCE & INVESTIGATION LIST (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 select-none">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-100">National Compliance Cases</h2>
                </div>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-[8px] font-bold">
                  SORT: PRIORITY
                </span>
              </div>

              {/* High risk cases rows list */}
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {cases.map((cs, idx) => (
                  <div 
                    key={idx}
                    onClick={() => onSelectCase(cs.caseId)}
                    className="p-3 bg-slate-950/80 hover:bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-300 group-hover:text-teal-400 transition-colors">
                          {cs.caseId}
                        </span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                          cs.priority === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-900/30' : 'bg-amber-950 text-amber-400 border border-amber-900/30'
                        }`}>
                          {cs.priority}
                        </span>
                      </div>
                      <span className={`text-[9px] font-bold rounded px-1.5 py-0.5 border ${
                        cs.status === 'Resolved' 
                          ? 'text-emerald-400 bg-emerald-950/40 border-emerald-900/30' 
                          : cs.status === 'Under Investigation'
                          ? 'text-indigo-400 bg-indigo-950/40 border-indigo-900/30'
                          : cs.status === 'Inspection Scheduled'
                          ? 'text-cyan-400 bg-cyan-950/40 border-cyan-900/30'
                          : cs.status === 'Assigned'
                          ? 'text-blue-400 bg-blue-950/40 border-blue-900/30'
                          : 'text-amber-400 bg-amber-950/40 border-amber-900/30'
                      }`}>
                        {cs.status.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-200 truncate">{cs.locationName}</h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{cs.type} &bull; {cs.assignedAgency}</p>
                    </div>

                    <div className="flex justify-between items-center text-[9px] pt-2 border-t border-slate-900 font-mono text-slate-400">
                      <span>EST DAMAGE: {cs.estimatedDamage.split(' ')[0]} {cs.estimatedDamage.split(' ')[1]}</span>
                      <span className="flex items-center gap-1 text-slate-300 font-bold group-hover:text-teal-400 transition-colors">
                        Assign Inspection <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick interactive status note block */}
            <div className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden">
              <span className="absolute top-0 right-0 p-1.5 text-indigo-500/10">
                <Shield className="w-8 h-8 text-indigo-500 pointer-events-none" />
              </span>
              <h4 className="text-[10px] font-bold tracking-widest mb-1.5 uppercase text-teal-400 animate-pulse flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-teal-400" /> Environmental Protection Act Controls
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                Our systemic pipeline correlates Sentinel optical metrics with Synthetic Aperture Radar (SAR) sensors to flag unauthorized clearings. Findings compile prosecutable evidence for District Collectors instantly.
              </p>
              <button
                onClick={() => onNavigateToTab('enforcement')}
                className="mt-3.5 w-full bg-slate-800 hover:bg-teal-600 text-white font-mono text-[10px] font-bold py-2.5 rounded border border-slate-700 hover:border-teal-500 transition-colors uppercase tracking-widest text-center cursor-pointer"
              >
                Launch Inspection Assignment Console
              </button>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
