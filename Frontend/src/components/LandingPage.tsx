import { motion } from 'motion/react';
import { ShieldAlert, Cpu, ArrowRight, Activity, Layers, DownloadCloud, Radio, Users, CheckCircle, Flame, Eye, Globe, Split } from 'lucide-react';
import Earth3D from './Earth3D';
import { MonitoringZone } from '../types';

interface LandingPageProps {
  onLaunchDashboard: (selectedZone?: MonitoringZone) => void;
  onWatchDemo: () => void;
  onLaunchComparison?: () => void;
}

export default function LandingPage({ onLaunchDashboard, onWatchDemo, onLaunchComparison }: LandingPageProps) {
  // Planetary/National environmental challenges localized to Indian hotspots
  const challenges = [
    {
      title: 'Sonbhadra Coal Belt Quarrying',
      icon: <Activity className="w-5 h-5 text-amber-500" />,
      risk: 'CRITICAL',
      riskColor: 'text-red-500 bg-red-500/10 border-red-500/20',
      description: 'Illegal excavating and coal pit spillages. Uncontrolled granite/silica dust discharges, inducing topsoil stripping and active riparian reservoir silt load.',
      threatIndex: 'UP / Jharkhand Coal Siltation Boundary',
      visualRef: 'RGB Spectrum Delta + NIR Shift'
    },
    {
      title: 'Hasdeo Forest Canopy Stripping',
      icon: <Flame className="w-5 h-5 text-red-500" />,
      risk: 'HIGH',
      riskColor: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
      description: 'Pristine timber felling bordering critical tiger/elephant migratory routes. High-contrast canopy degradation signs detected under heavy cloud cover.',
      threatIndex: 'Chhattisgarh Surguja Division',
      visualRef: 'SAR L-Band Backscatter Anomalies'
    },
    {
      title: 'Aravalli Range Encroachment',
      icon: <Layers className="w-5 h-5 text-cyan-500" />,
      risk: 'HIGH',
      riskColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      description: 'Slow-motion resort construction and illegal stone quarrying inside protected buffer circles, Haryana-Rajasthan border. Violation of Supreme Court ESZ mandates.',
      threatIndex: 'Sariska & Gurugram Buffer Zones',
      visualRef: 'Optical NDVI Temporal Variance'
    },
    {
      title: 'Western Ghats Habitat Destruction',
      icon: <ShieldAlert className="w-5 h-5 text-indigo-500" />,
      risk: 'CRITICAL',
      riskColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      description: 'Illegal road cutting on vulnerable landslide-prone slopes near reserve areas. Complete soil destabilization and unauthorized commercial layout construction.',
      threatIndex: 'Western Ghats Conservation Corridor',
      visualRef: 'Multi-Sensor Normalized Mud Indices'
    }
  ];

  // Pipeline workflow indices
  const steps = [
    { number: '01', label: 'GPS Coordinate Query', sub: 'Input Indian survey boundaries' },
    { number: '02', label: 'Satellite Multi-Sensor Sweep', sub: 'Optical (Sentinel-2) + Radar Backscatter' },
    { number: '03', label: 'Canopy AI Segmenting', sub: 'Automated forest floor delta classification' },
    { number: '04', label: 'Ecological Damage Scoring', sub: 'Mathematical risk and compliance indexing' },
    { number: '05', label: 'MoEFCC Compliance Stamp', sub: 'Approved regulatory audit record generation' },
    { number: '06', label: 'Field Officer Dispatch', sub: 'Instant compliance warnings sent to DFO desk' }
  ];

  return (
    <div className="w-full bg-[#f8fafc] text-slate-900 pb-16 overflow-x-hidden">
      {/* 1. HERO MAIN STACK */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 border-b border-slate-100 bg-gradient-to-b from-slate-100/50 via-white to-[#f8fafc]">
        {/* Subtle background decorative grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
          {/* Hero text */}
          <div className="flex flex-col text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-700 px-3 py-1.5 rounded-full border border-teal-500/25 text-xs font-mono font-bold tracking-wider max-w-max">
              <Radio className="w-3.5 h-3.5 animate-pulse text-teal-600" />
              ENVIRONMENTAL COMPLIANCE ENGINE v3.4
            </div>

            <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-[54px] leading-[1.08] text-slate-900 tracking-tight">
              India's Environmental <br />
              <span className="bg-gradient-to-r from-teal-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">Intelligence & Compliance</span> Platform
            </h1>

            <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed max-w-xl">
              Monitor forest canopy loss, illegal mining belts, and municipal encroachments in real-time. Built to empower State Forest Departments, SPCB officers, and central regulatory administrators with courtroom-grade geospatial verification.
            </p>

            {/* Launch CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => onLaunchDashboard()}
                className="group flex items-center justify-center gap-2.5 px-7 py-4 bg-slate-900 hover:bg-teal-600 text-white font-sans text-sm font-semibold rounded-xl shadow-lg hover:shadow-teal-500/20 transition-all duration-300 cursor-pointer"
              >
                Launch Situation Console
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onWatchDemo}
                className="flex items-center justify-center gap-2 px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 font-sans text-xs font-semibold rounded-xl border border-slate-200/80 shadow-sm transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                Live Demo Simulation
              </button>
            </div>

            {/* Micro Metrics Section */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-1 pt-6 border-t border-slate-200/60">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">420k+</div>
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-relaxed">Sq KM Monitored</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">95.4%</div>
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-relaxed">Validation Accuracy</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">24-Hr</div>
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-relaxed">Sentinel passes</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">85+</div>
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-relaxed">Active Districts</div>
              </div>
            </div>
          </div>

          {/* Glowing Space Earth Panel */}
          <div className="relative w-full aspect-square max-w-[500px] lg:max-w-none mx-auto flex items-center justify-center">
            {/* Ambient circular back-beams */}
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-[#ff007f]/0 rounded-full blur-3xl" />
            <div className="w-full h-full relative cursor-col-resize">
              <Earth3D onSelectZone={onLaunchDashboard} selectedZone={null} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM/THREAT DECK */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-14">
          <span className="font-mono text-xs text-teal-600 font-bold uppercase tracking-widest">ECOLOGICAL CRITICAL VECTORS</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Autonomous Regional Sentinel Scans</h2>
          <p className="text-slate-600 text-sm font-light leading-relaxed">
            Integrating Sentinel-2 optical bands and Sentinel-1 SAR radar backscattering, running daily forest canopy segmenters and terrain elevation delta checks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {challenges.map((card, i) => (
            <div
              key={i}
              className="group bg-white p-6 rounded-2xl border border-slate-200/50 hover:border-teal-500/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-teal-500/5 transition-colors">
                    {card.icon}
                  </div>
                  <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full border ${card.riskColor}`}>
                    {card.risk} RISK
                  </span>
                </div>

                <h3 className="font-sans font-bold text-base text-slate-900 group-hover:text-teal-600 transition-colors text-left">
                  {card.title}
                </h3>

                <p className="text-slate-500 text-xs font-light leading-relaxed text-left">
                  {card.description}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 space-y-1.5 text-left">
                <div className="text-[9px] text-slate-400 font-mono uppercase tracking-widest select-none font-bold">
                  REGULATORY ANALYSIS REFERENCE:
                </div>
                <div className="text-[10px] text-slate-600 font-mono font-bold tracking-tight">
                  {card.visualRef}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">
                  {card.threatIndex}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS FLOW */}
      <section className="bg-slate-900 text-white py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0e749020_0%,transparent_70%)]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-teal-400 font-bold uppercase tracking-widest">
              State-Level Compliance Datapath
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Sensing to Action Pipeline
            </h2>
            <p className="text-slate-400 text-sm font-light">
              How coordinate anomalies transit the processing nodes to generate MoEFCC-compliant legal notices and field dispatches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative">
            {/* Visual connector line between steps for tablet up */}
            <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-px bg-gradient-to-r from-teal-500 via-indigo-500 to-emerald-500 opacity-20 z-0" />

            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-3 relative z-10">
                <div className="relative flex items-center justify-center">
                  {/* Glowing background ring */}
                  <div className="absolute inset-0 bg-teal-400/10 rounded-full blur-md" />
                  <div className="w-14 h-14 bg-slate-800 border-2 border-slate-750 hover:border-teal-400 rounded-full flex items-center justify-center text-base font-mono font-bold text-teal-400 transition-colors shadow-lg">
                    {step.number}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-sans font-bold text-xs text-white tracking-tight">
                    {step.label}
                  </h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed max-w-[140px] mx-auto font-light">
                    {step.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick interactive dispatch actions */}
          <div className="mt-16 text-center max-w-md mx-auto p-6 bg-slate-800/80 border border-slate-700/50 rounded-2xl flex flex-col items-center">
            <Cpu className="w-8 h-8 text-teal-400 mb-3 animate-pulse" />
            <h3 className="font-mono font-bold text-xs text-teal-300 tracking-wider">SECURE AUDIT READINESS</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed my-2">
              All records generate timestamped, cryptographically validated compliance briefs perfectly ready for environment tribunals or district court litigation.
            </p>
            <button
              onClick={() => onLaunchDashboard()}
              className="mt-3 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white text-xs font-bold font-sans rounded-lg transition-all cursor-pointer"
            >
              Access Compliances Console
            </button>
          </div>
        </div>
      </section>

      {/* FEATURE SPOTLIGHT: ENVIRONMENTAL CHANGE ANALYSIS BANNER */}
      {onLaunchComparison && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 border border-slate-800 text-white relative overflow-hidden shadow-xl text-left">
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none hidden lg:flex items-center justify-center">
              <svg className="w-full h-full text-teal-400" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 10 50 L 90 50 M 50 10 L 50 90" stroke="currentColor" strokeWidth="0.5" />
                <rect x="35" y="35" width="30" height="30" stroke="currentColor" strokeWidth="2" strokeDasharray="1 2" />
              </svg>
            </div>

            <div className="max-w-2xl space-y-4 relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-300 font-mono text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-teal-500/20">
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping"></span>
                NEW DEPLOYMENT: MULTI-TEMPORAL IMAGERY COMPARATOR
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
                Environmental Change Analysis Engine
              </h2>
              
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Experience high-precision satellite-derived change overlays. Visualize canopy drop index metrics (Vegetation Loss), excavational quarry expands, road carvings, and environmental impact scoring side-by-side or using the interactive split slider.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={onLaunchComparison}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 hover:text-white text-xs font-black font-sans rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg hover:shadow-teal-500/10"
                >
                  <Split className="w-4 h-4" />
                  Try Satellite Comparison Delta
                </button>
                <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px] pl-2">
                  <span>SATELLITE COMP_REF: SEC-9 // HASDEO FOREST STABLE TEST_DECK</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. REAL PRODUCT VALIDATION BANNER */}
      <section className="bg-slate-50 border-t border-slate-200/50 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          <div className="space-y-2 max-w-2xl">
            <h3 className="font-sans font-extrabold text-lg text-slate-900">
              Trusted by State Forest Departments and Local Environmental Authorities
            </h3>
            <p className="text-slate-600 text-xs font-light leading-relaxed">
              Our automated models align with FSI (Forest Survey of India) classification scales and standard satellite imagery pipelines, and are updated over standard public pass cadences.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono text-xs">
            <div className="flex items-center gap-1.5 select-none bg-white py-1.5 px-3.5 border border-slate-200 rounded text-slate-500 font-semibold text-[10px]">
              <CheckCircle className="w-3.5 h-3.5 text-teal-500" /> FSI SCALE COMPLIANT
            </div>
            <div className="flex items-center gap-1.5 select-none bg-white py-1.5 px-3.5 border border-slate-200 rounded text-slate-500 font-semibold text-[10px]">
              <CheckCircle className="w-3.5 h-3.5 text-teal-500" /> INDIA ESZ COMPATIBLE
            </div>
            <div className="flex items-center gap-1.5 select-none bg-white py-1.5 px-3.5 border border-slate-200 rounded text-slate-500 font-semibold text-[10px]">
              <CheckCircle className="w-3.5 h-3.5 text-teal-500" /> MoEFCC GUIDELINE ALIGNED
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
