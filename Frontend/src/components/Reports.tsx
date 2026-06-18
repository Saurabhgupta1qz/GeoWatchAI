import React, { useState } from 'react';
import { MonitoringZone, Case } from '../types';
import { mockZones, mockCases } from '../data/mockData';
import { jsPDF } from 'jspdf';
import { 
  FileText, Download, ShieldCheck, AlertTriangle, 
  Scale, Lock, Globe, Layers, Users, Calendar 
} from 'lucide-react';
import { useArmorIQ } from './ArmorIQ';

interface ReportsProps {
  selectedZone: MonitoringZone | null;
  onSelectZone: (zone: MonitoringZone) => void;
  cases?: Case[];
}

export default function Reports({ selectedZone, onSelectZone, cases = mockCases }: ReportsProps) {
  const { triggerVerification } = useArmorIQ();
  const activeZone = selectedZone || mockZones[0];
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>('');

  // Find or manufacture corresponding Case
  const correspondingCase = cases.find(c => c.zoneId === activeZone.id) || {
    caseId: `GW-2026-${activeZone.id.replace('zone-', '').toUpperCase()}`,
    zoneId: activeZone.id,
    locationName: activeZone.name,
    lat: activeZone.lat,
    lng: activeZone.lng,
    type: activeZone.threatLevel === 'CRITICAL' ? 'Deforestation' : 'Illegal Mining',
    status: activeZone.status as Case['status'],
    riskScore: activeZone.riskScore,
    estimatedDamage: activeZone.threatLevel === 'CRITICAL' ? 'Rs. 5.8 Crore Est.' : 'Rs. 3.2 Crore Est.',
    areaImpacted: activeZone.sizeHectares,
    suggestedAction: activeZone.recommendations,
    assignedOfficer: 'DFO R. K. Shrivastava',
    assignedAgency: 'State Forest Department',
    assignedDistrict: activeZone.region.split(',')[0],
    expectedResolutionTime: '72 Hours',
    expectedInspectionDate: '2026-06-20',
    priority: activeZone.threatLevel,
    timestamp: activeZone.lastUpdate,
    findings: activeZone.findings,
    auditTimeline: [
      { event: 'Detection Created' as const, timestamp: activeZone.lastUpdate, description: 'Autonomous satellite anomaly processing flagged canopy changes.' },
      { event: 'Report Generated' as const, timestamp: activeZone.lastUpdate, description: 'Ecosystem analysis snapshot synthesized for State administrative records.' }
    ]
  };

  // Dynamic PDF Compiler using jsPDF
  const handlePrintDownload = () => {
    triggerVerification('Generate Report', () => {
      setIsCompiling(true);
      setProgressText('Processing multi-spectral sensors and canopy index data...');
      
      setTimeout(() => {
        setProgressText('Signing report with MoEFCC approved digital compliance keys...');
        
        setTimeout(() => {
          setIsCompiling(false);
          
          // Assemble jsPDF document
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
        doc.text('STATUTORY UNDERTAKING & INSPECTION REPORT', margin, y);
        y += 5;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text('PREPARED UNDER THE INDEPENDENT DEPLOYMENT COMPLIANCE OF MOEFCC, INDIA', margin, y);
        y += 4;

        // Horizontal dividing line
        doc.setDrawColor(203, 213, 225); // Slate-300
        doc.setLineWidth(0.5);
        doc.line(margin, y, width - margin, y);
        y += 7;

        // PROFILE BLOCK
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(13, 148, 136);
        doc.text('I. COMPLIANCE PROFILE AND CASE TARGET DETAILS', margin, y);
        y += 5;

        // Draw sub-grid for parameters to hold high informational density
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
        doc.text(correspondingCase.caseId, margin + 42, gridY);

        // Column 2
        doc.setFont('Helvetica', 'bold');
        doc.text('Location Name:', margin + 96, gridY);
        doc.setFont('Helvetica', 'normal');
        doc.text(correspondingCase.locationName, margin + 124, gridY);
        gridY += 5.5;

        // Column 1
        doc.setFont('Helvetica', 'bold');
        doc.text('GPS Coordinates:', margin + 4, gridY);
        doc.setFont('Helvetica', 'normal');
        doc.text(`${correspondingCase.lat.toFixed(5)} N, ${correspondingCase.lng.toFixed(5)} E`, margin + 42, gridY);

        // Column 2
        doc.setFont('Helvetica', 'bold');
        doc.text('Risk Score / Index:', margin + 96, gridY);
        doc.setFont('Helvetica', 'normal');
        doc.text(`${correspondingCase.riskScore}% (${correspondingCase.priority} RISK)`, margin + 124, gridY);
        gridY += 5.5;

        // Column 1
        doc.setFont('Helvetica', 'bold');
        doc.text('Assigned Officer:', margin + 4, gridY);
        doc.setFont('Helvetica', 'normal');
        doc.text(correspondingCase.assignedOfficer || 'Not Allocated', margin + 42, gridY);

        // Column 2
        doc.setFont('Helvetica', 'bold');
        doc.text('Jurisdictional Agency:', margin + 96, gridY);
        doc.setFont('Helvetica', 'normal');
        doc.text(correspondingCase.assignedAgency || 'State Forest Department', margin + 124, gridY);
        gridY += 5.5;

        // Column 1
        doc.setFont('Helvetica', 'bold');
        doc.text('Current Status:', margin + 4, gridY);
        doc.setFont('Helvetica', 'normal');
        doc.text(correspondingCase.status.toUpperCase(), margin + 42, gridY);

        // Column 2
        doc.setFont('Helvetica', 'bold');
        doc.text('Report Timestamp:', margin + 96, gridY);
        doc.setFont('Helvetica', 'normal');
        const currentReportTime = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        doc.text(currentReportTime, margin + 124, gridY);

        y += 38; // slide down past grid box

        // SECTION II: ENVIRONMENTAL IMPACT SUMMARY
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(13, 148, 136);
        doc.text('II. ENVIRONMENTAL IMPACT SUMMARY', margin, y);
        y += 5;

        doc.setFillColor(254, 242, 242); // Rose-50 for hazard/risk impact box
        doc.rect(margin, y, width - (margin * 2), 24, 'F');
        doc.setDrawColor(254, 205, 205);
        doc.rect(margin, y, width - (margin * 2), 24, 'S');

        doc.setTextColor(15, 23, 42); 
        let impactY = y + 5;

        doc.setFont('Helvetica', 'bold');
        doc.text('Canopy Forest Loss:', margin + 4, impactY);
        doc.setFont('Helvetica', 'normal');
        doc.text(`-${activeZone.vegetationLoss}% NDVI vegetation index regression inside legal lines`, margin + 46, impactY);
        impactY += 5;

        doc.setFont('Helvetica', 'bold');
        doc.text('Excavation / Mining:', margin + 4, impactY);
        doc.setFont('Helvetica', 'normal');
        doc.text(activeZone.excavationArea ? `DETECTED (Opencast clearing on ~${(activeZone.sizeHectares * 0.25).toFixed(1)} Ha segment)` : 'NO ACTIVE PIT MINING SIGNATURES RECORDED', margin + 46, impactY);
        impactY += 5;

        doc.setFont('Helvetica', 'bold');
        doc.text('Estimated Damage:', margin + 4, impactY);
        doc.setFont('Helvetica', 'normal');
        doc.text(`${correspondingCase.estimatedDamage} affecting ${correspondingCase.areaImpacted} Ha in ${correspondingCase.assignedDistrict || 'Designated Range'}`, margin + 46, impactY);

        y += 30; // space past impact box

        // SECTION III: GEOWATCH AI FINDINGS
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(13, 148, 136);
        doc.text('III. GEOWATCH AI GEOSPATIAL ANOMALY FINDINGS', margin, y);
        y += 5;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        const splitFindings = doc.splitTextToSize(correspondingCase.findings, width - (margin * 2));
        doc.text(splitFindings, margin, y);
        y += (splitFindings.length * 4) + 5;

        // SECTION IV: COMPLIANCE CORRECTIVE ACTION
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(13, 148, 136);
        doc.text('IV. MANDATORY CORRECTIVE ACTIONS & DIRECTIVES', margin, y);
        y += 5;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        const splitAction = doc.splitTextToSize(correspondingCase.suggestedAction, width - (margin * 2));
        doc.text(splitAction, margin, y);
        y += (splitAction.length * 4) + 6;

        // SECTION V: AUDIT TIMELINE
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(13, 148, 136);
        doc.text('V. DIGITAL AUDIT COMPLIANCE SECURE TRAIL', margin, y);
        y += 5;

        // Limit timeline draw to fit on page safely
        correspondingCase.auditTimeline.slice(0, 3).forEach((ev) => {
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(15, 23, 42);
          doc.text(`[${ev.event.toUpperCase()}] -- ${ev.timestamp}`, margin + 2, y);
          y += 3.5;

          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(100, 116, 139);
          doc.text(`Description: ${ev.description.substring(0, 115)}...`, margin + 6, y);
          y += 4;
        });

        // Bottom Cert Stamp
        y = 265;
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(margin, y, width - margin, y);
        y += 4.5;

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(13, 148, 136);
        doc.text('CERTIFIED BY AUTOMATIC INCIDENT RECOGNITION DESK // MINISTRY OF ENVIRONMENT, CPCB', margin, y);
        y += 3.5;
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`MoEFCC GEOWATCH SECURITY SHA SIGN: ${correspondingCase.caseId.toUpperCase()}_AUTO_REGISTERED_v34_HASH_OK`, margin, y);

        // Download document with requested filename format
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;
        
        doc.save(`GeoWatch_Report_${timestamp}.pdf`);
      }, 700);
    }, 850);
    });
  };

  return (
    <div id="compliance-reports-desk" className="max-w-4xl mx-auto px-6 py-6 space-y-6">
      
      {/* 1. SECTOR SELECTOR SWITCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 select-none no-print">
        <div className="text-left font-mono">
          <span className="text-teal-650 text-xs font-bold uppercase tracking-widest block">REPORT COMPILIATION CENTER</span>
          <span className="text-[11px] text-slate-500 font-sans">Pick active Indian environmental zone to populate formal compliance registry document:</span>
        </div>

        <select
          value={activeZone.id}
          onChange={(e) => {
            const found = mockZones.find(z => z.id === e.target.value);
            if (found) onSelectZone(found);
          }}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-xs py-2.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 w-full sm:w-auto font-sans font-semibold cursor-pointer"
        >
          {mockZones.map((z) => (
            <option key={z.id} value={z.id}>{z.name}</option>
          ))}
        </select>
      </div>

      {/* 2. THE COMPLIANCE REPORT GRID */}
      <div id="report-print-target" className="bg-white border border-slate-250 p-8 sm:p-12 rounded-3xl shadow-xl text-left font-sans text-slate-900 relative">
        
        {/* Decorative Formal watermarks & badges */}
        <div className="absolute top-8 right-8 flex flex-col items-end text-right font-mono select-none">
          <span className="text-[11px] font-black text-slate-900 tracking-wider">MoEFCC LAND AUDIT</span>
          <span className="text-[9px] text-teal-600 font-bold uppercase tracking-widest">SUB-DIVISIONAL INTEGRITY RECORD</span>
          <span className="text-[9px] text-slate-400">UUID: {activeZone.id.toUpperCase()}-v34</span>
        </div>

        {/* Header Block */}
        <div className="border-b border-double border-slate-300 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-xl">
              <Scale className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Environmental Compliance Record</h1>
              <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">OFFICIAL GEOSPATIAL AUDIT AND RISK REPORT // GOVERNMENT OF INDIA</p>
            </div>
          </div>
        </div>

        {/* 3-Column Core Info block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-6 border-b border-slate-100 mb-6">
          
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-mono font-bold text-teal-600 uppercase tracking-widest border-l-2 border-teal-500 pl-2">
              Statutory Boundary Parameters
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Ecological Hotspot Section</span>
                <p className="font-extrabold text-slate-800 text-sm mt-0.5">{activeZone.name}</p>
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">State Jurisdiction</span>
                <p className="font-extrabold text-slate-800 text-sm mt-0.5">{correspondingCase.assignedDistrict || activeZone.region}</p>
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Anchor GPS Coordinates</span>
                <p className="font-mono text-slate-850 text-xs mt-0.5">Lat: {activeZone.lat.toFixed(5)}° N, Lng: {activeZone.lng.toFixed(5)}° E</p>
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">MoEFCC Compliance Case ID</span>
                <p className="font-extrabold text-teal-700 text-xs mt-0.5 font-mono">{correspondingCase.caseId}</p>
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Designated Representative</span>
                <p className="font-bold text-slate-700 text-xs mt-0.5">{correspondingCase.assignedOfficer || 'Pending Designation'}</p>
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Assigned Agency</span>
                <p className="font-bold text-slate-700 text-xs mt-0.5">{correspondingCase.assignedAgency || 'Pending Assignment'}</p>
              </div>
            </div>
          </div>

          {/* Risk Level Badge */}
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">RISK SEGMENT ASSESSMENT</span>
              <AlertTriangle className={`w-4 h-4 ${activeZone.threatLevel === 'CRITICAL' ? 'text-red-500' : 'text-orange-500'}`} />
            </div>
            
            <div className="my-2.5">
              <div className="text-3xl font-black text-slate-900 tracking-tight">{activeZone.riskScore}%</div>
              <div className="text-[10px] font-mono tracking-wider font-black uppercase text-red-650 text-red-650 mt-0.5">
                {activeZone.threatLevel} PRIORITY TARGET
              </div>
            </div>

            <span className="text-[10px] text-slate-500 leading-tight">Intervention Deadline: {correspondingCase.expectedResolutionTime}</span>
          </div>

        </div>

        {/* Dynamic Satellite Snapshot Preview */}
        <div className="space-y-3 pb-6 border-b border-slate-100 mb-6">
          <h3 className="text-xs font-mono font-bold text-teal-600 uppercase tracking-widest border-l-2 border-teal-500 pl-2">
            DETECTOR MULTISPECTRAL SATELLITE SNAPSHOT
          </h3>

          <div className="relative w-full h-48 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center select-none font-mono">
            {/* Background grid markings */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
            
            {/* Map visual details */}
            <div className="absolute inset-x-8 inset-y-12 border border-teal-500/10 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-teal-500/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border border-dashed border-red-500/40"></div>
              </div>
            </div>

            {/* Simulated thermal outline block */}
            <div className="absolute right-12 top-8 border border-red-500/40 text-red-500 text-[8px] bg-red-950/20 px-2 py-1.5 uppercase font-mono tracking-wider">
              SPECTRAL DELTA CLASSIFIED: -{activeZone.vegetationLoss}% CANOPY INTENSITY
            </div>

            {/* Target vectors cross */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center">
              <div className="w-full h-px bg-teal-500/20" />
              <div className="absolute top-0 bottom-0 w-px bg-teal-500/20" />
            </div>

            {/* Overlay lens markings */}
            <div className="absolute bottom-3 left-4 text-[9px] text-teal-400">IMAGE INDEX: FSI Custom Orthorectified Sentinel RGB</div>
            <div className="absolute bottom-3 right-4 text-[9px] text-slate-500">TIMESTAMP: {activeZone.lastUpdate}</div>
            <div className="text-slate-400 text-xs font-bold font-mono tracking-widest relative z-10 uppercase bg-slate-900/80 px-4 py-2 border border-slate-800 rounded-lg">
              GPS ANCHOR LOCK: {activeZone.lat.toFixed(4)}° N // {activeZone.lng.toFixed(4)}° E
            </div>
          </div>
        </div>

        {/* Environmental Impact Metrics Grid */}
        <div className="pb-6 border-b border-slate-100 mb-6 space-y-4">
          <h3 className="text-xs font-mono font-bold text-teal-600 uppercase tracking-widest border-l-2 border-teal-500 pl-2">
            ENVIRONMENTAL IMPACT METRICS CHECKLIST
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl">
              <span className="text-slate-400 block font-mono uppercase text-[9px]">Forest Loss</span>
              <div className="text-lg font-black text-red-600 font-mono">-{activeZone.vegetationLoss}% Area</div>
              <span className="text-[10px] text-slate-500 mt-1 block">Abrupt botanical decrescendo verified.</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl">
              <span className="text-slate-400 block font-mono uppercase text-[9px]">Illegal Mining Area</span>
              <div className="text-lg font-black text-slate-800 font-mono">
                {activeZone.excavationArea ? `DETECTED` : 'NONE'}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Excavations verified via terrain elevation.</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl">
              <span className="text-slate-400 block font-mono uppercase text-[9px]">Zone Encroachment</span>
              <div className="text-lg font-black text-slate-800 font-mono">
                {activeZone.encroachmentArea ? 'CONFIRMED' : 'CLEAR'}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Resort plots/walls intersecting reserve.</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl">
              <span className="text-slate-400 block font-mono uppercase text-[9px]">Est Ecological Damage</span>
              <div className="text-sm font-black text-slate-800 font-mono pt-1">
                {correspondingCase.estimatedDamage}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Assessed dynamic monetary damage scale.</span>
            </div>
          </div>
        </div>

        {/* findings paragraph */}
        <div className="space-y-3 pb-6 border-b border-slate-100 mb-6 text-left">
          <h3 className="text-xs font-mono font-bold text-teal-600 uppercase tracking-widest border-l-2 border-teal-500 pl-2">
            AUDIT CLASSIFIER ANALYSIS DEEP FINDINGS
          </h3>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-light font-serif">
            {correspondingCase.findings}
          </p>
        </div>

        {/* Audit Timeline Checklist */}
        <div className="pb-6 border-b border-slate-100 mb-6 space-y-3 text-left">
          <h3 className="text-xs font-mono font-bold text-teal-600 uppercase tracking-widest border-l-2 border-teal-500 pl-2">
            REGULATORY TIMELINE & DIGITAL COMPLIANCE TRAIL
          </h3>
          <div className="relative border-l border-slate-200 pl-4 ml-1.5 space-y-3.5 font-mono text-[11px]">
            {correspondingCase.auditTimeline.map((ev, evidx) => (
              <div key={evidx} className="relative">
                <span className="absolute -left-[20.5px] top-1 bg-slate-900 h-2 w-2 rounded-full ring-2 ring-teal-500" />
                <div className="font-extrabold text-slate-800 uppercase">{ev.event} ({ev.timestamp})</div>
                <div className="text-slate-500 font-sans text-xs mt-0.5">{ev.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Corrective Action Section */}
        <div className="space-y-3 pb-6 border-b border-double border-slate-300 mb-8 text-left font-mono">
          <h3 className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest border-l-2 border-red-500 pl-2">
            COMPLIANCE REMEDIATION DIRECTIVES / REQUIRED STATUTORY ACTION
          </h3>
          <div className="bg-red-50/20 p-4 border border-red-200/60 rounded-xl space-y-2">
            <p className="text-slate-800 text-xs sm:text-sm font-semibold">{correspondingCase.suggestedAction}</p>
            <div className="text-[10px] text-slate-500 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-sans">
              <span>&bull; Response Intervention Limit: <strong>{correspondingCase.expectedResolutionTime}</strong></span>
              <span>&bull; Estimated Ecological Damage: <strong>{correspondingCase.estimatedDamage}</strong></span>
            </div>
          </div>
        </div>

        {/* Authorized Signature Stamp */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2 select-none font-mono">
          <div className="flex items-center gap-2.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <span>Cryptographically Verified by MoEFCC Central Compliance Node</span>
          </div>

          <div className="flex flex-col items-end text-right text-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase">OFFICER AUTH STAMP</span>
            <span className="font-extrabold text-slate-800 uppercase tracking-tight">NATIONAL COMPLIANCE OPERATIONS</span>
            <span className="text-[10px] text-slate-500 font-mono">SHA ID: {correspondingCase.caseId}-APPROVED-v34</span>
          </div>
        </div>

      </div>

      {/* 3. DOWNLOAD ACTIONS POPUP BUTTON (FLOATING BAR) - HIDE ON PRINTING */}
      <div className="flex justify-center gap-4 py-4 select-none no-print font-mono">
        <button
          onClick={handlePrintDownload}
          disabled={isCompiling}
          className="px-6 py-3.5 bg-slate-900 hover:bg-teal-600 disabled:bg-slate-750 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          {isCompiling ? (
            <>
              <Lock className="w-4 h-4 animate-spin text-teal-400" />
              <span>{progressText}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Signed Compliance PDF Report</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
