import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Building, ShieldAlert, Calendar, Clock, MapPin, 
  Send, Users2, ShieldAlert as AlertIcon, CheckCircle2, ChevronRight, 
  HelpCircle, Eye, AlertTriangle, FileText, ClipboardList
} from 'lucide-react';
import { Case, ThreatLevel, AuditEvent } from '../types';
import { useArmorIQ, ArmorIQTimeline } from './ArmorIQ';
import { jsPDF } from 'jspdf';

interface InspectionOperationsProps {
  cases: Case[];
  activeCase: Case | null;
  onSelectCase: (caseId: string) => void;
  onUpdateCase: (updatedCase: Case) => void;
}

export default function InspectionOperations({ 
  cases, 
  activeCase, 
  onSelectCase, 
  onUpdateCase 
}: InspectionOperationsProps) {
  const { triggerVerification } = useArmorIQ();
  // Local form inputs
  const [assignedOfficer, setAssignedOfficer] = useState<string>('');
  const [assignedAgency, setAssignedAgency] = useState<string>('');
  const [assignedDistrict, setAssignedDistrict] = useState<string>('');
  const [expectedInspectionDate, setExpectedInspectionDate] = useState<string>('');
  const [priority, setPriority] = useState<ThreatLevel>('LOW');
  const [caseStatus, setCaseStatus] = useState<Case['status']>('Detected');

  const [dispatchStatusMsg, setDispatchStatusMsg] = useState<string | null>(null);

  // Sync inputs with activeCase when changed
  React.useEffect(() => {
    if (activeCase) {
      setAssignedOfficer(activeCase.assignedOfficer || '');
      setAssignedAgency(activeCase.assignedAgency || '');
      setAssignedDistrict(activeCase.assignedDistrict || '');
      setExpectedInspectionDate(activeCase.expectedInspectionDate || '');
      setPriority(activeCase.priority);
      setCaseStatus(activeCase.status);
    }
  }, [activeCase]);

  if (!activeCase) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center select-none font-mono text-slate-400">
        <ShieldAlert className="w-12 h-12 text-teal-600 mx-auto animate-pulse mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest text-slate-700">No Case Is Actively Targeted</p>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 font-sans">
          Select or trigger an active case from the National Situation Room or the monitoring interface to schedule compliance inspections.
        </p>
      </div>
    );
  }

  // Updates custom database parameter changes
   const handleApplyChanges = () => {
    triggerVerification('Save Parameters', () => {
      const updated: Case = {
        ...activeCase,
        assignedOfficer,
        assignedAgency,
        assignedDistrict,
        expectedInspectionDate,
        priority,
        status: caseStatus
      };
      onUpdateCase(updated);
      setDispatchStatusMsg('COMPLIANCE PARAMETERS UPDATED: Environmental metadata aligned to State Registry.');
      setTimeout(() => setDispatchStatusMsg(null), 3000);
    });
  };

  // Assign Forest Officer Workflow
  const handleAssignRanger = () => {
    if (!assignedOfficer) {
      alert('Please fill in or designate an Authorized Forest Officer.');
      return;
    }
    triggerVerification('Assign Officer', () => {
      const newEvent: AuditEvent = {
        event: 'Officer Assigned',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
        description: `Officially assigned ${assignedOfficer} (${assignedAgency || 'State Forest Department'}) as the dedicated forest/inspection officer in charge.`
      };
      const updated: Case = {
        ...activeCase,
        status: 'Assigned',
        assignedOfficer,
        assignedAgency: assignedAgency || 'State Forest Department',
        assignedDistrict: assignedDistrict || 'Forest Boundary Circle',
        auditTimeline: [newEvent, ...activeCase.auditTimeline]
      };
      onUpdateCase(updated);
      setDispatchStatusMsg(`OFFICER DESIGNATED: ${assignedOfficer} has been assigned as Lead Officer for Case ${activeCase.caseId}.`);
      setTimeout(() => setDispatchStatusMsg(null), 3000);
    });
  };

  // Schedule / Dispatch Field Inspection Workflow
  const handleDispatchTeam = () => {
    triggerVerification('Dispatch Team', () => {
      const dateStr = expectedInspectionDate || new Date().toISOString().split('T')[0];
      const newEvent: AuditEvent = {
        event: 'Field Verification Started',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
        description: `Joint environmental survey team deployed to site coordinates (${activeCase.lat.toFixed(4)}, ${activeCase.lng.toFixed(4)}) with laser-canopy scanners and water core collection protocols.`
      };
      const updated: Case = {
        ...activeCase,
        status: 'Inspection Scheduled',
        expectedInspectionDate: dateStr,
        auditTimeline: [newEvent, ...activeCase.auditTimeline]
      };
      onUpdateCase(updated);
      setDispatchStatusMsg(`FIELD SURVEY INITIATED: Verification squads mobilized toward ${activeCase.locationName}.`);
      setTimeout(() => setDispatchStatusMsg(null), 4000);
    });
  };

  // Take Action / Compliance Action taken workflow
  const handleActionTaken = () => {
    triggerVerification('Escalate Case', () => {
      const newEvent: AuditEvent = {
        event: 'Action Taken',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
        description: `Issued statutory show-cause notice and civil penalties under the Indian Forest Act and Water (Prevention & Control of Pollution) Act. Machinery seized, cease-work orders posted on site.`
      };
      const updated: Case = {
        ...activeCase,
        status: 'Under Investigation',
        auditTimeline: [newEvent, ...activeCase.auditTimeline]
      };
      onUpdateCase(updated);
      setDispatchStatusMsg(`COMPLIANCE ACTION DEPLOYED: Cease-and-desist mandates served at ${activeCase.locationName}.`);
      setTimeout(() => setDispatchStatusMsg(null), 4000);
    });
  };

  // Resoved Case workflow
  const handleResolveCase = () => {
    triggerVerification('Close Case', () => {
      const newEvent: AuditEvent = {
        event: 'Case Resolved',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
        description: `Verified complete evacuation of unauthorized encampments and quarries. Reforestation plan agreed. Statutory damages settled with State Treasury.`
      };
      const updated: Case = {
        ...activeCase,
        status: 'Resolved',
        auditTimeline: [newEvent, ...activeCase.auditTimeline]
      };
      onUpdateCase(updated);
      setDispatchStatusMsg(`SUCCESS: Compliance case ${activeCase.caseId} officially marked as RESOLVED & RESTORED.`);
      setTimeout(() => setDispatchStatusMsg(null), 4000);
    });
  };

  // Dynamic PDF report compilation for targeted case
  const handleGenerateReport = () => {
    triggerVerification('Generate Report', () => {
      setDispatchStatusMsg(`COMPILING CASE DOSSIER: Assembling physical geospatial signatures for Case ${activeCase.caseId}...`);
      
      setTimeout(() => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const margin = 15;
        const width = 210;
        const height = 297;
        let y = 18;

        // Draw structural double borders for elegant formal look
        doc.setDrawColor(13, 148, 136); // Teal-600 border accent
        doc.setLineWidth(1.5);
        doc.rect(8, 8, width - 16, height - 16);

        doc.setDrawColor(226, 232, 240); // Thin inner border
        doc.setLineWidth(0.5);
        doc.rect(9.5, 9.5, width - 19, height - 19);

        // Header section with brand and national authority
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(13, 148, 136); // Teal-600
        doc.text('GEOWATCH AI // GOVERNMENT ENVIRONMENT MONITORING PORTAL', margin, y);
        y += 6;

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text('STATUTORY CASE DOSSIER & REMEDIATION FILES', margin, y);
        y += 5;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text('PREPARED UNDER THE INDEPENDENT ENFORCEMENT SERVICES OF GEOWATCH AI PLATFORM', margin, y);
        y += 4;

        // Horizontal dividing line
        doc.setDrawColor(203, 213, 225); // Slate-300
        doc.setLineWidth(0.5);
        doc.line(margin, y, width - margin, y);
        y += 7;

        // I. COMPLIANCE PROFILE AND CASE TARGET DETAILS
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(13, 148, 136);
        doc.text('I. COMPLIANCE STATUS DETAILS AND GEOSPATIAL PARAMETERS', margin, y);
        y += 5;

        doc.setFillColor(248, 250, 252); // Slate-50 background for profile box
        doc.rect(margin, y, width - (margin * 2), 32, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, y, width - (margin * 2), 32, 'S');

        doc.setTextColor(15, 23, 42); // Slate-900
        let gridY = y + 5;
        
        // Column 1
        doc.setFont('Helvetica', 'bold');
        doc.text('Compliance Case ID:', margin + 4, gridY);
        doc.setFont('Helvetica', 'normal');
        doc.text(activeCase.caseId, margin + 42, gridY);

        // Column 2
        doc.setFont('Helvetica', 'bold');
        doc.text('Location Name:', margin + 96, gridY);
        doc.setFont('Helvetica', 'normal');
        doc.text(activeCase.locationName, margin + 124, gridY);
        gridY += 5.5;

        // Column 1
        doc.setFont('Helvetica', 'bold');
        doc.text('GPS Coordinates:', margin + 4, gridY);
        doc.setFont('Helvetica', 'normal');
        doc.text(`${activeCase.lat.toFixed(5)} N, ${activeCase.lng.toFixed(5)} E`, margin + 42, gridY);

        // Column 2
        doc.setFont('Helvetica', 'bold');
        doc.text('Risk Score / Index:', margin + 96, gridY);
        doc.setFont('Helvetica', 'normal');
        doc.text(`${activeCase.riskScore}% (${activeCase.priority} RISK)`, margin + 124, gridY);
        gridY += 5.5;

        // Column 1
        doc.setFont('Helvetica', 'bold');
        doc.text('Assigned Officer:', margin + 4, gridY);
        doc.setFont('Helvetica', 'normal');
        doc.text(activeCase.assignedOfficer || 'Not Allocated', margin + 42, gridY);

        // Column 2
        doc.setFont('Helvetica', 'bold');
        doc.text('Jurisdictional Agency:', margin + 96, gridY);
        doc.setFont('Helvetica', 'normal');
        doc.text(activeCase.assignedAgency || 'State Forest Department', margin + 124, gridY);
        gridY += 5.5;

        // Column 1
        doc.setFont('Helvetica', 'bold');
        doc.text('Current Status:', margin + 4, gridY);
        doc.setFont('Helvetica', 'normal');
        doc.text(activeCase.status.toUpperCase(), margin + 42, gridY);

        // Column 2
        doc.setFont('Helvetica', 'bold');
        doc.text('Report Timestamp:', margin + 96, gridY);
        doc.setFont('Helvetica', 'normal');
        const currentReportTime = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        doc.text(currentReportTime, margin + 124, gridY);

        y += 38;

        // II. ENVIRONMENTAL IMPACT SUMMARY
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(13, 148, 136);
        doc.text('II. ECOLOGICAL DAMAGE ASSESSMENT SUMMARY', margin, y);
        y += 5;

        doc.setFillColor(254, 242, 242); // Rose-50 for hazard/risk impact box
        doc.rect(margin, y, width - (margin * 2), 24, 'F');
        doc.setDrawColor(254, 205, 205);
        doc.rect(margin, y, width - (margin * 2), 24, 'S');

        doc.setTextColor(15, 23, 42); 
        let impactY = y + 5;

        doc.setFont('Helvetica', 'bold');
        doc.text('Case Severity:', margin + 4, impactY);
        doc.setFont('Helvetica', 'normal');
        doc.text(`${activeCase.priority} priority environmental infraction`, margin + 46, impactY);
        impactY += 5;

        doc.setFont('Helvetica', 'bold');
        doc.text('Impacted Land:', margin + 4, impactY);
        doc.setFont('Helvetica', 'normal');
        doc.text(`${activeCase.areaImpacted} Hectares of ecologically sensitive terrain under review`, margin + 46, impactY);
        impactY += 5;

        doc.setFont('Helvetica', 'bold');
        doc.text('Damage Valuation:', margin + 4, impactY);
        doc.setFont('Helvetica', 'normal');
        doc.text(`${activeCase.estimatedDamage} located in ${activeCase.assignedDistrict || 'Designated Range'}`, margin + 46, impactY);

        y += 30;

        // III. GEOWATCH AI FINDINGS
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(13, 148, 136);
        doc.text('III. SATELLITE RADAR AND IMAGE COMPLIANCE FINDINGS', margin, y);
        y += 5;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        const splitFindings = doc.splitTextToSize(activeCase.findings, width - (margin * 2));
        doc.text(splitFindings, margin, y);
        y += (splitFindings.length * 4) + 5;

        // IV. CORRECTIVE ACTION
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(13, 148, 136);
        doc.text('IV. DIRECTED ENFORCEMENT & REMEDIATION STEPS', margin, y);
        y += 5;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        const splitAction = doc.splitTextToSize(activeCase.suggestedAction, width - (margin * 2));
        doc.text(splitAction, margin, y);
        y += (splitAction.length * 4) + 10;

        // Footnotes
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(6);
        doc.setTextColor(148, 163, 184);
        doc.text(`This document serves as an official environmental compliance assessment. Prepared in GeoWatch Real-Time Enforcer Terminal.`, margin, y);

        const timestampStr = new Date().toISOString().substring(0, 10);
        doc.save(`GeoWatch_CaseReport_${activeCase.caseId}_${timestampStr}.pdf`);
        setDispatchStatusMsg(`REPORT DOWNLOADED: Case dossier printed for ${activeCase.caseId}.`);
        setTimeout(() => setDispatchStatusMsg(null), 3000);
      }, 800);
    });
  };

  return (
    <div id="enforcement-ops-dispatch" className="max-w-7xl mx-auto px-6 py-8 space-y-6 font-mono text-slate-800 text-left">
      
      {/* 1. DISPATCH HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-teal-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-teal-600 animate-pulse" />
            INDIAN ENVIRONMENTAL LAW COMPLIANCE & DISPATCH CENTRE
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Inspection Assignment & Remediation</h2>
          <p className="text-slate-500 text-xs font-light leading-snug mt-0.5">
            Coordinate Forestry Officers, execute environmental warrants, schedule audits, verify field anomalies, and resolve violations.
          </p>
        </div>

        {/* Case Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">TARGET CASE:</span>
          <select 
            value={activeCase.caseId}
            onChange={(e) => onSelectCase(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-teal-400 font-bold text-xs py-2 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 shadow cursor-pointer font-mono"
          >
            {cases.map((c) => (
              <option key={c.caseId} value={c.caseId}>
                {c.caseId} ({c.locationName.substring(0, 20)}...)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DISPATCH TOAST FEEDBACK BANNERS */}
      {dispatchStatusMsg && (
        <div className="bg-slate-950 text-emerald-400 border border-slate-850 p-4 rounded-xl text-xs flex items-center gap-3 select-none animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-teal-450 animate-bounce text-teal-400" />
          <div>
            <span className="font-bold text-slate-100">COMPLIANCE INTELLIGENCE SYSTEM NOTICE:</span>
            <p className="text-[11px] text-slate-300 mt-0.5 font-sans font-light">{dispatchStatusMsg}</p>
          </div>
        </div>
      )}

      {/* 2. CASE DETAIL GRID CONTROLLER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
        
        {/* PANEL A: OPERATIONAL CASE ATTRIBUTES (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            
            {/* Case Overview Metrics Strip */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 select-none">
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 px-3 py-1 rounded text-[11px] font-mono font-bold text-teal-400">
                  {activeCase.caseId}
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-bold tracking-tight">ECOLOGICAL VIOLATION</span>
              </div>
              <span className={`text-[10px] font-bold py-1 px-3.5 rounded-full ${
                activeCase.priority === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {activeCase.priority} RISK SEVERITY
              </span>
            </div>

            {/* VISUAL STEPS STEPPER */}
            <div className="py-2 select-none border-b border-slate-100 pb-5">
              <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-widest block mb-4">COMPLIANCE LIFECYCLE PROGRESS STEPPER</span>
              <div className="flex items-center justify-between relative w-full px-2">
                {/* Horizontal progress bar */}
                <div className="absolute left-6 right-6 top-4 h-[2px] bg-slate-100 -z-10" />
                <div 
                  className="absolute left-6 top-4 h-[2px] bg-teal-500 transition-all duration-500 -z-10" 
                  style={{
                    width: `${
                      activeCase.status === 'Detected' ? '0%' :
                      activeCase.status === 'Assigned' ? '25%' :
                      activeCase.status === 'Inspection Scheduled' ? '50%' :
                      activeCase.status === 'Under Investigation' ? '75%' : '100%'
                    }`
                  }}
                />

                {/* Steps */}
                {(['Detected', 'Assigned', 'Inspection Scheduled', 'Under Investigation', 'Resolved'] as Case['status'][]).map((step, idx, arr) => {
                  const stepLabels: Record<Case['status'], string> = {
                    'Detected': 'Detected',
                    'Assigned': 'Assigned',
                    'Inspection Scheduled': 'Scheduled',
                    'Under Investigation': 'Investigating',
                    'Resolved': 'Resolved'
                  };
                  const isActive = activeCase.status === step;
                  const isCompleted = arr.indexOf(activeCase.status) >= idx;

                  return (
                    <div key={idx} className="flex flex-col items-center space-y-1.5 focus:outline-none">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 text-xs font-black font-mono shadow-sm ${
                        isActive
                          ? 'bg-teal-500 text-white border-teal-500 ring-4 ring-teal-100'
                          : isCompleted
                          ? 'bg-slate-900 text-teal-400 border-slate-900'
                          : 'bg-white text-slate-350 border-slate-200'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className={`text-[9.5px] uppercase font-bold tracking-tighter ${
                        isActive ? 'text-teal-600 font-extrabold' : isCompleted ? 'text-slate-700' : 'text-slate-350 font-normal'
                      }`}>
                        {stepLabels[step]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="text-left font-sans">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block font-mono">Location Segment</span>
                <span className="text-xs font-bold text-slate-850 block truncate">{activeCase.locationName}</span>
                <span className="text-[10px] text-slate-500 font-mono">{activeCase.lat.toFixed(4)}° N, {activeCase.lng.toFixed(4)}° E</span>
              </div>

              <div className="text-left font-mono">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Ecological Impact</span>
                <span className="text-xs font-black text-rose-600 block">{activeCase.estimatedDamage.split(' ')[0]} {activeCase.estimatedDamage.split(' ')[1]}</span>
                <span className="text-[10px] text-slate-500 font-sans">{activeCase.areaImpacted} Hectares Damaged</span>
              </div>

              <div className="text-left">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold font-mono block">Compliance Posture</span>
                <span className="text-xs font-bold block text-slate-800">{activeCase.status}</span>
                <span className="text-[10px] text-slate-500 font-sans">Audit Cadence: {activeCase.expectedResolutionTime}</span>
              </div>
            </div>

            {/* FSI & Regulatory Findings */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-widest">SATELLITE ANOMALY ANALYSIS & FINDINGS</span>
              <p className="text-xs text-slate-600 leading-relaxed font-light font-sans">{activeCase.findings}</p>
            </div>

            {/* Form inputs section for assign Forest Officers & Districts */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-800 tracking-wider">Environmental Regulatory Metadata Calibration</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Designated Forest Officer</label>
                  <input
                    type="text"
                    value={assignedOfficer}
                    onChange={(e) => setAssignedOfficer(e.target.value)}
                    placeholder="e.g. DFO R. K. Shrivastava"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Enforcing Division / Agency</label>
                  <input
                    type="text"
                    value={assignedAgency}
                    onChange={(e) => setAssignedAgency(e.target.value)}
                    placeholder="e.g. State Forest Department, CPCB"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Assigned Jurisdictional District</label>
                  <input
                    type="text"
                    value={assignedDistrict}
                    onChange={(e) => setAssignedDistrict(e.target.value)}
                    placeholder="e.g. Surguja District, Gurugram"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Planned Inspection Audit Date</label>
                  <input
                    type="date"
                    value={expectedInspectionDate}
                    onChange={(e) => setExpectedInspectionDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">MoEFCC Compliance Lifecycle Stage</label>
                  <select
                    value={caseStatus}
                    onChange={(e) => setCaseStatus(e.target.value as Case['status'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-teal-500 font-bold"
                  >
                    <option value="Detected">Detected (Autonomous Satellite Anomaly)</option>
                    <option value="Assigned">Assigned (Forest Officer Appointed)</option>
                    <option value="Inspection Scheduled">Inspection Scheduled (Field Team Dispatched)</option>
                    <option value="Under Investigation">Under Investigation (Action Taken / Penalties Served)</option>
                    <option value="Resolved">Resolved (Environmental Compliance Restored)</option>
                  </select>
                </div>

              </div>

              {/* Action buttons strip */}
              <div className="flex justify-between items-center pt-2 gap-4">
                <span className="text-[10px] text-slate-400 font-sans italic">Validate values before applying changes.</span>
                <button
                  onClick={handleApplyChanges}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold rounded-lg transition-colors border border-slate-800 cursor-pointer"
                >
                  Save Compliance Parameters
                </button>
              </div>

            </div>

          </div>

          {/* SATELLITE COMPARISON LAND USE PANEL */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 text-white">
            <h3 className="font-mono text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-3 select-none">
              <Eye className="w-4 h-4 text-teal-400" />
              Dynamic Spatial Impact Segment Comparison
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">PRE-DEVELOPMENT VEGETATION BASELINE</span>
                <div className="h-32 bg-slate-950 border border-slate-800 rounded flex items-center justify-center relative overflow-hidden select-none">
                  <svg className="w-full h-full opacity-40 shadow-inner" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="100" height="100" fill="#022c22" />
                    <circle cx="20" cy="40" r="18" fill="#047857" />
                    <circle cx="70" cy="30" r="22" fill="#065f46" />
                    <circle cx="45" cy="75" r="14" fill="#064e3b" />
                  </svg>
                  <span className="absolute text-[8px] bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded bottom-2 left-2 text-emerald-400 font-bold font-mono">CANOPY SCORE: 0.82 (Healthy)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider font-mono">DETECTED COMPLIANCE EXPOSURE ANOMALY</span>
                <div className="h-32 bg-slate-950 border border-slate-850 rounded flex items-center justify-center relative overflow-hidden select-none">
                  <svg className="w-full h-full opacity-40" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="100" height="100" fill="#2d1610" />
                    <circle cx="20" cy="40" r="10" fill="#450a0a" />
                    <rect x="50" y="45" width="30" height="25" fill="#7f1d1d" />
                    <line x1="10" y1="90" x2="90" y2="10" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                  </svg>
                  <span className="absolute text-[8px] bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded bottom-2 left-2 text-rose-500 font-bold font-mono">CANOPY LOSS: -45.1% (Critical)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* PANEL B: STATUTORY DISPATCH WORKFLOWS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">

          {/* CASE SUMMARY CARD */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 text-white relative overflow-hidden text-left shadow-lg select-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 font-black uppercase">CASE DOSSIER SUMMARY</span>
              <span className={`text-[9.5px] font-black font-mono py-0.5 px-2 rounded-full border ${
                activeCase.status === 'Resolved'
                  ? 'bg-teal-950 text-teal-400 border-teal-850'
                  : 'bg-rose-950 text-rose-400 border-rose-900/50'
              }`}>
                {activeCase.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans text-[11px]">Case ID:</span>
                <span className="font-bold text-teal-400 text-sm">{activeCase.caseId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans text-[11px]">Target Location:</span>
                <span className="font-bold text-slate-200 truncate max-w-[180px] text-right">{activeCase.locationName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans text-[11px]">Risk Score:</span>
                <span className="font-bold text-rose-400">{activeCase.riskScore}% severity</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans text-[11px]">Priority:</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  activeCase.priority === 'CRITICAL' ? 'bg-red-950/80 text-red-400 border border-red-900/40' : 'bg-amber-950/80 text-amber-500 border border-amber-900/40'
                }`}>{activeCase.priority}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans text-[11px]">Assigned Officer:</span>
                <span className="font-bold text-slate-300">{activeCase.assignedOfficer || 'Unassigned'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 select-none">
              COMPLIANCE INTERVENTION ACTIONS
            </h3>

            <p className="text-xs text-slate-500 font-sans leading-relaxed mb-4">
              Schedule site audit visits, designate authorized officers, or execute statutory fine & closure mandates instantly under environmental law.
            </p>

            <div className="space-y-4">
              
              {/* Assign Forest Officer button */}
              <button
                onClick={handleAssignRanger}
                className="w-full group bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-mono text-xs font-bold py-3.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-between text-left cursor-pointer"
              >
                <div>
                  <span className="block font-bold group-hover:text-teal-600 transition-colors">DESIGNATE FOREST OFFICER</span>
                  <span className="text-[10px] text-slate-500 font-light font-sans font-normal">Assign DFO as the dedicated legal lead</span>
                </div>
                <Users className="w-4 h-4 text-slate-500" />
              </button>

              {/* Schedule/Dispatch Field team button */}
              <button
                onClick={handleDispatchTeam}
                className="w-full group bg-slate-900 hover:bg-teal-600 hover:border-teal-500 border border-slate-950 text-white font-mono text-xs font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-between text-left cursor-pointer"
              >
                <div>
                  <span className="block font-black text-slate-140 group-hover:text-white">SCHEDULE FIELD VERIFICATION</span>
                  <span className="text-[10px] text-slate-400 font-normal group-hover:text-teal-100 font-sans">Mobilize survey teams to verify layout boundaries</span>
                </div>
                <Send className="w-4 h-4 text-teal-400 group-hover:text-white" />
              </button>

              {/* Execute Remediation action taken button */}
              <button
                onClick={handleActionTaken}
                className="w-full group bg-indigo-50 hover:bg-indigo-600 hover:text-white border border-indigo-100 text-indigo-800 font-mono text-xs font-bold py-3.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-between text-left cursor-pointer"
              >
                <div>
                  <span className="block font-bold">EXECUTE STATUTORY ACTION</span>
                  <span className="text-[10px] text-indigo-500/80 block font-normal font-sans group-hover:text-indigo-100">Serve cease-and-desist or impose fines</span>
                </div>
                <ClipboardList className="w-4 h-4 text-indigo-600 group-hover:text-white" />
              </button>

              {/* Secure compliance action button */}
              <button
                onClick={handleResolveCase}
                className="w-full group bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-100 text-emerald-800 font-mono text-xs font-bold py-3.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-between text-left cursor-pointer"
              >
                <div>
                  <span className="block font-bold">MARK AS COMPLIANT & RESOLVED</span>
                  <span className="text-[10px] text-emerald-600 block font-normal font-sans group-hover:text-emerald-100">Certify complete restoration and penalty settlement</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:text-white" />
              </button>

              {/* Generate Official dynamic PDF Report action button */}
              <button
                onClick={handleGenerateReport}
                className="w-full group bg-teal-50 hover:bg-teal-600 hover:text-white border border-teal-100 text-teal-805 font-mono text-xs font-bold py-3.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-between text-left cursor-pointer"
              >
                <div>
                  <span className="block font-bold">GENERATE OFFICIAL CASE REPORT</span>
                  <span className="text-[10px] text-teal-600 block font-normal font-sans group-hover:text-teal-100 font-normal">Compile multi-spectral environmental dossier PDF</span>
                </div>
                <FileText className="w-4 h-4 text-teal-650 group-hover:text-white" />
              </button>

            </div>

          </div>

          {/* ARMORIQ CRYPTOGRAPHIC TRUST TIMELINE */}
          <ArmorIQTimeline />

          {/* COMPLIANCE DIGITAL AUDIT TIMELINE */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2 flex items-center justify-between select-none">
              <span>DIGITAL AUDIT & COMPLIANCE TIMELINE</span>
              <span className="text-[8px] bg-emerald-100 text-emerald-800 border border-emerald-200 rounded px-1.5 font-bold uppercase font-sans py-0.5">SECURE AUDIT OK</span>
            </h3>

            <div className="relative border-l border-slate-300 pl-4 ml-2.5 space-y-4">
              {activeCase.auditTimeline && activeCase.auditTimeline.map((ev, evidx) => (
                <div key={evidx} className="relative text-xs">
                  {/* Timeline circle bullet */}
                  <span className="absolute -left-[22.5px] top-1 bg-slate-900 border border-slate-700 h-3 w-3 rounded-full flex items-center justify-center">
                    <span className="h-1.5 w-1.5 bg-teal-400 rounded-full" />
                  </span>
                  
                  <div className="font-bold text-slate-800 uppercase text-[10px] tracking-wide flex items-center gap-1.5 font-mono">
                    <span>{ev.event}</span>
                    <span className="text-slate-400 text-[8px] font-normal">{ev.timestamp}</span>
                  </div>
                  <p className="text-slate-500 text-[10px] leading-normal font-sans mt-0.5 font-light">
                    {ev.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
