import React, { useState } from 'react';
import { Settings, Save, ShieldAlert, Sliders, Bell, Users, Cpu, FileClock, CheckCircle } from 'lucide-react';
import { mockDefaultSettings } from '../data/mockData';

export default function SettingsPage() {
  const [confidence, setConfidence] = useState<number>(mockDefaultSettings.confidenceThreshold);
  const [autoEscalate, setAutoEscalate] = useState<boolean>(mockDefaultSettings.autoEscalation);
  const [alertCriticalOnly, setAlertCriticalOnly] = useState<boolean>(mockDefaultSettings.alertOnCriticalOnly);
  const [satelliteInterval, setSatelliteInterval] = useState<string>(mockDefaultSettings.satelliteRefreshInterval);

  // Integrations state
  const [radarSync, setRadarSync] = useState<boolean>(mockDefaultSettings.integrations.sentinelRadar);
  const [thermalSync, setThermalSync] = useState<boolean>(mockDefaultSettings.integrations.landsatThermal);
  const [authoritySync, setAuthoritySync] = useState<boolean>(mockDefaultSettings.integrations.authorityAlerts);

  const [savedStatus, setSavedStatus] = useState<boolean>(false);

  // Handle Save settings action
  const handleSaveSettings = () => {
    setSavedStatus(true);
    setTimeout(() => {
      setSavedStatus(false);
    }, 2000);
  };

  const usersList = [
    { name: 'Saurabh Gupta', role: 'Chief Compliance Director (MoEFCC)', email: 'saurabhgupta1qz@gmail.com', clearance: 'LEVEL-4 COMMISSIONER' },
    { name: 'Dinesh Kumar', role: 'Joint Secretary (Forest Survey)', email: 'dinesh.k@nic.in', clearance: 'LEVEL-3 DIRECTOR' },
    { name: 'Sanjay Patil', role: 'Hasdeo Basin Range Forest Officer', email: 'sanjay.patil@cg.gov.in', clearance: 'LEVEL-2 RANGE OFFICER' }
  ];

  return (
    <div id="settings-ops-workspace" className="max-w-4xl mx-auto px-6 py-6 space-y-6 text-left">
      
      {/* Settings Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5 select-none">
        <div>
          <span className="font-mono text-xs text-teal-655 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-teal-600 animate-spin" />
            GEOWATCH ENVIRONMENTAL COMPLIANCE THRESHOLD
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Monitoring & Alert Configuration</h2>
          <p className="text-slate-500 text-xs font-light">
            Calibrate neural pipeline sensitivities, diagnostic thresholds, satellite sweeps, and authorized officer registries.
          </p>
        </div>

        {/* Save feedback banner */}
        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 bg-slate-900 hover:bg-teal-600 text-white font-sans text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Operations Configuration</span>
        </button>
      </div>

      {savedStatus && (
        <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-xl text-xs text-emerald-800 flex items-center gap-2 select-none animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span className="font-bold">SYSTEM DIAGNOSTICS APPLIED:</span> Monitoring configurations synchronized successfully across Sentinel-2 orbit controllers.
        </div>
      )}

      {/* Main Settings double panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        
        {/* PANEL A: NEURAL TIMELINE CALIBRATIONS */}
        <div className="space-y-6">
          
          {/* Calibrations sliders */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-850">
                Neural Threshold Calibration
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium select-none">
                  <span className="text-slate-700">AI Confidence Alert Cutoff</span>
                  <span className="font-mono font-bold text-teal-600">{confidence}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={confidence}
                  onChange={(e) => setConfidence(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Tolerates lower confidence alerts under {confidence}% if unchecked to preserve safety bounds.</span>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1 font-bold">
                  Satellite Ortho Sweep Cadence
                </label>
                <select
                  value={satelliteInterval}
                  onChange={(e) => setSatelliteInterval(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold"
                >
                  <option value="Hourly">Hourly Sub-orbit Sweeps (Real-time)</option>
                  <option value="Daily">Daily Mosaic Overlays (Standard)</option>
                  <option value="Weekly">Weekly Baseline Compiling</option>
                </select>
              </div>
            </div>
          </div>

          {/* Core pipeline triggers */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bell className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-850">
                Automation & Alert Dispatches
              </h3>
            </div>

            <div className="space-y-3.5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoEscalate}
                  onChange={(e) => setAutoEscalate(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-550"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-750 block">Auto-Escalate Critical Threats</span>
                  <span className="text-slate-500 leading-normal block">Automatically trigger priority compliance notices to District Forest Officers if risk exceeds 85%.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertCriticalOnly}
                  onChange={(e) => setAlertCriticalOnly(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-550"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-750 block">Restrict Dispatches to Critical Categories</span>
                  <span className="text-slate-500 leading-normal block">Silence warnings beneath high index levels to minimize pager fatigue for field inspectors.</span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* PANEL B: INTEGRATED CONST CONTEXTS & USERS */}
        <div className="space-y-6">
          
          {/* Active Sensor Constellation Swaps */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Cpu className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                Sensor Constellation Syncing
              </h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100 cursor-pointer text-xs">
                <div>
                  <span className="font-bold text-slate-700 block">Sentinel-1 C-Band Radar Sweep</span>
                  <span className="text-[10px] text-slate-400">Allows cloud penetrating SAR backscatter analyses.</span>
                </div>
                <input
                  type="checkbox"
                  checked={radarSync}
                  onChange={(e) => setRadarSync(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100 cursor-pointer text-xs">
                <div>
                  <span className="font-bold text-slate-700 block">Landsat-9 Thermal Infrared Sync</span>
                  <span className="text-[10px] text-slate-400">Maps nighttime smelting heat indices.</span>
                </div>
                <input
                  type="checkbox"
                  checked={thermalSync}
                  onChange={(e) => setThermalSync(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100 cursor-pointer text-xs">
                <div>
                  <span className="font-bold text-slate-700 block">Local Authority Agency Sync</span>
                  <span className="text-[10px] text-slate-400">Hooks directly to State Forest Department alerts.</span>
                </div>
                <input
                  type="checkbox"
                  checked={authoritySync}
                  onChange={(e) => setAuthoritySync(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600"
                />
              </label>
            </div>
          </div>

          {/* User management logs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Users className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                Authorized Officers & Clearance
              </h3>
            </div>

            <div className="space-y-3">
              {usersList.map((user, uIdx) => (
                <div key={uIdx} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-bold text-slate-800">{user.name}</div>
                    <div className="text-[10px] text-slate-500">{user.role} &bull; {user.email}</div>
                  </div>
                  <span className="bg-slate-200 p-1 px-1.8 font-mono text-[8px] font-black rounded border border-slate-300 whitespace-nowrap">
                    {user.clearance}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
