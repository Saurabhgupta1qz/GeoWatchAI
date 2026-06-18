import React, { useState } from 'react';
import { TrendingUp, Layers, Shield, Cpu, Activity, Info, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChartPoint {
  label: string;
  loss: number;
  alerts: number;
  coverage: number;
  x: number;
  y: number;
}

interface Category {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface RangeData {
  criticalThreatsLabel: string;
  criticalTrendText: string;
  criticalTrendUp: boolean;
  criticalTrendSeverity: 'neutral' | 'dangerous' | 'positive';
  
  deforestationAreaLabel: string;
  deforestationTrendText: string;
  deforestationTrendUp: boolean;
  deforestationTrendSeverity: 'neutral' | 'dangerous' | 'positive';
  
  monitoringCoverageLabel: string;
  monitoringCoverageSubText: string;
  coverageTrendText: string;
  coverageTrendUp: boolean;
  
  aiAccuracyLabel: string;
  accuracyTrendText: string;
  accuracyTrendUp: boolean;
  
  chartPoints: ChartPoint[];
  categories: Category[];
  syncGrid: { id: number; efficiency: number; active: boolean }[];
  matrixSubtitle: string;
}

// Stable deterministic datasets to avoid layout shifting or random regeneration during mouse hovers
const RANGE_DATA_SETS: Record<'30D' | '90D' | '1Y', RangeData> = {
  '30D': {
    criticalThreatsLabel: '3 Active Hotspots',
    criticalTrendText: '1 neutralized this month',
    criticalTrendUp: false,
    criticalTrendSeverity: 'positive',
    
    deforestationAreaLabel: '-124 Hectares',
    deforestationTrendText: '-42% canopy loss rate reduction',
    deforestationTrendUp: false,
    deforestationTrendSeverity: 'positive',
    
    monitoringCoverageLabel: '95.2% Live Coverage',
    monitoringCoverageSubText: '95.2% Territory Under Lock',
    coverageTrendText: '+3.4% Sentinel validation',
    coverageTrendUp: true,
    
    aiAccuracyLabel: '91.8% Model Score',
    accuracyTrendText: '+0.4% monthly tuning step',
    accuracyTrendUp: true,
    
    chartPoints: [
      { label: 'Wk 1', loss: 24, alerts: 1, coverage: 93.1, x: 10, y: 185 },
      { label: 'Wk 2', loss: 42, alerts: 3, coverage: 93.9, x: 105, y: 162 },
      { label: 'Wk 3', loss: 31, alerts: 2, coverage: 94.4, x: 195, y: 174 },
      { label: 'Wk 4', loss: 59, alerts: 5, coverage: 94.8, x: 295, y: 146 },
      { label: 'Wk 5', loss: 84, alerts: 8, coverage: 95.0, x: 395, y: 112 },
      { label: 'Wk 6', loss: 98, alerts: 10, coverage: 95.2, x: 490, y: 92 }
    ],
    
    categories: [
      { name: 'Illegal Opencast Mining', count: 4, percentage: 40, color: 'bg-red-500' },
      { name: 'Commercial Deforestation', count: 3, percentage: 30, color: 'bg-orange-500' },
      { name: 'Reserved Forest Encroachment', count: 2, percentage: 20, color: 'bg-yellow-500' },
      { name: 'Habitat Destruction', count: 1, percentage: 10, color: 'bg-teal-500' }
    ],
    
    syncGrid: Array.from({ length: 96 }, (_, i) => ({
      id: i,
      efficiency: 81 + ((i * 7) % 19),
      active: (i * 13) % 100 > 22
    })),
    matrixSubtitle: 'HISTORIC LATEST 30-DAY SWEEP MAP'
  },
  '90D': {
    criticalThreatsLabel: '5 Active Hotspots',
    criticalTrendText: '+2 critical clusters flagged',
    criticalTrendUp: true,
    criticalTrendSeverity: 'dangerous',
    
    deforestationAreaLabel: '-1,120 Hectares',
    deforestationTrendText: '+12% canopy loss change rate',
    deforestationTrendUp: true,
    deforestationTrendSeverity: 'dangerous',
    
    monitoringCoverageLabel: '97.4% Live Coverage',
    monitoringCoverageSubText: '97.4% Territory Under Lock',
    coverageTrendText: '+5.1% radar range expansion',
    coverageTrendUp: true,
    
    aiAccuracyLabel: '93.6% Model Score',
    accuracyTrendText: '+1.8% quarterly verification',
    accuracyTrendUp: true,
    
    chartPoints: [
      { label: 'Day 15', loss: 190, alerts: 8, coverage: 95.1, x: 10, y: 160 },
      { label: 'Day 30', loss: 280, alerts: 14, coverage: 96.0, x: 105, y: 135 },
      { label: 'Day 45', loss: 220, alerts: 11, coverage: 96.5, x: 195, y: 150 },
      { label: 'Day 60', loss: 340, alerts: 19, coverage: 97.2, x: 295, y: 115 },
      { label: 'Day 75', loss: 410, alerts: 24, coverage: 98.0, x: 395, y: 95 },
      { label: 'Day 90', loss: 490, alerts: 28, coverage: 98.4, x: 490, y: 75 }
    ],
    
    categories: [
      { name: 'Illegal Opencast Mining', count: 12, percentage: 41, color: 'bg-red-500' },
      { name: 'Commercial Deforestation', count: 9, percentage: 31, color: 'bg-orange-500' },
      { name: 'Reserved Forest Encroachment', count: 5, percentage: 17, color: 'bg-yellow-500' },
      { name: 'Habitat Destruction', count: 3, percentage: 11, color: 'bg-teal-500' }
    ],
    
    syncGrid: Array.from({ length: 96 }, (_, i) => ({
      id: i,
      efficiency: 84 + ((i * 11) % 16),
      active: (i * 17) % 100 > 15
    })),
    matrixSubtitle: 'HISTORIC LATEST 90-DAY SWEEP MAP'
  },
  '1Y': {
    criticalThreatsLabel: '29 Active Hotspots',
    criticalTrendText: '12 fully mitigated globally',
    criticalTrendUp: false,
    criticalTrendSeverity: 'positive',
    
    deforestationAreaLabel: '-4,380 Hectares',
    deforestationTrendText: '-14% velocity contraction YoY',
    deforestationTrendUp: false,
    deforestationTrendSeverity: 'positive',
    
    monitoringCoverageLabel: '99.8% Live Coverage',
    monitoringCoverageSubText: '99.8% Territory Under Lock',
    coverageTrendText: '+12.4% full fleet integration',
    coverageTrendUp: true,
    
    aiAccuracyLabel: '96.3% Model Score',
    accuracyTrendText: '+4.1% annual learning loop',
    accuracyTrendUp: true,
    
    chartPoints: [
      { label: 'Jan-Feb', loss: 580, alerts: 35, coverage: 98.8, x: 10, y: 155 },
      { label: 'Mar-Apr', loss: 740, alerts: 48, coverage: 99.1, x: 105, y: 135 },
      { label: 'May-Jun', loss: 1020, alerts: 74, coverage: 99.5, x: 195, y: 95 },
      { label: 'Jul-Aug', loss: 860, alerts: 60, coverage: 99.2, x: 295, y: 115 },
      { label: 'Sep-Oct', loss: 1140, alerts: 88, coverage: 99.7, x: 395, y: 80 },
      { label: 'Nov-Dec', loss: 1380, alerts: 105, coverage: 99.8, x: 490, y: 45 }
    ],
    
    categories: [
      { name: 'Illegal Opencast Mining', count: 42, percentage: 43, color: 'bg-red-500' },
      { name: 'Commercial Deforestation', count: 28, percentage: 29, color: 'bg-orange-500' },
      { name: 'Reserved Forest Encroachment', count: 18, percentage: 18, color: 'bg-yellow-500' },
      { name: 'Habitat Destruction', count: 10, percentage: 10, color: 'bg-teal-500' }
    ],
    
    syncGrid: Array.from({ length: 96 }, (_, i) => ({
      id: i,
      efficiency: 87 + ((i * 13) % 13),
      active: (i * 19) % 100 > 8
    })),
    matrixSubtitle: 'HISTORIC LATEST 1-YEAR SWEEP MAP'
  }
};

export default function Analytics() {
  const [activeRange, setActiveRange] = useState<'30D' | '90D' | '1Y'>('90D');
  const [hoveredData, setHoveredData] = useState<{ label: string; value: string; alerts: number } | null>(null);

  const currentData = RANGE_DATA_SETS[activeRange];

  // Generate coordinates for SVG paths programmatically based on points
  const points = currentData.chartPoints;
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L 490 200 L 10 200 Z`;

  return (
    <div id="analytics-operations-workspace" className="max-w-7xl mx-auto px-6 py-6 space-y-6 text-left">
      
      {/* Workspace Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <span className="font-mono text-xs text-teal-650 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            SATELLITE DATA INTELLIGENCE
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Executive Analytics Console</h2>
          <p className="text-slate-500 text-xs font-light">
            Analyse canopy degradation trends, national coverage intervals, and distribution metrics mapped from Sentinel constellations.
          </p>
        </div>

        {/* Range Selector tab list */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start border border-slate-200/50">
          {(['30D', '90D', '1Y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => {
                setActiveRange(range);
                setHoveredData(null);
              }}
              className={`px-4 py-1.5 text-xs font-mono font-bold rounded-md transition-all ${
                activeRange === range 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics KPI strip with smooth state-driven transitions */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeRange}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {/* KPI Card 1: Active Hotspots */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-colors">
            <div className={`p-3 rounded-xl ${
              currentData.criticalTrendSeverity === 'positive' 
                ? 'bg-emerald-50 text-emerald-600' 
                : 'bg-red-50 text-red-600'
            }`}>
              <Activity className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-semibold">Critical Threat Density</span>
              <div className="text-xl font-black text-slate-800 tracking-tight">{currentData.criticalThreatsLabel}</div>
              <div className="flex items-center gap-1 text-[10px] font-medium mt-0.5">
                {currentData.criticalTrendSeverity === 'positive' ? (
                  <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 text-red-600" />
                )}
                <span className={currentData.criticalTrendSeverity === 'positive' ? 'text-emerald-700' : 'text-red-700'}>
                  {currentData.criticalTrendText}
                </span>
              </div>
            </div>
          </div>

          {/* KPI Card 2: Total Deforestation Area */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-colors">
            <div className={`p-3 rounded-xl ${
              currentData.deforestationTrendSeverity === 'positive'
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-orange-50 text-orange-600'
            }`}>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-semibold">Total Deforestation Area</span>
              <div className="text-xl font-black text-slate-850 tracking-tight text-red-600">{currentData.deforestationAreaLabel}</div>
              <div className="flex items-center gap-1 text-[10px] font-medium mt-0.5">
                {currentData.deforestationTrendSeverity === 'positive' ? (
                  <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 text-orange-600" />
                )}
                <span className={currentData.deforestationTrendSeverity === 'positive' ? 'text-emerald-700 font-bold' : 'text-orange-700 font-bold'}>
                  {currentData.deforestationTrendText}
                </span>
              </div>
            </div>
          </div>

          {/* KPI Card 3: Monitoring Coverage */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-colors">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-semibold">National Coverage</span>
              <div className="text-xl font-black text-slate-800 tracking-tight">{currentData.monitoringCoverageLabel}</div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-teal-700 mt-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{currentData.coverageTrendText}</span>
              </div>
            </div>
          </div>

          {/* KPI Card 4: AI Sweep Efficiency */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-colors">
            <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-semibold">AI Sweep Efficiency</span>
              <div className="text-xl font-black text-slate-800 tracking-tight">{currentData.aiAccuracyLabel}</div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-teal-700 mt-0.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-teal-600 animate-bounce" />
                <span>{currentData.accuracyTrendText}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main Charts double column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT CHART COLUMN: CANOPY DEGRADATION CURVE Area chart (8/12 COLS) */}
        <div className="lg:col-span-8 bg-slate-900 text-white rounded-2xl border p-5 sm:p-6 shadow-md border-slate-800/80 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4 select-none">
            <div>
              <h3 className="text-sm font-sans font-extrabold uppercase tracking-tight text-white">Canopy Degradation Index Timeline</h3>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">METRIC HECTARES ACCUMULATED ANOMALY INDEX</p>
            </div>

            {/* Hovered coordinates tracker */}
            <div className="h-7 min-w-[120px] flex items-center justify-end">
              <AnimatePresence mode="wait">
                {hoveredData ? (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] font-mono font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1"
                  >
                    {hoveredData.label}: <strong className="text-white">{hoveredData.value} Ha</strong> ({hoveredData.alerts} Alerts)
                  </motion.span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500 italic">Hover points to audit data</span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* SVG Vector Area Chart representation */}
          <div className="relative h-64 w-full select-none cursor-pointer">
            <svg viewBox="0 0 500 220" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(20, 184, 166, 0.4)" />
                  <stop offset="100%" stopColor="rgba(20, 184, 166, 0.0)" />
                </linearGradient>
              </defs>

              {/* Horizontal dotted grid line markers */}
              <line x1="0" y1="35" x2="500" y2="35" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3,3" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3,3" />
              <line x1="0" y1="145" x2="500" y2="145" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3,3" />
              <line x1="0" y1="200" x2="500" y2="200" stroke="rgba(255, 255, 255, 0.15)" />

              {/* Glowing trend vector paths with key transition trigger */}
              <AnimatePresence>
                <motion.path
                  key={`area-${activeRange}`}
                  initial={{ pathLength: 0, opacity: 0.2 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  d={areaPath}
                  fill="url(#areaGradient)"
                />
              </AnimatePresence>

              <AnimatePresence>
                <motion.path
                  key={`line-${activeRange}`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  d={linePath}
                  fill="none"
                  stroke="rgba(20, 184, 166, 1)"
                  strokeWidth="2.5"
                />
              </AnimatePresence>

              {/* Data points markers */}
              {points.map((pt, index) => (
                <circle
                  key={`${activeRange}-pt-${index}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  className="transition-all hover:r-6 cursor-crosshair"
                  style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                  fill="#ffffff"
                  stroke="rgba(20, 184, 166, 1)"
                  strokeWidth="2.5"
                  onMouseEnter={() => setHoveredData({ label: pt.label, value: pt.loss.toString(), alerts: pt.alerts })}
                  onMouseLeave={() => setHoveredData(null)}
                />
              ))}
            </svg>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 select-none pt-4">
            <span>VOLUMES CAPTURED COHERENTLY ({activeRange} SPATIAL COHERENCE)</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-teal-500 rounded-full inline-block"></span> 
                {activeRange === '30D' ? 'Weekly Degradation' : activeRange === '90D' ? 'Bi-weekly Degradation' : 'Bi-monthly Degradation'}
              </span>
              <span>Constellation cadence: 2 sweeps/daily</span>
            </div>
          </div>
        </div>

        {/* RIGHT CHART COLUMN: CATEGORIES DISTRIBUTION (4/12 COLS) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div className="space-y-4 text-left select-none">
            <div>
              <h3 className="text-sm font-sans font-extrabold uppercase tracking-tight text-slate-800">Violation Classification</h3>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">PROPORTIONAL ANALYSIS OF ALERTS</p>
            </div>

            {/* Custom interactive visual bars with exit/enter transitions on range switch */}
            <AnimatePresence mode="popLayout">
              <motion.div 
                key={activeRange}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 pt-2"
              >
                {currentData.categories.map((cat, i) => (
                  <div key={i} className="space-y-1.5 text-left">
                    <div className="flex justify-between items-center text-xs font-medium">
                      <span className="text-slate-700 truncate max-w-[180px] sm:max-w-[200px]">{cat.name}</span>
                      <span className="font-mono text-[11px] font-bold text-slate-900">
                        {cat.percentage}% ({cat.count})
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-150 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percentage}%` }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className={`h-full rounded-full ${cat.color}`} 
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono py-2 bg-slate-50 border border-slate-100 p-2.5 rounded-lg border-dashed mt-4 text-left leading-normal select-none">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Classification ratio represents confidence intervals over verified Sentinel L-Band sweeps.</span>
          </div>
        </div>

      </div>

      {/* 3. CONSTELLATION SYNCING HEATMAP GRID */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4 select-none">
          <div>
            <h3 className="text-sm font-sans font-extrabold uppercase tracking-tight text-slate-800">Sub-meter Radar Sweep Matrix</h3>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">{currentData.matrixSubtitle}</p>
          </div>

          <div className="flex items-center gap-2.5 text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500/40 rounded inline-block"></span> High coverage</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-teal-500/80 rounded inline-block"></span> Perfect lock (95-100%)</span>
          </div>
        </div>

        {/* Matrix Grid dots representing health checkpoints (Stable without layout resetting on card/graph hovers) */}
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={activeRange}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-2 pt-2 select-none"
          >
            {currentData.syncGrid.map(cell => (
              <div
                key={cell.id}
                className={`aspect-square w-full rounded border group relative cursor-help transition-all ${
                  cell.active
                    ? 'bg-teal-500/85 hover:bg-emerald-500 border-teal-500'
                    : 'bg-emerald-500/30 hover:bg-teal-400 border-emerald-500/20'
                }`}
              >
                {/* Micro-hover tooltip detail */}
                <div className="opacity-0 group-hover:opacity-100 absolute bg-slate-900 text-white font-mono text-[8.5px] p-1.5 rounded -top-8 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap shadow-md pointer-events-none transition-all duration-150 border border-slate-700/50">
                  Block #{cell.id} LOCK: {cell.efficiency}%
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono select-none">
          <span>COAST INTEGRITY INFERENCE MATRIX FOR India</span>
          <span className="flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 text-teal-600 animate-spin" />
            LATEST COMPLETED DISPATCH SECURED
          </span>
        </div>
      </div>

    </div>
  );
}
