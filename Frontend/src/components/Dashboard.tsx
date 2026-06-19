import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { mockZones } from '../data/mockData';
import { MonitoringZone, ThreatLevel } from '../types';
import { MapPin, ShieldAlert, Zap, Layers, RefreshCw, Cpu, CheckCircle, Crosshair, ZoomIn, ZoomOut, Save, Download, AlertTriangle } from 'lucide-react';
import { ArmorIQDashboardCard, ArmorIQArchitectureRepresentation } from './ArmorIQ';

const getScoreBreakdown = (zone: MonitoringZone) => {
  const total = zone.riskScore;
  
  // 1. Vegetation loss component
  let vegVal = Math.min(Math.round(zone.vegetationLoss * 1.0), Math.floor(total * 0.45));
  vegVal = Math.max(vegVal, 5);
  
  // 2. Mining activity component
  let miningVal = zone.excavationArea ? Math.floor(total * 0.3) : zone.id === 'zone-sariska' ? 0 : 5;
  miningVal = Math.max(miningVal, zone.excavationArea ? 15 : 0);
  
  // 3. Proximity component
  let proxVal = zone.threatLevel === 'CRITICAL' ? 25 : zone.threatLevel === 'HIGH' ? 18 : zone.threatLevel === 'MEDIUM' ? 12 : 5;
  
  // Ensure we don't overshoot the total
  if (vegVal + miningVal + proxVal > total - 5) {
    const scale = (total - 5) / (vegVal + miningVal + proxVal);
    vegVal = Math.max(3, Math.floor(vegVal * scale));
    miningVal = Math.max(3, Math.floor(miningVal * scale));
    proxVal = Math.max(3, Math.floor(proxVal * scale));
  }
  
  // 4. Disturbance component takes the remainder
  const distVal = total - (vegVal + miningVal + proxVal);
  
  return {
    vegetation: vegVal,
    mining: miningVal,
    proximity: proxVal,
    disturbance: distVal
  };
};

interface DashboardProps {
  selectedZone: MonitoringZone | null;
  onSelectZone: (zone: MonitoringZone) => void;
  onAddToAlerts: (zone: MonitoringZone) => void;
}

