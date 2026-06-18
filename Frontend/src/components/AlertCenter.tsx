import React, { useState } from 'react';
import { Alert, ThreatLevel, Case } from '../types';
import { 
  ShieldAlert, AlertCircle, CheckCircle2, Clock, UserCheck, 
  FileText, Search, CheckCircle, Flame, Send, ArrowUpRight, AlertTriangle, ShieldCheck, Lock, Activity, Eye, Shield, HelpCircle, ArrowRight
} from 'lucide-react';
import { useArmorIQ, ArmorIQTimeline, ArmorIQTooltip } from './ArmorIQ';
 
interface AlertCenterProps {
  alerts: Alert[];
  onUpdateAlert: (updatedAlert: Alert) => void;
  onViewReportOfZone: (zoneId: string) => void;
  cases?: Case[];
}
 
export default function AlertCenter({ alerts, onUpdateAlert, onViewReportOfZone, cases = [] }: AlertCenterProps) {
  const { triggerVerification, addAuditLog } = useArmorIQ();

  // Navigation active listing tabs
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'high' | 'pending' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Officer name input popup modal simulated
  const [assigningAlertId, setAssigningAlertId] = useState<string | null>(null);
  const [officerName, setOfficerName] = useState<string>('');

  // Interactive escalations state banners
  const [escalatedAlerts, setEscalatedAlerts] = useState<Record<string, boolean>>({});
  const [deployedAlerts, setDeployedAlerts] = useState<Record<string, boolean>>({});

  const officersList = [
    'DFO R. K. Shrivastava',
    'Forest Officer Amit Verma',
    'Officer Priya Sharma',
    'Ranger Sanjay Patil',
    'Inspector Vivek Yadav'
  ];

  // Action: Mark alert as resolved (Close Case)
  const handleResolveAlert = (alert: Alert) => {
    triggerVerification('Close Case', () => {
      const updated: Alert = { ...alert, status: 'Resolved' };
      onUpdateAlert(updated);
      addAuditLog('Close Case', `State incident at ${alert.locationName} closed. Restoration verified.`);
    });
  };

  // Action: Escalate threat priority (Escalate Case)
  const handleEscalateAlert = (alert: Alert) => {
    triggerVerification('Escalate Case', () => {
      const updated: Alert = { ...alert, priority: 'CRITICAL', status: 'Critical', riskScore: Math.min(100, alert.riskScore + 8) };
      onUpdateAlert(updated);
      setEscalatedAlerts(prev => ({ ...prev, [alert.id]: true }));
      addAuditLog('Escalate Case', `Escalated alert priority for ${alert.locationName} to regional state council.`);
    });
  };

  // Action: Deploy inspection team (Dispatch Team)
  const handleDeployTeam = (alert: Alert) => {
    triggerVerification('Dispatch Team', () => {
      setDeployedAlerts(prev => ({ ...prev, [alert.id]: true }));
      addAuditLog('Dispatch Team', `Mobilized tactical ranger survey squad to coordinates corresponding to ${alert.locationName}.`);
    });
  };

  // Action: Assign Officer (Assign Officer)
  const handleConfirmAssignment = (alertId: string, name: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      triggerVerification('Assign Officer', () => {
        const updated: Alert = { ...alert, assignedOfficer: name, status: alert.status === 'Pending' ? 'High' : alert.status };
        onUpdateAlert(updated);
        addAuditLog('Assign Officer', `Assigned Lead Officer ${name} to case coordinates registered at ${alert.locationName}.`);
      });
    }
    setAssigningAlertId(null);
  };

  // Filter lists based on selected tabs and search matches
  const filteredAlerts = alerts.filter(alert => {
    // 1. Tab filters
    if (activeFilter === 'critical' && alert.priority !== 'CRITICAL') return false;
    if (activeFilter === 'high' && alert.priority !== 'HIGH') return false;
    if (activeFilter === 'pending' && alert.status === 'Resolved') return false; 
    if (activeFilter === 'resolved' && alert.status !== 'Resolved') return false;

    // 2. Search matches
    const searchLow = searchTerm.toLowerCase();
    return (
      alert.locationName.toLowerCase().includes(searchLow) ||
      alert.type.toLowerCase().includes(searchLow) ||
      (alert.assignedOfficer && alert.assignedOfficer.toLowerCase().includes(searchLow))
    );
  });

  return (
    <div id="alert-operations-deck" className="max-w-7xl mx-auto px-6 py-6 space-y-6 font-mono text-slate-800 text-left">
      
      {/* Dynamic alert ticker header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5 select-none">
        <div>
          <span className="text-red-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-red-650 rounded-full animate-ping inline-block"></span>
            ENVIRONMENTAL COMPLIANCE PROTOCOL
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">National Compliance Incident Deck</h2>
          <p className="text-slate-500 text-xs font-light font-sans mt-0.5">
            Review active geospatial threat violations. Assign law enforcement officers, dispatch aerial warning teams, and escalate cases.
          </p>
        </div>

        {/* Search input field */}
        <div className="relative w-full max-w-xs font-sans">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search alerts by sector or agent..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all text-slate-700"
          />
        </div>
      </div>

      {/* Primary tab lists selector */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/40 pb-3 bg-transparent select-none text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.8 rounded-lg transition-all ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-teal-400 font-bold border border-slate-800'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-150'
          }`}
        >
          All Incident Feeds ({alerts.length})
        </button>
        <button
          onClick={() => setActiveFilter('critical')}
          className={`px-3.5 py-1.8 rounded-lg transition-all flex items-center gap-1.5 border ${
            activeFilter === 'critical'
              ? 'bg-red-950/80 border-red-500/30 text-red-400 font-extrabold'
              : 'text-red-650 border-transparent hover:bg-red-50'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
          Critical Priorities ({alerts.filter(a => a.priority === 'CRITICAL').length})
        </button>
        <button
          onClick={() => setActiveFilter('high')}
          className={`px-3.5 py-1.8 rounded-lg transition-all flex items-center gap-1.5 border ${
            activeFilter === 'high'
              ? 'bg-amber-950/80 border-amber-500/30 text-amber-500 font-bold'
              : 'text-amber-600 border-transparent hover:bg-amber-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          High Threats ({alerts.filter(a => a.priority === 'HIGH').length})
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-3.5 py-1.8 rounded-lg transition-all ${
            activeFilter === 'pending'
              ? 'bg-slate-800 text-slate-100 font-bold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          Pending Actions ({alerts.filter(a => a.status !== 'Resolved').length})
        </button>
        <button
          onClick={() => setActiveFilter('resolved')}
          className={`px-3.5 py-1.8 rounded-lg transition-all flex items-center gap-1.5 border ${
            activeFilter === 'resolved'
              ? 'bg-teal-950/80 border-teal-500/20 text-teal-400 font-bold'
              : 'text-teal-600 border-transparent hover:bg-teal-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Resolved Cases ({alerts.filter(a => a.status === 'Resolved').length})
        </button>
      </div>

      {/* 2-Column Dashboard Layout with left ArmorIQ status column and right alerts deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: ArmorIQ Control Deck & Timeline Dashboard (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <AlertCenterArmorIQSecurityCard />
          <AlertCenterWorkflowVisualization />
          <ArmorIQTimeline />
        </div>

        {/* Right Column: Active Incident Cards Feed List (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            {filteredAlerts.length === 0 ? (
              <div className="col-span-full py-16 bg-white rounded-xl border border-slate-200 flex flex-col items-center text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-teal-500 animate-bounce" />
                <div className="space-y-1">
                  <h3 className="font-sans font-extrabold text-slate-800 text-base">System Baseline Compliance Clear</h3>
                  <p className="text-slate-500 text-xs font-light max-w-sm">No alert incidents match the current compliance filters. Satellite sweeps indicate standard baselines.</p>
                </div>
              </div>
            ) : (
              filteredAlerts.map(alert => {
                const isCritical = alert.priority === 'CRITICAL';
                const isEscalatedRisk = alert.riskScore > 85;
                const isHigh = alert.priority === 'HIGH';
                const isResolved = alert.status === 'Resolved';
                const matchingCase = cases.find(c => c.zoneId === alert.zoneId);

                return (
                  <div
                    key={alert.id}
                    className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden ${
                      isCritical && !isResolved
                        ? 'border-red-300/80 hover:border-red-650'
                        : isHigh && !isResolved
                        ? 'border-orange-300 hover:border-orange-500'
                        : 'border-slate-200 hover:border-slate-350'
                    }`}
                  >
                    {/* Lateral sidebar color indicators */}
                    <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                      isResolved ? 'bg-teal-500' : isCritical ? 'bg-red-500 animate-pulse' : 'bg-orange-500'
                    }`} />

                    <div className="space-y-4 pl-1 flex-1 flex flex-col">
                      
                      {/* Top line with Timestamp and status */}
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-[10px] text-slate-400 font-bold">{alert.timestamp}</span>
                        <span className={`text-[9px] font-black py-0.5 px-2 rounded-full border ${
                          isResolved
                            ? 'bg-teal-50 text-teal-600 border-teal-200'
                            : isCritical
                            ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                            : 'bg-orange-50 text-orange-600 border-orange-200'
                        }`}>
                          {isResolved ? 'RESOLVED' : `${alert.priority} DETECTED`}
                        </span>
                      </div>

                      {/* Header Title with coordinates */}
                      <div className="space-y-1">
                        <h3 className="font-sans font-extrabold text-slate-800 text-sm truncate uppercase tracking-tight">
                          {alert.locationName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-500">
                          <span className="bg-slate-100 px-1.5 py-0.5 border border-slate-200 rounded text-slate-700 font-bold">{alert.type}</span>
                          <span>GPS: {alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}</span>
                        </div>
                      </div>

                      {/* Incident Findings description */}
                      <p className="text-slate-600 text-xs font-light leading-relaxed font-sans flex-1">
                        {alert.findings}
                      </p>

                      {/* ALERT ESCALATION ENGINE FOR RISK > 85 */}
                      {isEscalatedRisk && !isResolved && (
                        <div className="p-3 bg-red-950/90 border border-red-500/30 text-white rounded-xl space-y-2 font-mono animate-fadeIn">
                          <div className="flex items-center gap-1 text-red-400 font-black text-[9px] uppercase tracking-widest banner">
                            <Flame className="w-3.5 h-3.5 text-red-500 animate-bounce" />
                            CRITICAL THREAT REGISTRATION (RISK: {alert.riskScore}%)
                          </div>

                          {/* AI Recommended Actions */}
                          <div className="space-y-1 text-[9px] text-slate-300">
                            <p className="font-bold text-slate-200">Recommended Actions:</p>
                            <p>&bull; Draft emergency cease-and-desist mandates</p>
                            <p>&bull; Target coordinating ranger enforcement squads</p>
                            <p>&bull; Route emergency report to MoEFCC Regional Desk</p>
                          </div>

                          {/* Interactive engine control triggers */}
                          <div className="pt-2 border-t border-red-900/40 grid grid-cols-1 gap-1.5 text-[8px]">
                            <button
                              onClick={() => handleEscalateAlert(alert)}
                              className="w-full bg-red-600 hover:bg-red-500 text-white py-1 px-1.5 rounded font-bold uppercase transition-all cursor-pointer"
                            >
                              {escalatedAlerts[alert.id] ? 'State Authority Notified' : 'Escalate to State Forest Department'}
                            </button>
                            <button
                              onClick={() => handleDeployTeam(alert)}
                              className="w-full bg-slate-800 hover:bg-slate-700 text-teal-400 py-1 px-1.5 rounded font-bold uppercase transition-all border border-slate-700 cursor-pointer"
                            >
                              {deployedAlerts[alert.id] ? 'Inspection Force En-Route' : 'Deploy Inspection Team'}
                            </button>
                            <button
                              onClick={() => onViewReportOfZone(alert.zoneId)}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 py-1 px-1.5 rounded font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              Generate Emergency Report <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Case Association Metadata */}
                      {matchingCase && (
                        <div className="flex items-center justify-between bg-blue-50/70 border border-blue-150 p-2.5 rounded-lg text-xs select-none">
                          <div className="flex items-center gap-1.5 font-mono">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span className="font-bold text-slate-700">Case ID:</span>
                            <span className="text-blue-700 font-bold">{matchingCase.caseId}</span>
                          </div>
                          <span className={`text-[9.5px] font-black py-0.5 px-2 rounded-full border ${
                            matchingCase.status === 'Resolved'
                              ? 'bg-teal-50 text-teal-600 border-teal-200'
                              : matchingCase.status === 'Under Investigation'
                              ? 'bg-indigo-50 text-indigo-600 border-indigo-200 animate-pulse'
                              : matchingCase.status === 'Inspection Scheduled'
                              ? 'bg-amber-50 text-amber-600 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {matchingCase.status.toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* Officer assigned row */}
                      {alert.assignedOfficer ? (
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-xs justify-start select-none">
                          <UserCheck className="w-4 h-4 text-slate-500" />
                          <div>
                            <span className="text-[9px] font-mono text-slate-400 block uppercase">ASSIGNED OFFICER</span>
                            <span className="font-bold text-slate-700 font-mono">{alert.assignedOfficer}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-yellow-50/50 border border-yellow-200 p-2.5 rounded-lg text-xs text-slate-600 select-none">
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />
                            <span className="font-semibold">Unassigned Incident post</span>
                          </div>
                        </div>
                      )}

                      {/* Agent Notes Timeline list updates */}
                      {alert.notes && alert.notes.length > 0 && (
                        <div className="border-t border-slate-100 pt-3 space-y-1 text-left font-mono">
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Agent Dispatch log:</span>
                          {alert.notes.map((note, i) => (
                            <div key={i} className="text-[10px] text-slate-500 flex items-start gap-1">
                              <span className="text-slate-400 select-none">&bull;</span>
                              <span>{note}</span>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>

                    {/* Operations action trigger deck */}
                    <div className="pt-4 mt-5 border-t border-slate-150 pl-1 flex flex-wrap items-center justify-between gap-2.5 select-none text-[11px] font-mono">
                      
                      {/* View Report linked click */}
                      <button
                        onClick={() => onViewReportOfZone(alert.zoneId)}
                        className="flex items-center gap-1 bg-teal-50 hover:bg-teal-150 border border-teal-200 text-teal-700 px-2.5 py-1.5 rounded-md font-bold transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Compliance Report</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {/* Action: Resolve */}
                        {!isResolved && (
                          <button
                            onClick={() => handleResolveAlert(alert)}
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 text-emerald-700 font-bold px-2.5 py-1.5 rounded-md transition-all cursor-pointer"
                          >
                            Resolve
                          </button>
                        )}

                        {/* Action: Assign Officer */}
                        {!isResolved && (
                          <div className="relative">
                            <button
                              onClick={() => setAssigningAlertId(assigningAlertId === alert.id ? null : alert.id)}
                              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer"
                            >
                              Assign...
                            </button>

                            {assigningAlertId === alert.id && (
                              <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-slate-200 shadow-xl rounded-lg z-30 p-2 space-y-1">
                                <span className="text-[8px] text-slate-400 block uppercase p-1 font-bold">Assign Officer:</span>
                                {officersList.map((off, oIdx) => (
                                  <button
                                    key={oIdx}
                                    onClick={() => handleConfirmAssignment(alert.id, off)}
                                    className="w-full text-left p-1 text-[11px] text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded transition-colors cursor-pointer"
                                  >
                                    {off}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action: Escalate */}
                        {!isResolved && !isCritical && (
                          <button
                            onClick={() => handleEscalateAlert(alert)}
                            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-750 font-bold px-2.5 py-1.5 rounded-md transition-all cursor-pointer"
                          >
                            Escalate
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

// Sub-component: ArmorIQ Dedicated Security Status Card
function AlertCenterArmorIQSecurityCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden select-none space-y-4">
      {/* Decorative shield background watermark */}
      <div className="absolute right-[-15px] bottom-[-15px] opacity-10 pointer-events-none">
        <ShieldCheck className="w-28 h-28 text-emerald-405 text-emerald-400 animate-pulse" />
      </div>

      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-emerald-400">
            <Lock className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-black tracking-wider text-emerald-400 flex items-center gap-1.5 uppercase font-mono">
              ArmorIQ Security Status
              <ArmorIQTooltip text="ArmorIQ secures critical workflows through policy-gated execution and audit logging." />
            </h4>
            <span className="text-[9px] text-slate-500 font-mono block">ENFORCEMENT SANDBOX</span>
          </div>
        </div>

        <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.8 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></span>
          Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-left pt-1">
        <div>
          <span className="text-[9px] text-slate-400 font-mono uppercase tracking-widest block">ArmorIQ Status</span>
          <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Active</span>
          </span>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 font-mono uppercase tracking-widest block">Policy Compliance</span>
          <span className="text-xs font-bold text-teal-400 font-mono">100%</span>
        </div>
        <div className="col-span-2">
          <span className="text-[9px] text-slate-400 font-mono uppercase tracking-widest block">Audit Logging</span>
          <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
            Enabled
          </span>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-3 space-y-2 text-left">
        <span className="text-[9.5px] text-slate-400 font-mono uppercase tracking-wider block font-bold">Protected Actions:</span>
        <div className="grid grid-cols-2 gap-2 text-[10.5px] font-sans text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 text-xs font-extrabold">&#10003;</span>
            <span>Generate Report</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 text-xs font-extrabold">&#10003;</span>
            <span>Assign Officer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 text-xs font-extrabold">&#10003;</span>
            <span>Dispatch Team</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 text-xs font-extrabold">&#10003;</span>
            <span>Close Case</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component: Workflow Visualization
function AlertCenterWorkflowVisualization() {
  return (
    <div className="bg-slate-900 border border-slate-850 text-white rounded-2xl p-5 shadow-lg space-y-4 select-none">
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <h4 className="text-xs font-mono font-black tracking-widest text-teal-450 text-teal-400 uppercase flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          ARMORIQ WORKFLOW PATHWAY
        </h4>
        <span className="text-[8px] bg-slate-800 text-slate-400 font-mono py-0.5 px-1.5 rounded border border-slate-700 uppercase font-black">POLICIES ACTIVE</span>
      </div>

      {/* Beautiful step indicator pipeline */}
      <div className="space-y-4 select-none text-left font-mono">
        {[
          { step: '01', title: 'Satellite Analysis', desc: 'Continuous multi-spectral regional mapping sweeps.' },
          { step: '02', title: 'AI Detection', desc: 'Predictive canopy index and mining contour flagger.' },
          { step: '03', title: 'ArmorIQ Policy Engine', desc: 'Autonomous validation check & cryptographic seal.' },
          { step: '04', title: 'Case Creation', desc: 'Initial logging & assigning chronological case ID.' },
          { step: '05', title: 'Report Generation', desc: 'Signed, un-modifiable official dossier compile.' },
          { step: '06', title: 'Authority Action', desc: 'Ground rangers deploy and statutory case wrap.' }
        ].map((node, index, arr) => (
          <div key={node.step} className="flex items-start gap-4 relative">
            {/* Arrow connector */}
            {index < arr.length - 1 && (
              <div className="absolute left-3.5 top-7 bottom-0 w-[1.5px] bg-teal-500/25" />
            )}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 ${
              node.title === 'ArmorIQ Policy Engine' 
                ? 'bg-teal-500 text-white border-teal-400 shadow-md shadow-teal-500/10 ring-2 ring-teal-550/20'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}>
              {node.step}
            </div>
            <div className="-space-y-0.5">
              <h5 className={`text-xs font-extrabold ${node.title === 'ArmorIQ Policy Engine' ? 'text-teal-450 text-teal-400 font-black' : 'text-slate-200'}`}>
                {node.title}
              </h5>
              <p className="text-[10px] text-slate-400 font-sans leading-normal font-light">
                {node.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
