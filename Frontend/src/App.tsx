import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AlertCenter from './components/AlertCenter';
import Reports from './components/Reports';
import Analytics from './components/Analytics';
import SettingsPage from './components/Settings';
import SituationRoom from './components/SituationRoom';
import InspectionOperations from './components/InspectionOperations';
import AICopilot from './components/AICopilot';
import EnvironmentalChangeAnalysis from './components/EnvironmentalChangeAnalysis';
import { mockZones, mockAlerts, mockCases } from './data/mockData';
import { MonitoringZone, Alert, Case } from './types';
import { ShieldCheck, ShieldAlert, FileText, BarChart3, Settings, Compass, Database } from 'lucide-react';
import { ArmorIQProvider } from './components/ArmorIQ';

export default function App() {
  return (
    <ArmorIQProvider>
      <AppContent />
    </ArmorIQProvider>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedZone, setSelectedZone] = useState<MonitoringZone | null>(mockZones[0]);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [cases, setCases] = useState<Case[]>(mockCases);
  const [activeCaseId, setActiveCaseId] = useState<string>(mockCases[0]?.caseId || '');

  // Profile data from workspace context metadata
  const userEmail = 'saurabhgupta1qz@gmail.com';

  const activeCase = cases.find(c => c.caseId === activeCaseId) || cases[0] || null;

  // Update cases of system dynamically (Rangers, expected date, status, timeline)
  const handleUpdateCase = (updatedCase: Case) => {
    setCases(prev => prev.map(c => c.caseId === updatedCase.caseId ? updatedCase : c));
    
    // Also update matching Alert in alert list to maintain perfect synchronization
    setAlerts(prev => prev.map(alert => {
      if (alert.zoneId === updatedCase.zoneId) {
        let alertStatus: Alert['status'] = 'Pending';
        if (updatedCase.status === 'Resolved') {
          alertStatus = 'Resolved';
        } else if (updatedCase.priority === 'CRITICAL') {
          alertStatus = 'Critical';
        } else if (updatedCase.priority === 'HIGH') {
          alertStatus = 'High';
        }

        return {
          ...alert,
          status: alertStatus,
          assignedOfficer: updatedCase.assignedOfficer !== 'Unassigned' ? updatedCase.assignedOfficer : undefined
        };
      }
      return alert;
    }));
  };

  // Action: update individual alert on state change (resolve, assign, escalate)
  const handleUpdateAlert = (updatedAlert: Alert) => {
    setAlerts(prev => prev.map(a => a.id === updatedAlert.id ? updatedAlert : a));

    // Keep corresponding case in sync!
    setCases(prev => prev.map(c => {
      if (c.zoneId === updatedAlert.zoneId) {
        let caseStatus: Case['status'] = c.status;
        if (updatedAlert.status === 'Resolved') {
          caseStatus = 'Resolved';
        } else if (updatedAlert.assignedOfficer && (c.status === 'Detected' || !c.assignedOfficer || c.assignedOfficer === 'Unassigned')) {
          caseStatus = 'Assigned';
        }

        const auditTimeline = [...c.auditTimeline];
        if (updatedAlert.status === 'Resolved' && c.status !== 'Resolved') {
          auditTimeline.unshift({
            event: 'Case Resolved',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
            description: 'Resolved via the National Compliance Incident Deck.'
          });
        } else if (updatedAlert.assignedOfficer && updatedAlert.assignedOfficer !== c.assignedOfficer) {
          auditTimeline.unshift({
            event: 'Officer Assigned',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
            description: `Assigned officer ${updatedAlert.assignedOfficer} via Incident Deck.`
          });
        }

        return {
          ...c,
          status: caseStatus,
          assignedOfficer: updatedAlert.assignedOfficer || c.assignedOfficer,
          priority: updatedAlert.priority,
          riskScore: updatedAlert.riskScore,
          auditTimeline
        };
      }
      return c;
    }));
  };

  // Action: dispatch new alert from dashboard coordinate scanning
  const handleAddToAlerts = (zone: MonitoringZone) => {
    // Check if alert already exists for this zone to avoid duplicates
    const exists = alerts.find(a => a.zoneId === zone.id);
    if (exists) {
      // Just escalate its priority
      const updated: Alert = { ...exists, priority: 'CRITICAL', status: 'Critical' };
      handleUpdateAlert(updated);
      return;
    }

    const newAlert: Alert = {
      id: `alert-${Date.now().toString().substring(8)}`,
      zoneId: zone.id,
      locationName: zone.name,
      lat: zone.lat,
      lng: zone.lng,
      type: zone.threatLevel === 'CRITICAL' ? 'Deforestation' : 'Illegal Mining',
      riskScore: zone.riskScore,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      priority: zone.threatLevel,
      status: 'Critical',
      findings: zone.findings
    };

    // Generate matching case ID sequentially
    const nextNum = cases.length + 1;
    const formattedNum = String(nextNum).padStart(3, '0');
    const caseId = `GW-2026-${formattedNum}`;

    const newCase: Case = {
      caseId,
      zoneId: zone.id,
      locationName: zone.name,
      lat: zone.lat,
      lng: zone.lng,
      type: zone.threatLevel === 'CRITICAL' ? 'Deforestation' : 'Illegal Mining',
      status: 'Detected',
      riskScore: zone.riskScore,
      estimatedDamage: zone.threatLevel === 'CRITICAL' ? 'Rs. 5.8 Crore Est.' : 'Rs. 3.2 Crore Est.',
      areaImpacted: zone.sizeHectares,
      suggestedAction: zone.recommendations || 'Schedule immediate survey patrol and continue monitoring.',
      assignedOfficer: 'Unassigned',
      assignedAgency: 'State Forest Department',
      assignedDistrict: zone.region.split(',')[0],
      expectedResolutionTime: '72 Hours',
      expectedInspectionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: zone.threatLevel,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      findings: zone.findings,
      auditTimeline: [
        { 
          event: 'Detection Created', 
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC', 
          description: `Autonomous satellite anomaly sweep flagged crucial canopy index changes over ${zone.name}.` 
        }
      ]
    };

    setAlerts(prev => [newAlert, ...prev]);
    setCases(prev => [newCase, ...prev]);
    setActiveCaseId(caseId);
  };

  // Link view report of alert directly in Sovereign reports page
  const handleViewReportOfZone = (zoneId: string) => {
    const found = mockZones.find(z => z.id === zoneId);
    if (found) {
      setSelectedZone(found);
    }
    setActiveTab('reports');
  };

  // Switch tab directly to analyze customized coordinates
  const handleLaunchDashboardAndFocus = (zone?: MonitoringZone) => {
    if (zone) {
      setSelectedZone(zone);
    }
    setActiveTab('dashboard');
  };

  // Watch demo routine - picks a critical/high zone and loads analyzer
  const handleWatchDemo = () => {
    const highRiskSectors = mockZones.filter(z => z.threatLevel === 'CRITICAL' || z.threatLevel === 'HIGH');
    if (highRiskSectors.length > 0) {
      const pick = highRiskSectors[0];
      setSelectedZone(pick);
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col antialiased">
      
      {/* Upper Navigation controls */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} userEmail={userEmail} />

      {/* Primary Workspace viewport */}
      <main className="flex-1 bg-transparent">
        <AnimatePresence mode="wait">
          {activeTab === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
            >
              <LandingPage
                onLaunchDashboard={(zone) => {
                  if (zone) setSelectedZone(zone);
                  setActiveTab('situationroom');
                }}
                onWatchDemo={handleWatchDemo}
                onLaunchComparison={() => setActiveTab('comparison')}
              />
            </motion.div>
          )}

          {activeTab === 'situationroom' && (
            <motion.div
              key="situationroom"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
            >
              <SituationRoom
                cases={cases}
                zones={mockZones}
                onSelectCase={(caseId) => {
                  setActiveCaseId(caseId);
                  setActiveTab('enforcement');
                }}
                onNavigateToTab={(tabName) => {
                  if (tabName === 'dashboard') {
                    // Preselect correspond zone to make flow feel exceptionally realistic
                    const correspondingCase = cases.find(c => c.caseId === activeCaseId);
                    if (correspondingCase) {
                      const foundZone = mockZones.find(z => z.id === correspondingCase.zoneId);
                      if (foundZone) setSelectedZone(foundZone);
                    }
                  }
                  setActiveTab(tabName);
                }}
              />
            </motion.div>
          )}

          {activeTab === 'enforcement' && (
            <motion.div
              key="enforcement"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.22 }}
            >
              <InspectionOperations
                cases={cases}
                activeCase={activeCase}
                onSelectCase={setActiveCaseId}
                onUpdateCase={handleUpdateCase}
              />
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.24 }}
            >
              <Dashboard
                selectedZone={selectedZone}
                onSelectZone={setSelectedZone}
                onAddToAlerts={handleAddToAlerts}
              />
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCenter
                alerts={alerts}
                onUpdateAlert={handleUpdateAlert}
                onViewReportOfZone={handleViewReportOfZone}
                cases={cases}
              />
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <Reports
                selectedZone={selectedZone}
                onSelectZone={setSelectedZone}
                cases={cases}
              />
            </motion.div>
          )}

          {activeTab === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <EnvironmentalChangeAnalysis
                cases={cases}
                zones={mockZones}
                onSelectCase={(caseId) => {
                  setActiveCaseId(caseId);
                }}
                onNavigateToTab={(tabName) => {
                  setActiveTab(tabName);
                }}
              />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <Analytics />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <SettingsPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Embedded context active AI CO-PILOT Assistant */}
      <AICopilot 
        selectedZone={selectedZone} 
        onNavigateToTab={(tab) => setActiveTab(tab)} 
      />

      {/* Floating global operations footer bar - hide during clean print view */}
      <footer id="global-ops-footer" className="bg-slate-900 border-t border-slate-800 py-6 text-slate-400 font-mono text-[11px] text-center select-none space-y-2 relative z-10 no-print col">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-teal-500 rounded-full animate-ping"></span>
            <span>GEOWATCH INDIA STATUTORY COMPLIANCE OFFICE // STATUS: SECURE</span>
          </div>

          <div className="text-slate-500 text-[10px]">
            &copy; {new Date().getFullYear()} GeoWatch AI. India National Environmental Compliance Platform.
          </div>
        </div>
      </footer>

      {/* Global CSS declarations for PDF printing support */}
      <style>{`
        @media print {
          body, html, #root {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print, #navbar-header, #global-ops-footer, header, footer, select, button {
            display: none !important;
            height: 0 !important;
            width: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
          }
          #report-print-target {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          canvas, .relative {
            box-shadow: none !important;
            border-color: #e2e8f0 !important;
          }
        }
      `}</style>

    </div>
  );
}