export default function Dashboard({ selectedZone, onSelectZone, onAddToAlerts }: DashboardProps) {
  // Coordinates state
  const [latInput, setLatInput] = useState<string>('22.8244');
  const [lngInput, setLngInput] = useState<string>('83.1492');
  const [customZoneName, setCustomZoneName] = useState<string>('Surguja Buffer, Chhattisgarh');

  // Interactive Map Layer Filters
  const [activeLayer, setActiveLayer] = useState<'optical' | 'ndvi' | 'radar' | 'thermal'>('optical');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showBorders, setShowBorders] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Scanning simulation state
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Custom visual notification state (replacing window.alert)
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'success' });

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ show: true, message, type });
  };

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Load selected zone details into coordinates input on change
  useEffect(() => {
    if (selectedZone) {
      setLatInput(selectedZone.lat.toString());
      setLngInput(selectedZone.lng.toString());
    }
  }, [selectedZone]);

  // Handle preset locations click
  const handleSelectPreset = (zone: MonitoringZone) => {
    onSelectZone(zone);
    setLatInput(zone.lat.toString());
    setLngInput(zone.lng.toString());
    
    // Simulate a brief premium scan
    triggerScan(zone);
  };

  // Trigger scanning sequence
  const triggerScan = (targetZone: MonitoringZone) => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([]);

    const steps = [
      'Establishing L-Band telemetry lock...',
      'Requesting orthorectified multi-spectral mosaic...',
      'Comparing with reference baseline sweep...',
      'Computing vegetative NDVI deviation matrix...',
      'Segmenting linear roadway extraction lines...',
      'Calculating digital elevation model (DEM)...',
      'AI priority index assessment compiled successfully!'
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        
        // Add log lines sequentially
        if (prev % 15 === 0 && currentStepIdx < steps.length) {
          setScanLogs(l => [...l, `[${new Date().toISOString().substring(11, 19)}] ${steps[currentStepIdx]}`]);
          currentStepIdx++;
        }
        return prev + 2;
      });
    }, 45);
  };

  // Handle custom location button analysis

  const handleAnalyzeCustom = async () => {
  const lat = parseFloat(latInput);
  const lng = parseFloat(lngInput);

  if (isNaN(lat) || isNaN(lng)) {
    showNotification('Invalid GPS coordinates entered.', 'error');
    return;
  }

  try {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([]);

    const response = await fetch('http://127.0.0.1:8000/analyze-location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
      }),
    });

    if (!response.ok) {
      throw new Error('Backend analysis failed.');
    }

    const data = await response.json();

    const riskScore = data.risk_score ?? 55;
    let threatLevel: ThreatLevel = 'LOW';

    if (riskScore >= 85) threatLevel = 'CRITICAL';
    else if (riskScore >= 70) threatLevel = 'HIGH';
    else if (riskScore >= 45) threatLevel = 'MEDIUM';
    else threatLevel = 'LOW';

    const customZone: MonitoringZone = {
      id: `zone-custom-${lat.toFixed(4)}-${lng.toFixed(4)}`,
      name: customZoneName || `Sector [${lat.toFixed(4)}, ${lng.toFixed(4)}]`,
      lat,
      lng,
      riskScore,
      threatLevel,
      vegetationLoss: riskScore >= 70 ? 28.5 : riskScore >= 45 ? 16.2 : 7.8,
      excavationArea: riskScore >= 70,
      accessRoads: riskScore >= 60,
      encroachmentArea: riskScore >= 75,
      priority: threatLevel,
      lastUpdate: 'Just now (Backend AI Analysis)',
      status: 'Under Review',
      region: 'Custom Target Sector',
      country: 'India',
      findings: Array.isArray(data.findings)
        ? data.findings.join(' ')
        : 'Backend AI analysis completed.',
      recommendations:
        'Flag coordinates for field verification and compliance review.',
      sizeHectares: riskScore >= 70 ? 900 : riskScore >= 45 ? 520 : 250,
      reporter: 'GeoWatch Backend AI + Gemini',
      waterPollutionLevel: riskScore >= 70 ? 'Moderate' : 'None',
    };

    onSelectZone(customZone);
    triggerScan(customZone);
    showNotification('Backend AI analysis completed successfully.', 'success');
  } catch (error) {
    console.error(error);
    showNotification('Backend connection failed. Please check FastAPI server.', 'error');
    setIsScanning(false);
  }
};


  // Active Zone Context
  const activeZone = selectedZone || mockZones[0];

  // Procedural Canvas drawing based on selected coordinates/layer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Save state
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoomLevel / 100, zoomLevel / 100);
    ctx.translate(-width / 2, -height / 2);

    // Set styling based on current layer
    let forestColor = 'rgba(16, 185, 129, 0.45)'; // emerald
    let excavationColor = 'rgba(120, 53, 4, 0.5)'; // deep amber-brown
    let riverColor = 'rgba(14, 165, 233, 0.55)'; // light sky-blue
    let targetBoxColor = 'rgba(239, 68, 68, 0.6)';

    if (activeLayer === 'ndvi') {
      // Vegetation index (Green to Red heatmap)
      forestColor = 'rgba(21, 128, 61, 0.6)'; // healthy dark green
      excavationColor = 'rgba(239, 68, 68, 0.85)'; // red (low NDVI delta, loss)
      riverColor = 'rgba(30, 41, 59, 0.7)'; // dark blue/gray
    } else if (activeLayer === 'radar') {
      // Synthetic Aperture Radar (SAR) - High Contrast Monochromatic
      forestColor = 'rgba(15, 23, 42, 0.95)'; // dark background
      excavationColor = 'rgba(241, 245, 249, 0.9)'; // super reflective white metal signatures
      riverColor = 'rgba(2, 6, 23, 0.9)'; // pitch absorption black
      targetBoxColor = 'rgba(14, 116, 144, 0.8)';
    } else if (activeLayer === 'thermal') {
      // Thermal Spectrum (Deep Indigo to Glowing Orange)
      forestColor = 'rgba(15, 23, 42, 0.9)'; // dark navy
      excavationColor = 'rgba(249, 115, 22, 0.8)'; // blazing hot machinery orange
      riverColor = 'rgba(51, 65, 85, 0.7)'; // cold mountain runoff blue-gray
      targetBoxColor = 'rgba(253, 224, 71, 0.85)'; // yellow spark core
    }

    // 1. Draw procedural landscape background
    // Base soil or deep bedrock template
    ctx.fillStyle = activeLayer === 'optical' ? '#f1f5f9' : '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Let's seed different land designs based on active zone name/id
    const idNum = activeZone.id;

    if (idNum.includes('001') || idNum.includes('custom') && activeZone.lat < 0) {
      // Amazon Rainforest - dense organic blotches with winding river
      ctx.fillStyle = forestColor;
      // Paint primary jungle background
      ctx.fillRect(0, 0, width, height);

      // Siltaceous winding hydraulic river
      ctx.strokeStyle = activeLayer === 'optical' ? 'rgba(180, 110, 50, 0.65)' : riverColor; // Brown mud river
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(-20, centerY - 60);
      ctx.bezierCurveTo(centerX * 0.5, centerY + 20, centerX * 1.5, centerY - 120, width + 20, centerY + 65);
      ctx.stroke();

      // Side tributary
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 30);
      ctx.quadraticCurveTo(centerX * 0.8, centerY + 40, centerX * 0.4, height + 20);
      ctx.stroke();

      // Mining Excavation pits (destructive pockets along the river)
      ctx.fillStyle = excavationColor;
      ctx.beginPath();
      ctx.arc(centerX - 40, centerY - 20, 25, 0, Math.PI * 2);
      ctx.arc(centerX + 60, centerY - 50, 35, 0, Math.PI * 2);
      ctx.arc(centerX + 120, centerY - 30, 20, 0, Math.PI * 2);
      ctx.fill();

      // Access roads (cutting linearly through forest)
      ctx.strokeStyle = activeLayer === 'optical' ? 'rgba(140, 110, 80, 0.8)' : 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.2);
      ctx.lineTo(centerX - 40, centerY - 20);
      ctx.lineTo(centerX + 60, centerY - 50);
      ctx.stroke();

      // Targeting indicators around pits
      ctx.strokeStyle = targetBoxColor;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(centerX - 70, centerY - 95, 230, 80);
      ctx.setLineDash([]);
      
      // Target tag
      ctx.fillStyle = targetBoxColor;
      ctx.font = '8px monospace';
      ctx.fillText('TARGET_A: MINING_CRATER_DREDGES', centerX - 65, centerY - 85);

    } else if (idNum.includes('002') || idNum.includes('004')) {
      // Kalimantan Deforestation - blocky geometric plantation fields
      ctx.fillStyle = forestColor;
      // Solid jungle
      ctx.fillRect(0, 0, width, height);

      // Clean cleared plantation squares
      ctx.fillStyle = activeLayer === 'optical' ? 'rgba(202, 138, 4, 0.3)' : 'rgba(220, 38, 38, 0.35)'; // pale soil
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
          if ((i + j) % 2 === 0) {
            ctx.fillRect(40 + i * 110, 40 + j * 120, 75, 85);
          }
        }
      }

      // Linear access logging roads cutting grids
      ctx.strokeStyle = activeLayer === 'optical' ? 'rgba(148, 163, 184, 0.7)' : 'rgba(14, 116, 144, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Threat bounding zones
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(30, 30, 220, 210);
      ctx.fillStyle = 'rgba(249, 115, 22, 0.8)';
      ctx.font = '8px monospace';
      ctx.fillText('WARNING: GRID_ROAD_ENCROACHMENT', 35, 45);

    } else {
      // Oppencast mining craters (e.g. Kolwezi DR Congo / Ghana Galamsey)
      // Massive open grey/red quarry pits with concentric terrace rings
      ctx.fillStyle = activeLayer === 'optical' ? '#e2e8f0' : '#1e293b';
      ctx.fillRect(0, 0, width, height);

      // Concentric rings represent terraced walls
      ctx.strokeStyle = activeLayer === 'optical' ? 'rgba(100, 116, 139, 0.6)' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      const centerMX = centerX;
      const centerMY = centerY;

      for (let r = 30; r < 230; r += 22) {
        ctx.beginPath();
        ctx.arc(centerMX, centerMY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Dirt piles & machinery clusters
      ctx.fillStyle = excavationColor;
      ctx.beginPath();
      ctx.arc(centerMX + 40, centerMY + 30, 30, 0, Math.PI * 2);
      ctx.arc(centerMX - 60, centerMY - 40, 45, 0, Math.PI * 2);
      ctx.fill();

      // Heavy trucks access trail
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.quadraticCurveTo(centerMX * 0.5, centerMY * 1.2, centerMX, centerMY);
      ctx.stroke();

      // Warning label
      ctx.strokeStyle = '#f97316';
      ctx.setLineDash([4, 2]);
      ctx.strokeRect(centerMX - 110, centerMY - 90, 220, 160);
      ctx.setLineDash([]);
      ctx.fillStyle = '#f97316';
      ctx.font = '8px monospace';
      ctx.fillText('TARGET: CONCENTRIC_EXTRACTION_PITS', centerMX - 100, centerMY + 82);
    }

    // 2. Draw Gridlines overlay (if checked)
    if (showGrid) {
      ctx.strokeStyle = activeLayer === 'radar' ? 'rgba(241, 245, 249, 0.08)' : 'rgba(15, 23, 42, 0.07)';
      ctx.lineWidth = 0.5;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // 3. Coordinate telemetry lock watermarks
    ctx.restore(); // restore raw coords to draw native status anchors that don't scale

    // Static overlay lens
    ctx.strokeStyle = 'rgba(14, 116, 144, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Crosshairs
    ctx.strokeStyle = 'rgba(14, 116, 144, 0.4)';
    ctx.lineWidth = 1;
    // Corners
    ctx.beginPath();
    // TL
    ctx.moveTo(10, 30); ctx.lineTo(10, 10); ctx.lineTo(30, 10);
    // TR
    ctx.moveTo(width - 30, 10); ctx.lineTo(width - 10, 10); ctx.lineTo(width - 10, 30);
    // BL
    ctx.moveTo(10, height - 30); ctx.lineTo(10, height - 10); ctx.lineTo(30, height - 10);
    // BR
    ctx.moveTo(width - 30, height - 10); ctx.lineTo(width - 10, height - 10); ctx.lineTo(width - 10, height - 30);
    ctx.stroke();

    // Center Crosshair
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.moveTo(centerX - 15, centerY); ctx.lineTo(centerX + 15, centerY);
    ctx.moveTo(centerX, centerY - 15); ctx.lineTo(centerX, centerY + 15);
    ctx.stroke();

    // Telemetry text overlay
    ctx.fillStyle = activeLayer === 'optical' ? '#0f172a' : '#f8fafc';
    ctx.font = '10px Courier, monospace';
    ctx.fillText(`SAT-SWEEP: Sentinel-2C || LOCK_LAT: ${activeZone.lat.toFixed(4)} || LOCK_LNG: ${activeZone.lng.toFixed(4)}`, 18, 25);
    ctx.fillText(`AZ_DENSITY_NDVI: ${(0.83 - (activeZone.vegetationLoss / 100)).toFixed(2)} || HAZARD_INDEX: ${activeZone.riskScore}%`, 18, height - 18);

  }, [activeZone, activeLayer, showGrid, showBorders, zoomLevel]);

  // Handle Dispatch click
  const handleAlertDispatch = () => {
    onAddToAlerts(activeZone);
    showNotification(`DISPATCH ACTION VERIFIED: National Compliance alert initiated for ${activeZone.name}. Dispatch logs transmitted to District Forest Officer.`, 'success');
  };

  return (
    <div id="command-center-workspace" className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      
      {/* ARMORIQ CRYPTOGRAPHIC POLICY LAYER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4">
          <ArmorIQDashboardCard />
        </div>
        <div className="lg:col-span-8">
          <ArmorIQArchitectureRepresentation />
        </div>
      </div>
      
      {/* 1. TOP KPI DASHBOARD DECK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm text-left relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">Monitoring Sectors</span>
            <span className="p-1 px-2 text-[10px] bg-slate-100 border border-slate-200 rounded text-slate-600 font-bold">LIVE</span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-slate-800 tracking-tight">14 Active</div>
            <div className="text-[11px] text-teal-600 font-sans mt-1">2 Primary sectors under alert today</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm text-left relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">Critical Hotspots</span>
            <span className="p-1 px-2 text-[10px] bg-red-100 border border-red-200 rounded text-red-600 font-bold">URGENT</span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-red-600 tracking-tight">
              {mockZones.filter(z => z.threatLevel === 'CRITICAL' || z.threatLevel === 'HIGH').length} Zones
            </div>
            <div className="text-[11px] text-slate-500 font-sans mt-1">Requiring enforcement attention</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm text-left relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">Telemetry Signal</span>
            <span className="p-1 px-2 text-[10px] bg-emerald-100 border border-emerald-200 rounded text-emerald-600 font-bold">STABLE</span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-slate-800 tracking-tight">100% Lock</div>
            <div className="text-[11px] text-emerald-600 font-sans mt-1">Sentinel-2 + Landsat-9 orbit sync</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm text-left relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">Compliance Audits</span>
            <span className="p-1 px-2 text-[10px] bg-slate-100 border border-slate-200 rounded text-slate-600 font-bold">MoEFCC</span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-slate-800 tracking-tight">21 Reports</div>
            <div className="text-[11px] text-teal-600 font-sans mt-1">Archived as legal-grade compliance logs</div>
          </div>
        </div>

      </div>

      {/* 2. CORE WORKSPACE TRI-GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: QUERY CONTROLS (3/12 COLS) */}
        <div className="lg:col-span-3 space-y-5 flex flex-col">
          
          {/* Target Query Panel */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm space-y-4 text-left">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Crosshair className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                Target Coordinate Query
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                  Sector Label / Name
                </label>
                <input
                  type="text"
                  value={customZoneName}
                  onChange={(e) => setCustomZoneName(e.target.value)}
                  placeholder="e.g. Hasdeo Forest"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                    Latitude (N/S)
                  </label>
                  <input
                    type="text"
                    value={latInput}
                    onChange={(e) => setLatInput(e.target.value)}
                    placeholder="-4.3822"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                    Longitude (E/W)
                  </label>
                  <input
                    type="text"
                    value={lngInput}
                    onChange={(e) => setLngInput(e.target.value)}
                    placeholder="-70.4781"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleAnalyzeCustom}
                disabled={isScanning}
                className="w-full bg-slate-900 hover:bg-teal-600 text-white font-sans text-xs font-bold py-2.8 px-4 rounded-lg shadow transition-all flex items-center justify-center gap-2"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Crunching Pixels...
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5" />
                    Analyze Coordinates
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Preset Targets */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm space-y-3 flex-1 text-left">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                Registered Hotspots
              </h3>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[290px] pr-1">
              {mockZones.map((zone) => {
                const isSelected = activeZone.id === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => handleSelectPreset(zone)}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex flex-col space-y-1.5 ${
                      isSelected
                        ? 'bg-teal-50/50 border-teal-500/50 shadow-inner'
                        : 'bg-slate-50/50 border-slate-200/40 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 truncate">{zone.name}</span>
                      <span
                        className={`text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded border ${
                          zone.threatLevel === 'CRITICAL'
                            ? 'text-red-600 bg-red-100/50 border-red-200'
                            : zone.threatLevel === 'HIGH'
                            ? 'text-orange-600 bg-orange-100/50 border-orange-200'
                            : 'text-yellow-600 bg-yellow-100/50 border-yellow-250'
                        }`}
                      >
                        {zone.threatLevel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>{zone.country}</span>
                      <span>Risk: {zone.riskScore}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: PROCEDURAL VIEWPORT (6/12 COLS) */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="bg-slate-900 rounded-xl border border-slate-800/80 shadow-lg overflow-hidden flex flex-col">
            
            {/* Viewport Control Panel Bar */}
            <div className="bg-slate-950 px-4 py-3 flex flex-wrap items-center justify-between border-b border-slate-800 gap-2">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
                <button
                  onClick={() => setActiveLayer('optical')}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded ${
                    activeLayer === 'optical' ? 'bg-slate-800 text-teal-400 font-bold border border-slate-700' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  RGB Optical
                </button>
                <button
                  onClick={() => setActiveLayer('ndvi')}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded ${
                    activeLayer === 'ndvi' ? 'bg-slate-800 text-teal-400 font-bold border border-slate-700' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  NDVI (Veg)
                </button>
                <button
                  onClick={() => setActiveLayer('radar')}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded ${
                    activeLayer === 'radar' ? 'bg-slate-800 text-teal-400 font-bold border border-slate-700' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SAR Radar
                </button>
                <button
                  onClick={() => setActiveLayer('thermal')}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded ${
                    activeLayer === 'thermal' ? 'bg-slate-800 text-teal-400 font-bold border border-slate-700' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Thermal Night
                </button>
              </div>

              {/* Extras indicators / utilities */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(50, prev - 25))}
                  className="p-1 px-1.8 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-slate-300 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(200, prev + 25))}
                  className="p-1 px-1.8 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-slate-300 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <div className="h-4 w-px bg-slate-800"></div>
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`px-2 py-1 text-[9px] font-mono rounded ${
                    showGrid ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  GRID
                </button>
              </div>
            </div>

            {/* Simulated Canvas Viewport */}
            <div className="relative w-full aspect-square bg-black flex items-center justify-center overflow-hidden">
              
              {/* Actual Map Canvas drawing */}
              <canvas
                ref={canvasRef}
                width={500}
                height={500}
                className="w-full h-full block cursor-crosshair object-cover"
              />

              {/* Interactive radar scanner mask on scanning */}
              {isScanning && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 space-y-4">
                  <div className="relative w-20 h-20">
                    {/* Concentric spinning radar nodes */}
                    <div className="absolute inset-0 border-2 border-teal-500/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-2 border border-teal-500/40 rounded-full animate-spin"></div>
                    <div className="absolute inset-4 border border-dashed border-teal-400 rounded-full animate-reverse-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-teal-400 font-mono text-[11px] font-bold">
                      {scanProgress}%
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 text-center max-w-sm">
                    <h4 className="font-mono text-xs text-white uppercase tracking-widest font-extrabold">Active Pixel Scan Stream</h4>
                    <div className="h-1 w-44 bg-slate-800 rounded-full overflow-hidden mx-auto">
                      <div className="h-full bg-teal-400 transition-all duration-100" style={{ width: `${scanProgress}%` }}></div>
                    </div>
                    
                    {/* Log terminal ticker */}
                    <div className="h-20 overflow-y-auto w-64 bg-black/60 p-2.5 rounded border border-slate-800 text-left font-mono text-[8px] text-teal-400/80 mt-1 uppercase space-y-1 select-none">
                      {scanLogs.map((log, index) => (
                        <div key={index} className="truncate">{log}</div>
                      ))}
                      {scanLogs.length === 0 && <div className="text-slate-500 truncate">Initializing spectral sweep...</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Legend / Info strip underneath */}
            <div className="bg-slate-950/80 px-4 py-3 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-900 font-mono">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-teal-500" /> Sector Coordinates Locked</span>
              <span className="text-slate-500">Zoom index: {zoomLevel}%</span>
              <span className="text-teal-400">RESOLUTION: Sub-meter Multispectral DEM</span>
            </div>

          </div>

          {/* BEFORE / AFTER SATELLITE VIEW COMPARISON */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-600 animate-pulse" />
                Live Forest Canopy & Land-Use Delta
              </span>
              <span className="bg-teal-500/10 text-teal-700 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                Active Satellite Delta
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before View */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider block">PRE-DEVELOPMENT BASELINE (BEFORE)</span>
                <div className="h-32 bg-slate-950 border border-slate-150 rounded-lg flex items-center justify-center relative overflow-hidden select-none">
                  <svg className="w-full h-full opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <rect x="0" y="0" width="100" height="100" fill="#022c22" />
                    <circle cx="20" cy="40" r="18" fill="#047857" />
                    <circle cx="70" cy="30" r="22" fill="#065f46" />
                    <circle cx="45" cy="75" r="14" fill="#064e3b" />
                  </svg>
                  <span className="absolute text-[8px] bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded bottom-2 left-2 text-emerald-400 font-bold font-mono">NDVI CANOPY STATUS: 0.82 (HEALTHY)</span>
                </div>
              </div>

              {/* After View */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-rose-600 font-mono font-bold uppercase tracking-wider block">CURRENT RETRIEVAL (AFTER - RECENT PASS)</span>
                <div className="h-32 bg-slate-950 border border-slate-150 rounded-lg flex items-center justify-center relative overflow-hidden select-none">
                  <svg className="w-full h-full opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <rect x="0" y="0" width="100" height="100" fill={activeZone.excavationArea ? '#1e1b4b' : '#2d1610'} />
                    <circle cx="20" cy="40" r="10" fill="#450a0a" />
                    {activeZone.excavationArea && (
                      <path d="M 40 40 Q 60 70 80 50 L 90 70 L 30 80 Z" fill="#b45309" stroke="#ef4444" strokeWidth="1" />
                    )}
                    {activeZone.accessRoads && (
                      <line x1="10" y1="90" x2="90" y2="10" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
                    )}
                    {!activeZone.excavationArea && !activeZone.accessRoads && (
                      <circle cx="60" cy="50" r="25" fill="#311" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                    )}
                  </svg>
                  <span className={`absolute text-[8px] bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded bottom-2 left-2 font-bold font-mono ${activeZone.riskScore > 80 ? 'text-rose-500' : 'text-amber-500'}`}>
                    NDVI CURRENT: {(0.82 * (1 - activeZone.vegetationLoss / 100)).toFixed(2)} ({activeZone.vegetationLoss}% LOSS)
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics strips displaying exactly the required fields in a gorgeous grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-left select-none">
                <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">VEGETATION LOSS</span>
                <span className="text-sm font-black text-red-650 text-red-600 block">-{activeZone.vegetationLoss}%</span>
                <span className="text-[9px] text-slate-500 leading-none">Canopy Decline</span>
              </div>

              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-left select-none">
                <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">MINING ACTIVITY</span>
                <span className={`text-xs font-black block mt-0.5 ${activeZone.excavationArea ? 'text-amber-600 font-bold' : 'text-slate-550 text-slate-500'}`}>
                  {activeZone.excavationArea ? 'DETECTED' : 'NONE'}
                </span>
                <span className="text-[9px] text-slate-500 leading-none">{activeZone.excavationArea ? 'Opencast Pits' : 'No pit clearings'}</span>
              </div>

              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-left select-none">
                <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">ENCROACHMENT AREA</span>
                <span className={`text-xs font-black block mt-0.5 ${activeZone.encroachmentArea ? 'text-red-600 font-bold' : 'text-slate-550 text-slate-500'}`}>
                  {activeZone.encroachmentArea ? 'DETECTION ACTIVE' : 'NONE'}
                </span>
                <span className="text-[9px] text-slate-500 leading-none">{activeZone.encroachmentArea ? 'Fencing built' : 'No structures'}</span>
              </div>

              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-left select-none">
                <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">IMPACT SCORE</span>
                <span className="text-sm font-black text-slate-800 block">{activeZone.riskScore}%</span>
                <span className={`text-[8px] font-bold uppercase leading-none font-sans px-1.5 py-0.5 rounded inline-block mt-0.5 ${
                  activeZone.threatLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' : activeZone.threatLevel === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {activeZone.threatLevel}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: INSIGHT BRIEF & RECOMMENDATIONS (3/12 COLS) */}
        <div className="lg:col-span-3 space-y-5">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm text-left flex flex-col justify-between flex-1 min-h-[500px]">
            
            <div className="space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
                  AI Target Diagnostics
                </span>
                <span
                  className={`text-[9px] font-mono font-black py-0.5 px-2 rounded-full border ${
                    activeZone.threatLevel === 'CRITICAL'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : activeZone.threatLevel === 'HIGH'
                      ? 'bg-orange-50 text-orange-600 border-orange-250'
                      : 'bg-yellow-50 text-yellow-600 border-yellow-250'
                  }`}
                >
                  {activeZone.threatLevel} LEVEL
                </span>
              </div>

              {/* Big Threat Level widget */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-3.5 border border-slate-150/80 text-left">
                <div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Confidence Risk Score</span>
                    <span className="text-2xl font-black text-slate-800 tracking-tight">{activeZone.riskScore}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        activeZone.riskScore >= 85 ? 'bg-red-500' : activeZone.riskScore >= 70 ? 'bg-orange-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${activeZone.riskScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200/50 pt-2 bg-transparent select-none">
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Primary Source</span>
                    <div className="font-bold text-slate-700 truncate">{activeZone.reporter}</div>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Coverage Area</span>
                    <div className="font-bold text-slate-700">{activeZone.sizeHectares} Ha</div>
                  </div>
                </div>
              </div>

              {/* 1. AI Findings Section */}
              <div className="space-y-2 border-t border-slate-100 pt-3 text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                  AI Findings Section
                </span>
                <div className="space-y-2">
                  {activeZone.vegetationLoss > 10 && (
                    <div className="flex gap-2 items-start text-xs text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800">Significant vegetation loss:</span> High-accuracy canopy imagery traces a loss of {activeZone.vegetationLoss}% over the active sector.
                      </div>
                    </div>
                  )}
                  {activeZone.excavationArea && (
                    <div className="flex gap-2 items-start text-xs text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800">New excavation area identified:</span> Optical satellite bandpass surveys indicate a newly activated excavation pit.
                      </div>
                    </div>
                  )}
                  {(activeZone.excavationArea || activeZone.id.includes('mining')) && (
                    <div className="flex gap-2 items-start text-xs text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800">Possible unauthorized mining activity:</span> High-resolution synthetic-aperture radar (SAR) profiles indicate mechanical quarrying operations.
                      </div>
                    </div>
                  )}
                  {activeZone.accessRoads && (
                    <div className="flex gap-2 items-start text-xs text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800">New access road detected:</span> Linear ground scarring signals newly established paths slicing the perimeter.
                      </div>
                    </div>
                  )}
                  {activeZone.encroachmentArea && (
                    <div className="flex gap-2 items-start text-xs text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800">Anthropogenic fencing:</span> Optical signature alerts flag ongoing structural perimeter construction.
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 items-start text-xs text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800">Increased land disturbance:</span> Spectral reflectance models show heavy localized surface decay compared to historical imagery baseline.
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Risk Score Explanation */}
              <div className="space-y-2 border-t border-slate-100 pt-3 text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-teal-500" />
                  Risk Score Explanation
                </span>
                
                {(() => {
                  const breakdown = getScoreBreakdown(activeZone);
                  return (
                    <div className="space-y-2 bg-slate-900 p-3 rounded-lg border border-slate-800 text-white font-mono text-[10px]">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-[9px] uppercase">Vegetation Loss</span>
                          <span className="font-bold text-red-400">+{breakdown.vegetation}%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded overflow-hidden">
                          <div className="h-full bg-red-400 rounded" style={{ width: `${(breakdown.vegetation / Math.max(1, activeZone.riskScore)) * 100}%` }} />
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-[9px] uppercase">Mining Activity</span>
                          <span className="font-bold text-amber-400">+{breakdown.mining}%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded overflow-hidden">
                          <div className="h-full bg-amber-400 rounded" style={{ width: `${(breakdown.mining / Math.max(1, activeZone.riskScore)) * 100}%` }} />
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-[9px] uppercase">Protected Zone Proximity</span>
                          <span className="font-bold text-teal-400">+{breakdown.proximity}%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded overflow-hidden">
                          <div className="h-full bg-teal-400 rounded" style={{ width: `${(breakdown.proximity / Math.max(1, activeZone.riskScore)) * 100}%` }} />
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-[9px] uppercase">Historical Disturbance</span>
                          <span className="font-bold text-blue-400">+{breakdown.disturbance}%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded overflow-hidden">
                          <div className="h-full bg-blue-400 rounded" style={{ width: `${(breakdown.disturbance / Math.max(1, activeZone.riskScore)) * 100}%` }} />
                        </div>
                      </div>

                      <div className="border-t border-slate-800 pt-2 mt-2 flex justify-between items-center text-[10px] text-white">
                        <span className="font-bold">TOTAL CALCULATED RISK:</span>
                        <span className="text-teal-400 bg-teal-950 font-bold px-1.5 py-0.5 rounded border border-teal-850">
                          {activeZone.riskScore}%
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 3. Recommended Actions Section */}
              <div className="space-y-2 border-t border-slate-100 pt-3 text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  Recommended Actions
                </span>
                
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-150 text-left">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-800">Schedule inspection</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Deploy local on-ground forest ranger patrols to verify physical borders and coordinates.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-150 text-left">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-800 font-sans">Verify permits</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Compare logged spatial footprints against database environmental clearance certificates.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-150 text-left">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-800 font-sans">Conduct compliance review</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Convene sub-divisional legal assemblies to draft formal cease-and-desist mandates.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-150 text-left">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-800 font-sans">Continue monitoring</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Escalate micro-canopy satellite sweep frequencies to map daily progress.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Environmental Impact Summary */}
              <div className="space-y-1.5 border-t border-slate-100 pt-3 text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  Environmental Impact Summary
                </span>
                <p className="text-slate-600 text-xs leading-relaxed font-sans font-light bg-red-50/20 p-3 rounded-lg border border-red-500/10 text-justify">
                  Spectral index modeling confirms that the loss of <span className="font-extrabold text-red-600">-{activeZone.vegetationLoss}%</span> vegetation cover in the <span className="font-bold text-slate-700">{activeZone.name}</span> reserve zone is triggering severe environmental degradation. Industrial actions risk inducing soil erosion, water sedimentation from runoff, and critical fragmentation of forest corridors. Immediate regulatory intervention is required to manage fragile regional biodiversity loss.
                </p>
              </div>

            </div>

            {/* Quick Dispatch Call actions */}
            <div className="border-t border-slate-100 pt-4 mt-4 space-y-2 select-none">
              <button
                onClick={handleAlertDispatch}
                className="w-full group bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold py-3 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4 animate-pulse" />
                Trigger Compliance Escalation
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`fixed top-4 right-4 z-[9999] max-w-sm p-4 rounded-xl border shadow-xl flex gap-3 items-start ${
              notification.type === 'success'
                ? 'bg-teal-950 border-teal-500/30 text-teal-250'
                : notification.type === 'error'
                ? 'bg-red-950 border-red-500/30 text-red-250'
                : 'bg-slate-900 border-slate-700 text-slate-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-teal-400 mt-0.5 shrink-0 animate-bounce" />
            ) : notification.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0 animate-pulse" />
            ) : (
              <Cpu className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            )}
            <div className="flex-1 space-y-1">
              <p className="font-mono text-[9px] uppercase tracking-widest font-bold opacity-60 text-left">
                {notification.type === 'success' ? 'COMPLIANCE ESCALATION OUT' : 'SYSTEM STATUS ALERT'}
              </p>
              <p className="text-xs leading-normal font-sans font-medium text-left">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              className="text-slate-450 hover:text-white text-base leading-none focus:outline-none px-1"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
