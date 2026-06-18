import { useState, MouseEvent, TouchEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Split, 
  Layers, 
  Sparkles, 
  AlertCircle, 
  TrendingDown, 
  MapPin, 
  Calendar, 
  UserCheck, 
  FileCheck, 
  ShieldAlert, 
  Info, 
  Eye, 
  EyeOff,
  Activity,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { Case, MonitoringZone } from '../types';
import { mockZones, mockCases } from '../data/mockData';
import { useArmorIQ } from './ArmorIQ';

interface EnvironmentalChangeAnalysisProps {
  cases?: Case[];
  zones?: MonitoringZone[];
  onSelectCase?: (caseId: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

export default function EnvironmentalChangeAnalysis({
  cases = mockCases,
  zones = mockZones,
  onSelectCase,
  onNavigateToTab
}: EnvironmentalChangeAnalysisProps) {
  const { triggerVerification } = useArmorIQ();

  // Selected Case (defaults to GW-2026-001 / Hasdeo Forest which fits user strict values)
  const [selectedCaseId, setSelectedCaseId] = useState<string>('GW-2026-001');
  const [viewMode, setViewMode] = useState<'side-by-side' | 'slider'>('side-by-side');
  
  // Interactive Slider Position (0 to 100)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Toggle Overlays
  const [showVegLoss, setShowVegLoss] = useState<boolean>(true);
  const [showMiningActivity, setShowMiningActivity] = useState<boolean>(true);
  const [showDisturbedPatches, setShowDisturbedPatches] = useState<boolean>(true);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(75);

  const activeCase = cases.find(c => c.caseId === selectedCaseId) || cases[0];
  const activeZone = zones.find(z => z.id === activeCase.zoneId) || zones[0];

  // Derive dynamic metrics matching the user request for the default case, 
  // and adapt gracefully if other cases are loaded in the demo.
  const getChangeMetrics = (caseId: string) => {
    if (caseId === 'GW-2026-001') {
      return {
        vegLoss: '31%',
        newExcavation: 'Detected',
        landDisturbance: 'High',
        accessRoads: 'Detected',
        protectedZoneImpact: 'Medium',
        impactScore: 89,
        priority: 'HIGH',
        inspectionRequired: 'Within 48 Hours',
        beforeDate: '2026-03-12',
        afterDate: '2026-06-17',
        observations: [
          'Significant vegetation reduction observed.',
          'New excavation activity identified.',
          'Increased soil exposure detected.',
          'Human activity patterns have expanded.',
          'Environmental degradation risk increasing.'
        ]
      };
    } else if (caseId === 'GW-2026-002') {
      return {
        vegLoss: '18.5%',
        newExcavation: 'Detected',
        landDisturbance: 'High',
        accessRoads: 'Detected',
        protectedZoneImpact: 'High',
        impactScore: 86,
        priority: 'HIGH',
        inspectionRequired: 'Within 72 Hours',
        beforeDate: '2026-02-15',
        afterDate: '2026-06-17',
        observations: [
          'Scattered hillside forest canopy extraction detected.',
          'Stone crusher operations and structural layout identified.',
          'Aerosol optical thickness indices exceed baseline limits.',
          'Access pathway corridors cleared on steep slopes.',
          'Siltation runoffs risk surrounding seasonal stream recharges.'
        ]
      };
    } else if (caseId === 'GW-2026-003') {
      return {
        vegLoss: '38.4%',
        newExcavation: 'Detected',
        landDisturbance: 'Critical',
        accessRoads: 'Detected',
        protectedZoneImpact: 'High',
        impactScore: 94,
        priority: 'CRITICAL',
        inspectionRequired: 'Within 24 Hours',
        beforeDate: '2026-01-10',
        afterDate: '2026-06-16',
        observations: [
          'Massive contiguous topsoil scraping along lease margins.',
          'Active deep coal/sand pit overflow expansion identified.',
          'Runoff slurry detected flowing into Rihand Reservoir tributaries.',
          'Heavy vehicle tracks and stockpiles detected inside forest reserves.',
          'Immediate physical silt fences required to stem active pollution.'
        ]
      };
    } else {
      return {
        vegLoss: '4.2%',
        newExcavation: 'Not Detected',
        landDisturbance: 'Low',
        accessRoads: 'Not Detected',
        protectedZoneImpact: 'Low',
        impactScore: 34,
        priority: 'LOW',
        inspectionRequired: 'Routine Weekly Monitoring',
        beforeDate: '2026-04-05',
        afterDate: '2026-06-15',
        observations: [
          'Localized perimeter shrub land clearance near private boundary.',
          'No heavy excavator machinery footprint registered.',
          'Slope stability index remains entirely COMPLIANT.',
          'Ecosystem canopy balance normal.'
        ]
      };
    }
  };

  const metrics = getChangeMetrics(activeCase.caseId);

  // Drag handlers for the Interactive Split Slider View
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans space-y-6">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-600 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
              SATELLITE CHANGE ENGINE v3.2
            </span>
            <span className="bg-slate-100 text-slate-500 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-200">
              ALGORITHMIC INTERFEROMETRY
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Environmental Change Analysis
          </h1>
          <p className="text-slate-500 text-xs font-light max-w-2xl mt-0.5">
            Compare temporal satellite sweeps from Indian national monitoring corridors. Powered by multi-spectral orthorectified image analytics to uncover ecological transformations and encroachment zones.
          </p>
        </div>

        {/* View Switch / Quick Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center gap-0.5 font-mono text-xs font-bold">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'side-by-side'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Side-by-Side</span>
            </button>
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'slider'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Split className="w-3.5 h-3.5 text-teal-600" />
              <span>Interactive Slider</span>
            </button>
          </div>
        </div>
      </div>

      {/* CASE INTEGRATION & JURISDICTION SELECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-bold block">
              Active Monitoring Target
            </label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {cases.map((c) => (
                <option key={c.caseId} value={c.caseId}>
                  {c.caseId} - {c.locationName}
                </option>
              ))}
            </select>
          </div>

          {/* Linked Case Information Card */}
          <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase">Linked Case Details</span>
              <span className={`text-[9px] font-black py-0.5 px-2 rounded-full border ${
                activeCase.status === 'Resolved'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-205'
                  : activeCase.status === 'Inspection Scheduled'
                  ? 'bg-yellow-50 text-yellow-800 border-yellow-205'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-205 animate-pulse'
              }`}>
                {activeCase.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-left">
              <div>
                <span className="text-[9px] text-slate-400 font-mono uppercase block">CASE ID</span>
                <span className="text-xs font-extrabold text-slate-800 font-mono">{activeCase.caseId}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-mono uppercase block">CURRENT STATUS</span>
                <span className="text-xs font-bold text-slate-700">{activeCase.status}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[9px] text-slate-400 font-mono uppercase block">ASSIGNED OFFICER</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center font-black text-[9px] text-white select-none">
                    {(activeCase.assignedOfficer || 'U')[0]}
                  </div>
                  <span className="text-xs font-extrabold text-slate-850 font-mono truncate">
                    {activeCase.assignedOfficer || 'Not Assigned'}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-mono uppercase block">COORDINATES</span>
                <span className="text-xs font-bold text-slate-600 font-mono">{activeCase.lat.toFixed(4)}°N, {activeCase.lng.toFixed(4)}°E</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-mono uppercase block">JURISDICTION DISTRICT</span>
                <span className="text-xs font-bold text-slate-600 truncate block">{activeCase.assignedDistrict || 'State Authority'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* OVERLAY CONTROLS AND VIEW CONFIGURATION */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-mono font-black tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-600" />
                Change Interpretation Layer Overlays
              </h3>
              <span className="text-[9px] text-slate-400 font-mono">BANDS B4/B3/B2 + REVELATION</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Toggle Vegetation Loss */}
              <button 
                onClick={() => setShowVegLoss(!showVegLoss)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer group ${
                  showVegLoss 
                    ? 'bg-rose-50/75 border-rose-300 shadow-sm' 
                    : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`text-[10px] font-mono font-black py-0.5 px-2 rounded-md ${
                    showVegLoss ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    VEG_LOSS_SZ
                  </span>
                  {showVegLoss ? <Eye className="w-3.5 h-3.5 text-rose-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-405 text-slate-400" />}
                </div>
                <div className="mt-2.5">
                  <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-rose-900 transition-colors">Vegetation Loss Zones</h4>
                  <p className="text-[10px] text-slate-500 font-light mt-0.5 leading-snug">Highlighted boundary of parsed canopy density index drop.</p>
                </div>
              </button>

              {/* Toggle Mining Activity */}
              <button 
                onClick={() => setShowMiningActivity(!showMiningActivity)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer group ${
                  showMiningActivity 
                    ? 'bg-amber-50/75 border-amber-300 shadow-sm' 
                    : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`text-[10px] font-mono font-black py-0.5 px-2 rounded-md ${
                    showMiningActivity ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    EXCAVATEID
                  </span>
                  {showMiningActivity ? <Eye className="w-3.5 h-3.5 text-amber-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-405 text-slate-400" />}
                </div>
                <div className="mt-2.5">
                  <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-amber-900 transition-colors">Mining Activity Ares</h4>
                  <p className="text-[10px] text-slate-500 font-light mt-0.5 leading-snug">Identifies pits, physical quarry excavation borders, and dumps.</p>
                </div>
              </button>

              {/* Toggle Disturbed Land patches */}
              <button 
                onClick={() => setShowDisturbedPatches(!showDisturbedPatches)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer group ${
                  showDisturbedPatches 
                    ? 'bg-orange-50/75 border-orange-300 shadow-sm' 
                    : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`text-[10px] font-mono font-black py-0.5 px-2 rounded-md ${
                    showDisturbedPatches ? 'bg-orange-100 text-orange-850' : 'bg-slate-200 text-slate-600'
                  }`}>
                    DISTURB_ZONE
                  </span>
                  {showDisturbedPatches ? <Eye className="w-3.5 h-3.5 text-orange-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-405 text-slate-400" />}
                </div>
                <div className="mt-2.5">
                  <h4 className="text-xs font-extrabold text-slate-855 text-slate-800 group-hover:text-orange-950 transition-colors">Disturbed Land Patches</h4>
                  <p className="text-[10px] text-slate-500 font-light mt-0.5 leading-snug">Flags topsoil erosion, cleared paths, and compacted earth patches.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Opacity Control slider */}
          <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-150 text-xs text-slate-600">
            <span className="font-mono font-bold shrink-0">Overlay Rendering Mix:</span>
            <input 
              type="range"
              min="10"
              max="100"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(Number(e.target.value))}
              className="flex-1 accent-teal-600 h-1.5 bg-slate-250 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="font-mono font-bold w-12 text-right text-teal-600 shrink-0">{overlayOpacity}% Opac</span>
          </div>
        </div>
      </div>

      {/* SATELLITE COMPARISON WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SATELLITE IMAGERY DISPLAY AREA - COLUMN SPAN 8 */}
        <div className="lg:col-span-8 space-y-2">
          
          {viewMode === 'side-by-side' ? (
            /* SIDE-BY-SIDE DISPLAY */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              
              {/* BEFORE PANEL */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative group">
                {/* Header telemetry tag */}
                <div className="absolute top-3 left-3 right-3 z-10 flex justify-between items-center font-mono pointer-events-none select-none">
                  <span className="bg-slate-950/80 border border-slate-800 text-slate-400 font-black text-[9px] tracking-wide px-2 py-1 rounded">
                    T1 // {metrics.beforeDate} // BASELINE SURVEY
                  </span>
                  <span className="bg-emerald-500 text-white font-black text-[9px] px-2 py-1 rounded shadow-md uppercase">
                    Pristine Canopy Cover
                  </span>
                </div>

                {/* SATELLITE IMAGE SIMULATION */}
                <div className="aspect-[4/3] w-full bg-slate-950 relative">
                  <SatelliteRasterSimulation
                    caseId={activeCase.caseId}
                    tempo="before"
                    showVegLoss={false}
                    showMining={false}
                    showDisturbed={false}
                    opacity={overlayOpacity}
                  />
                </div>

                {/* Imagery footer parameters */}
                <div className="p-3 bg-slate-950 border-t border-slate-850 flex items-center justify-between text-[10px] font-mono text-slate-500 whitespace-nowrap select-none overflow-hidden">
                  <span>GPS: {activeCase.lat.toFixed(6)} N / {activeCase.lng.toFixed(6)} E</span>
                  <span>SATELLITE REF: SENTINEL-2AM</span>
                </div>
              </div>

              {/* AFTER PANEL */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative group">
                {/* Header telemetry tag */}
                <div className="absolute top-3 left-3 right-3 z-10 flex justify-between items-center font-mono pointer-events-none select-none">
                  <span className="bg-slate-950/80 border border-slate-800 text-slate-400 font-black text-[9px] tracking-wide px-2 py-1 rounded">
                    T2 // {metrics.afterDate} // ACTIVE COMPLIANCE SWEEP
                  </span>
                  <span className="bg-red-600 text-white font-black text-[9px] px-2 py-1 rounded shadow-md uppercase animate-pulse">
                    Encroachment Registered
                  </span>
                </div>

                {/* SATELLITE IMAGE SIMULATION */}
                <div className="aspect-[4/3] w-full bg-slate-950 relative">
                  <SatelliteRasterSimulation
                    caseId={activeCase.caseId}
                    tempo="after"
                    showVegLoss={showVegLoss}
                    showMining={showMiningActivity}
                    showDisturbed={showDisturbedPatches}
                    opacity={overlayOpacity}
                  />
                </div>

                {/* Imagery footer parameters */}
                <div className="p-3 bg-slate-950 border-t border-slate-850 flex items-center justify-between text-[10px] font-mono text-slate-500 whitespace-nowrap select-none overflow-hidden">
                  <span>SWEEP REF: S2_CANOPY_MOD_44</span>
                  <span className="text-red-400 font-extrabold uppercase">Anomaly Verified</span>
                </div>
              </div>

            </div>
          ) : (
            /* INTERACTIVE SPLIT SLIDER VIEW */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative">
              <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-center font-mono pointer-events-none select-none">
                <span className="bg-slate-950/90 border border-slate-800 text-slate-300 font-black text-[9.5px] px-2 py-1 rounded flex items-center gap-1">
                  <Split className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                  DRAG SLIDER HORIZONTALLY TO COMPARE TEMPORAL DELTAS
                </span>
                <span className="bg-teal-600 text-white text-[9px] font-black px-2 py-1 rounded tracking-widest">
                  SLIDER COMPARISON MODE
                </span>
              </div>

              {/* Draggable Drag Container */}
              <div 
                className="aspect-[16/10] relative select-none w-full cursor-col-resize overflow-hidden"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
              >
                
                {/* BEFORE (BASE STACK - RIGHT PORTION GIVEN BY SLIDER) */}
                <div className="absolute inset-0">
                  <SatelliteRasterSimulation
                    caseId={activeCase.caseId}
                    tempo="before"
                    showVegLoss={false}
                    showMining={false}
                    showDisturbed={false}
                    opacity={overlayOpacity}
                  />
                  <div className="absolute bottom-4 left-4 z-15 bg-slate-950/85 border border-slate-800 px-2 py-1 rounded font-mono text-[9px] text-slate-300">
                    Baseline Satellite Image // {metrics.beforeDate}
                  </div>
                </div>

                {/* AFTER (TOP SLIDING LAYER) */}
                <div 
                  className="absolute inset-0 border-r-2 border-teal-400 pointer-events-none"
                  style={{ width: `${sliderPosition}%`, transition: isDragging ? 'none' : 'all 0.1s ease-out' }}
                >
                  <div className="absolute top-0 left-0 h-full w-[1000vw] max-w-[100vw] pointer-events-none">
                    <SatelliteRasterSimulation
                      caseId={activeCase.caseId}
                      tempo="after"
                      showVegLoss={showVegLoss}
                      showMining={showMiningActivity}
                      showDisturbed={showDisturbedPatches}
                      opacity={overlayOpacity}
                    />
                  </div>
                </div>

                {/* Sliding indicator tags */}
                <div 
                  className="absolute bottom-4 right-1.5 z-15 bg-slate-950/85 border border-slate-800 px-2 py-1 rounded font-mono text-[9px] text-slate-300 pointer-events-none"
                  style={{ opacity: sliderPosition < 85 ? 1 : 0 }}
                >
                  Change-Detected State // {metrics.afterDate}
                </div>

                {/* Drag Handle Bar and Pill */}
                <div 
                  className="absolute top-0 bottom-0 w-[2px] bg-teal-400 pointer-events-none z-10"
                  style={{ left: `${sliderPosition}%`, transition: isDragging ? 'none' : 'all 0.1s ease-out' }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center shadow-lg text-white font-extrablack text-[9px] font-bold select-none cursor-pointer">
                    &harr;
                  </div>
                </div>

              </div>
              
              <div className="p-3 bg-slate-950 border-t border-slate-850 flex items-center justify-between text-[10px] font-mono text-slate-500 whitespace-nowrap">
                <span>SLIDER CALIBRATION: {sliderPosition.toFixed(0)}% DELTA COMPONENT REVEALED</span>
                <span>SPECTRAL SENSING RESOLUTION: Orthorectified Sentinel-2 (3.1m Pixel Precision)</span>
              </div>
            </div>
          )}

          {/* Quick Informational Tips */}
          <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-3 flex items-start gap-2 text-slate-500 text-xs font-light select-none">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-mono font-bold text-slate-700 text-[10.5px] uppercase">Demonstration Note for Regional Evaluators</p>
              <p className="mt-0.5 leading-normal">
                Adjust layer checkboxes to overlay algorithmic detections. Toggle the slider view to demonstrate seamless, swipe-to-reveal pixel differences. Highly resilient to cloudy interference due to custom SAR microwave backscatter rendering algorithms.
              </p>
            </div>
          </div>

        </div>

        {/* METRICS, SCORES, AND OBSERVATIONS SIDEBAR - COLUMN SPAN 4 */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* ENVIRONMENTAL IMPACT SCORE */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-850 text-white rounded-2xl p-4.5 shadow-lg space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                  <ShieldAlert className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-[11.5px] font-mono font-black tracking-widest text-red-500 uppercase">
                    Ecosystem Criticality
                  </h4>
                  <span className="text-[8px] text-slate-500 font-mono tracking-widest block font-bold">BIO-SYSTEM DEGRADATION DECK</span>
                </div>
              </div>
              <span className="text-[9px] bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                FLAGGED
              </span>
            </div>

            <div className="flex items-center gap-4 py-1 text-left">
              {/* Radial or Big Score display */}
              <div className="h-16 w-16 rounded-full border-4 border-slate-800 bg-slate-950 flex flex-col justify-center items-center shrink-0 border-t-red-500 border-r-orange-500">
                <span className="text-xl font-mono font-black text-red-400 leading-none">{metrics.impactScore}</span>
                <span className="text-[7.5px] text-slate-500 font-mono">/100</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-mono uppercase block tracking-wider">Environmental Impact Score</span>
                <span className="text-sm font-extrabold text-white flex items-center gap-1">
                  Score: {metrics.impactScore}/100 
                  <span className={`text-[10px] uppercase font-black px-1.5 rounded-sm font-mono tracking-wider ${
                    metrics.priority === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {metrics.priority}
                  </span>
                </span>
                <p className="text-[10px] text-slate-400 font-light mt-0.5">Calculated by weighing dense canopy deficit, heavy footprint proximity, and drainage overlaps.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-white/5 border border-white/10 p-3 rounded-xl text-left font-mono text-[11px]">
              <div>
                <span className="text-[8px] text-slate-400 uppercase tracking-widest block">Priority</span>
                <span className="font-extrabold text-red-400 uppercase">{metrics.priority}</span>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 uppercase tracking-widest block">Inspection Required</span>
                <span className="font-extrabold text-yellow-400 uppercase leading-tight block">{metrics.inspectionRequired}</span>
              </div>
            </div>
          </div>

          {/* CHANGE DETECTION PANEL */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm space-y-3.5">
            <h3 className="text-xs font-mono font-black tracking-widest text-slate-700 uppercase flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                Change Detection Panel
              </span>
              <span className="text-[8px] text-emerald-500 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-mono">ALGORITHMIC OK</span>
            </h3>

            <div className="space-y-2.5 text-xs text-left">
              {/* Vegetation Loss */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50/50 border border-rose-100">
                <span className="text-slate-600 font-medium">Vegetation Loss:</span>
                <span className="font-mono font-black text-rose-700 font-extrabold">{metrics.vegLoss}</span>
              </div>

              {/* New Excavation Area */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/50 border border-amber-100">
                <span className="text-slate-600 font-medium">New Excavation Area:</span>
                <span className="font-mono font-black text-amber-700 font-extrabold">{metrics.newExcavation}</span>
              </div>

              {/* Land Disturbance */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-orange-50/50 border border-orange-100">
                <span className="text-slate-600 font-medium font-sans">Land Disturbance:</span>
                <span className="font-mono font-black text-orange-700 font-extrabold">{metrics.landDisturbance}</span>
              </div>

              {/* Access Road Construction */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50/50 border border-blue-100">
                <span className="text-slate-600 font-medium">Access Road Construction:</span>
                <span className="font-mono font-black text-blue-700 font-extrabold">{metrics.accessRoads}</span>
              </div>

              {/* Protected Zone Impact */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 font-medium">Protected Zone Impact:</span>
                <span className={`font-mono font-black font-extrabold ${
                  metrics.protectedZoneImpact === 'High' ? 'text-red-700' : 'text-amber-700'
                }`}>
                  {metrics.protectedZoneImpact}
                </span>
              </div>
            </div>
          </div>

          {/* AI OBSERVATIONS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm space-y-3">
            <h3 className="text-xs font-mono font-black tracking-widest text-slate-700 uppercase flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
                AI Observations
              </span>
              <span className="text-[8px] text-teal-600 font-extrabold font-mono">NEURAL SYNAPSE</span>
            </h3>

            <div className="space-y-2 text-left">
              {metrics.observations.map((obs, index) => (
                <div key={index} className="flex gap-2 text-slate-600 text-[11.5px] items-start">
                  <span className="text-teal-500 font-bold select-none cursor-default shrink-0 text-base leading-none">&bull;</span>
                  <p className="font-sans font-light leading-relaxed">{obs}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

// Sub-component: A highly realistic, styled SVG-based remote sensing simulation.
// Generates diverse vector maps based on Case ID so it feels real and adaptive in a demo!
interface SatelliteRasterProps {
  caseId: string;
  tempo: 'before' | 'after';
  showVegLoss: boolean;
  showMining: boolean;
  showDisturbed: boolean;
  opacity: number;
}

function SatelliteRasterSimulation({
  caseId,
  tempo,
  showVegLoss,
  showMining,
  showDisturbed,
  opacity
}: SatelliteRasterProps) {
  const isAfter = tempo === 'after';

  // Customize layout shapes based on the exact Case ID to look realistic
  if (caseId === 'GW-2026-001') {
    // Hasdeo Forest: Deforestation
    return (
      <svg className="w-full h-full select-none" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Spatial Grid Pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" />
          </pattern>
          {/* Dense forest pattern */}
          <pattern id="dense-forest" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#1b4d3e" />
            <circle cx="5" cy="5" r="4" fill="#143d30" />
            <circle cx="15" cy="8" r="3" fill="#0f3024" />
            <circle cx="8" cy="15" r="4.5" fill="#164335" />
          </pattern>
          {/* Cleared soil gradient */}
          <radialGradient id="soil-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#bf9d7a" />
            <stop offset="60%" stopColor="#8d6d4f" />
            <stop offset="100%" stopColor="#5c4431" />
          </radialGradient>
        </defs>

        {/* 1. Base Pristine Vegetation Layer */}
        <rect width="400" height="300" fill="#0f382a" />
        {/* organic dense tree patches */}
        <path d="M 0 0 Q 120 50 180 0 T 360 0 Q 390 150 400 300 H 0 Z" fill="url(#dense-forest)" opacity="0.95" />
        <path d="M 50 120 Q 90 80 180 140 T 290 80 T 380 180 T 300 280 Z" fill="#1b4d30" opacity="0.8" />
        
        {/* Winding Blue River */}
        <path d="M 50 0 C 120 80, 100 160, 280 220 C 350 240, 380 290, 390 300" fill="none" stroke="#2563eb" strokeWidth="8" strokeLinecap="round" opacity="0.95" />
        <path d="M 50 0 C 120 80, 100 160, 280 220 C 350 240, 380 290, 390 300" fill="none" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

        {/* 2. Temporal 'After' Modifications (Roads, Scraping, Excavation) */}
        {isAfter && (
          <>
            {/* Massive Area soil clearing / Deforestation Patch */}
            <path d="M 120 40 Q 180 60 190 120 T 110 180 T 70 90 Z" fill="url(#soil-gradient)" />
            <path d="M 240 100 Q 280 80 320 130 T 260 210 Z" fill="url(#soil-gradient)" opacity="0.9" />

            {/* Unauthorized Skid Roads (Grayish linear paths cutting trees) */}
            <path d="M 400 140 L 270 140 L 170 110 L 140 150" fill="none" stroke="#78350f" strokeWidth="3" strokeDasharray="3,1" opacity="0.9" />
            <path d="M 270 140 L 210 210 L 150 230" fill="none" stroke="#78350f" strokeWidth="2.5" opacity="0.8" />
            <path d="M 140 150 L 90 240" fill="none" stroke="#451a03" strokeWidth="4" opacity="0.8" />

            {/* Active circular excavations inside soil boundaries */}
            <ellipse cx="145" cy="80" rx="15" ry="10" fill="#451a03" opacity="0.6" />
            <ellipse cx="280" cy="140" rx="18" ry="12" fill="#451a03" opacity="0.5" />
          </>
        )}

        {/* 3. ALGORITHMIC HIGHLIGHT OVERLAYS (ONLY visible if corresponding hook state is true) */}
        {isAfter && showVegLoss && (
          <path 
            d="M 100 30 Q 190 40 220 120 T 120 200 T 50 110 Z" 
            fill="rgba(244, 63, 94, 0.22)" 
            stroke="#f43f5e" 
            strokeWidth="2" 
            strokeDasharray="4,3"
            style={{ opacity: opacity / 100 }}
          />
        )}

        {isAfter && showMining && (
          <g style={{ opacity: opacity / 100 }}>
            {/* Excavation Zone highlights */}
            <ellipse cx="145" cy="80" rx="22" ry="16" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" />
            <ellipse cx="280" cy="140" rx="25" ry="18" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" />
          </g>
        )}

        {isAfter && showDisturbed && (
          <g style={{ opacity: opacity / 100 }}>
            {/* Disturbed land paths (skidder bulldozer lines highlighted in red/orange) */}
            <path d="M 400 140 L 270 140 L 170 110 L 140 150" fill="none" stroke="#ea580c" strokeWidth="6" opacity="0.55" />
            <path d="M 270 140 L 210 210 L 150 230" fill="none" stroke="#ea580c" strokeWidth="5" opacity="0.55" />
            <ellipse cx="270" cy="140" rx="35" ry="30" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3,1" />
          </g>
        )}

        {/* Calibration Ticks and Overlays */}
        <rect width="400" height="300" fill="url(#grid)" pointerEvents="none" />
        <line x1="20" y1="280" x2="60" y2="280" stroke="#ffffff" strokeWidth="2" />
        <text x="20" y="274" fill="#ffffff" fontSize="8" fontFamily="monospace">100m</text>
        <path d="M 380 20 L 380 10 M 375 15 L 380 10 L 385 15" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        <text x="378" y="29" fill="#ffffff" fontSize="7" fontFamily="monospace" textAnchor="middle">N</text>
      </svg>
    );
  } else if (caseId === 'GW-2026-002') {
    // Aravalli Hills: Stone Quarrying / Mining
    return (
      <svg className="w-full h-full select-none" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* 1. Base Hills Background Layer */}
        <rect width="400" height="300" fill="#2d3748" />
        {/* Grey-Green hills paths */}
        <path d="M 10 300 Q 100 120 180 200 T 320 150 T 400 300 Z" fill="#1a365d" opacity="0.8" />
        <path d="M 0 300 Q 80 180 160 220 T 290 190 T 400 300 Z" fill="#2a4365" opacity="0.7" />
        <path d="M 50 300 Q 150 140 250 210 T 380 230 Z" fill="#14532d" opacity="0.4" />

        {/* 2. Temporal After Modifications */}
        {isAfter && (
          <>
            {/* White-Tan Silica Pit Cuts (Heavy hill biting) */}
            <path d="M 120 180 Q 155 145 190 170 T 210 215 T 130 205 Z" fill="#cbd5e0" />
            <path d="M 135 190 L 180 185 L 175 200 Z" fill="#a0aec0" />
            
            {/* access gravel road lines winding down to pits */}
            <path d="M 0 250 C 70 240, 110 210, 130 195" fill="none" stroke="#edf2f7" strokeWidth="4" />
            <path d="M 130 195 L 180 190" fill="none" stroke="#edf2f7" strokeWidth="3" />
            {/* Side heap site */}
            <ellipse cx="260" cy="220" rx="30" ry="15" fill="#718096" />
          </>
        )}

        {/* 3. ALGORITHMIC HIGHLIGHT OVERLAYS */}
        {isAfter && showVegLoss && (
          <path 
            d="M 100 160 Q 160 130 220 160 T 170 230 Z" 
            fill="rgba(244, 63, 94, 0.2)" 
            stroke="#f43f5e" 
            strokeWidth="1.8" 
            strokeDasharray="4,3"
            style={{ opacity: opacity / 100 }}
          />
        )}

        {isAfter && showMining && (
          <ellipse 
            cx="170" 
            cy="195" 
            rx="50" 
            ry="30" 
            fill="rgba(245, 158, 11, 0.22)" 
            stroke="#f59e0b" 
            strokeWidth="2" 
            style={{ opacity: opacity / 100 }}
          />
        )}

        {isAfter && showDisturbed && (
          <g style={{ opacity: opacity / 100 }}>
            {/* Road highlighting */}
            <path d="M 0 250 C 70 240, 110 210, 130 195" fill="none" stroke="#ea580c" strokeWidth="7" opacity="0.5" />
            <circle cx="260" cy="220" r="35" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3,3" />
          </g>
        )}

        <rect width="400" height="300" fill="url(#grid)" pointerEvents="none" />
        <line x1="20" y1="280" x2="60" y2="280" stroke="#ffffff" strokeWidth="2" />
        <text x="20" y="274" fill="#ffffff" fontSize="8" fontFamily="monospace">100m</text>
        <path d="M 380 20 L 380 10 M 375 15 L 380 10 L 385 15" fill="none" stroke="#ffffff" strokeWidth="1.5" />
      </svg>
    );
  } else if (caseId === 'GW-2026-003') {
    // Sonbhadra: Hard Rock Coal Mining / Buffer expansion
    return (
      <svg className="w-full h-full select-none" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* 1. Base Layer (Part Forest, Part Blue Reservoir Water) */}
        <rect width="400" height="300" fill="#34d399" />
        {/* Grassland patch */}
        <rect y="150" width="400" height="150" fill="#047857" opacity="0.8" />
        {/* River Reservoir on Right */}
        <path d="M 280 0 M 283 0 C 310 100, 270 200, 310 300 L 400 300 L 400 0 Z" fill="#0284c7" />

        {/* 2. Temporal After Modifications */}
        {isAfter && (
          <>
            {/* Dark coal pits spilling towards reservation */}
            <path d="M 150 50 Q 250 80 260 140 T 180 220 T 110 130 Z" fill="#18181b" />
            <path d="M 170 80 Q 230 110 240 150 Z" fill="#09090b" />
            
            {/* Orange-brown runoff draining into the blue water */}
            <path d="M 252 110 C 270 115, 280 113, 298 120" fill="none" stroke="#c2410c" strokeWidth="4" opacity="0.9" />
            <path d="M 264 135 C 285 138, 290 144, 305 142" fill="none" stroke="#ea580c" strokeWidth="5" opacity="0.8" />

            {/* Toxic sludge plumes in the lake */}
            <ellipse cx="310" cy="125" rx="15" ry="8" fill="#d97706" opacity="0.6" />
            <ellipse cx="320" cy="144" rx="20" ry="10" fill="#ea580c" opacity="0.4" />
          </>
        )}

        {/* 3. ALGORITHMIC HIGHLIGHT OVERLAYS */}
        {isAfter && showVegLoss && (
          <path 
            d="M 130 40 Q 260 70 270 150 T 170 230 Z" 
            fill="rgba(244, 63, 94, 0.2)" 
            stroke="#f43f5e" 
            strokeWidth="1.8" 
            strokeDasharray="4,3"
            style={{ opacity: opacity / 100 }}
          />
        )}

        {isAfter && showMining && (
          <ellipse 
            cx="200" 
            cy="135" 
            rx="60" 
            ry="45" 
            fill="rgba(245, 158, 11, 0.22)" 
            stroke="#f59e0b" 
            strokeWidth="2" 
            style={{ opacity: opacity / 100 }}
          />
        )}

        {isAfter && showDisturbed && (
          <g style={{ opacity: opacity / 100 }}>
            {/* Highlighted runoffs and plumes to lake */}
            <path d="M 250 110 C 270 115, 280 113, 310 120" fill="none" stroke="#ea580c" strokeWidth="6" opacity="0.6" />
            <circle cx="310" cy="135" r="25" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3,3" />
          </g>
        )}

        <rect width="400" height="300" fill="url(#grid)" pointerEvents="none" />
        <line x1="20" y1="280" x2="60" y2="280" stroke="#ffffff" strokeWidth="2" />
        <text x="20" y="274" fill="#ffffff" fontSize="8" fontFamily="monospace">100m</text>
        <path d="M 380 20 L 380 10 M 375 15 L 380 10 L 385 15" fill="none" stroke="#ffffff" strokeWidth="1.5" />
      </svg>
    );
  } else {
    // Sariska: Minor clearing / Compliant
    return (
      <svg className="w-full h-full select-none" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Baseline Light green and yellow fields */}
        <rect width="400" height="300" fill="#a7f3d0" />
        <path d="M 0 100 Q 130 180 200 120 T 400 140 L 400 300 L 0 300 Z" fill="#6ee7b7" opacity="0.8" />
        
        {/* Small cleared brown plot (perfectly legal / minor footprint) */}
        {isAfter && (
          <rect x="250" y="80" width="35" height="25" rx="2" fill="#d97706" opacity="0.75" />
        )}

        {/* Overlays (Extremely tiny because low threat) */}
        {isAfter && showVegLoss && (
          <rect 
            x="248" 
            y="78" 
            width="39" 
            height="29" 
            fill="rgba(244, 63, 94, 0.15)" 
            stroke="#f43f5e" 
            strokeWidth="1.2" 
            strokeDasharray="2,2"
            style={{ opacity: opacity / 100 }}
          />
        )}

        <rect width="400" height="300" fill="url(#grid)" pointerEvents="none" />
        <line x1="20" y1="280" x2="60" y2="280" stroke="#ffffff" strokeWidth="2" />
        <text x="20" y="274" fill="#ffffff" fontSize="8" fontFamily="monospace">100m</text>
      </svg>
    );
  }
}
