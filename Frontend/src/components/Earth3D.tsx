import React, { useEffect, useRef, useState } from 'react';
import { mockZones } from '../data/mockData';
import { MonitoringZone } from '../types';

interface Earth3DProps {
  onSelectZone?: (zone: MonitoringZone) => void;
  selectedZone: MonitoringZone | null;
}

// Low-resolution schematic representation of continents to render a glowing dot-matrix globe
const CONTINENTS = [
  // South America
  { lat: -15, lng: -60, rLat: 20, rLng: 15, count: 50 },
  // North America
  { lat: 40, lng: -100, rLat: 20, rLng: 30, count: 65 },
  // Africa
  { lat: 10, lng: 20, rLat: 25, rLng: 20, count: 70 },
  // Eurasia
  { lat: 45, lng: 60, rLat: 25, rLng: 65, count: 120 },
  // Southeast Asia & India
  { lat: 10, lng: 95, rLat: 15, rLng: 20, count: 45 },
  // Australia
  { lat: -25, lng: 135, rLat: 15, rLng: 15, count: 35 },
  // Greenland / Arctic
  { lat: 72, lng: -40, rLat: 8, rLng: 20, count: 15 }
];

interface Point3D {
  x: number;
  y: number;
  z: number;
  lat: number;
  lng: number;
  opacity: number;
}

export default function Earth3D({ onSelectZone, selectedZone }: Earth3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [hoveredNode, setHoveredNode] = useState<MonitoringZone | null>(null);

  // Generate land points once
  const landPointsRef = useRef<Point3D[]>([]);
  if (landPointsRef.current.length === 0) {
    const points: Point3D[] = [];
    CONTINENTS.forEach(cont => {
      for (let i = 0; i < cont.count; i++) {
        // Distribute points in the shape of the continent
        const dLat = (Math.random() - 0.5) * 2 * cont.rLat;
        const dLng = (Math.random() - 0.5) * 2 * cont.rLng;
        const lat = cont.lat + dLat;
        const lng = cont.lng + dLng;

        points.push({
          x: 0, y: 0, z: 0,
          lat,
          lng,
          opacity: 0.15 + Math.random() * 0.45
        });
      }
    });
    landPointsRef.current = points;
  }

  // Animation controller
  useEffect(() => {
    let animationFrameId: number;
    let localRotation = rotation;

    const tick = () => {
      if (!isHovered) {
        localRotation += 0.0035; // Speed of Earth rotation
        setRotation(localRotation);
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  // Handle drawing routine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35; // Size of globe relative to canvas

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // 1. Draw outer glowing space ambience / atmosphere
    const atmosphereGlow = ctx.createRadialGradient(
      centerX, centerY, radius * 0.9,
      centerX, centerY, radius * 1.25
    );
    atmosphereGlow.addColorStop(0, 'rgba(14, 116, 144, 0.05)'); // subtle teal
    atmosphereGlow.addColorStop(0.5, 'rgba(14, 116, 144, 0.02)');
    atmosphereGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = atmosphereGlow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // 2. Draw Globe boundaries / base dark circle for depth
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc'; // Clean soft white interior backplate
    ctx.shadowBlur = 40;
    ctx.shadowColor = 'rgba(14, 116, 144, 0.06)';
    ctx.fill();
    ctx.shadowBlur = 0; // reset shadow

    // Subtle edge border ring
    ctx.strokeStyle = 'rgba(14, 116, 144, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 3. Draw Grid/Latitudinal/Longitudinal Lines (3D projected)
    ctx.lineWidth = 0.5;
    const latIntervals = [-60, -30, 0, 30, 60];
    const lngIntervals = [0, 45, 90, 135, 180, 225, 270, 315];

    // Longitudinal slices
    lngIntervals.forEach(lngDeg => {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(14, 116, 144, 0.05)';
      const lngRad = (lngDeg * Math.PI) / 180;
      // Draw curves
      let drawn = false;
      for (let latDeg = -90; latDeg <= 90; latDeg += 5) {
        const latRad = (latDeg * Math.PI) / 180;
        const currentRotatedLng = lngRad + rotation;

        // Spherical coordinates
        const x = radius * Math.cos(latRad) * Math.sin(currentRotatedLng);
        const y = -radius * Math.sin(latRad);
        const z = radius * Math.cos(latRad) * Math.cos(currentRotatedLng);

        if (z >= -10) { // Render only the front hemisphere (or slightly wrapping to avoid cutoffs)
          const px = centerX + x;
          const py = centerY + y;
          if (!drawn) {
            ctx.moveTo(px, py);
            drawn = true;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          drawn = false;
        }
      }
      ctx.stroke();
    });

    // Latitudinal bands
    latIntervals.forEach(latDeg => {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(14, 116, 144, 0.04)';
      const latRad = (latDeg * Math.PI) / 180;
      const ringRadius = radius * Math.cos(latRad);
      const ringY = centerY - radius * Math.sin(latRad);

      let drawn = false;
      for (let angleDeg = 0; angleDeg <= 360; angleDeg += 5) {
        const angleRad = (angleDeg * Math.PI) / 180;
        const currentAngle = angleRad + rotation;
        // z-check
        const z = ringRadius * Math.cos(currentAngle);
        const x = ringRadius * Math.sin(currentAngle);

        if (z >= 0) {
          const px = centerX + x;
          if (!drawn) {
            ctx.moveTo(px, ringY);
            drawn = true;
          } else {
            ctx.lineTo(px, ringY);
          }
        } else {
          drawn = false;
        }
      }
      ctx.stroke();
    });

    // 4. Project and Draw Land Dots
    landPointsRef.current.forEach(pt => {
      const latRad = (pt.lat * Math.PI) / 180;
      const lngRad = (pt.lng * Math.PI) / 180;
      const currentRotLng = lngRad + rotation;

      // 3D coordinate mapping
      const x = radius * Math.cos(latRad) * Math.sin(currentRotLng);
      const y = -radius * Math.sin(latRad);
      const z = radius * Math.cos(latRad) * Math.cos(currentRotLng);

      // Only draw front side
      if (z > 0) {
        const px = centerX + x;
        const py = centerY + y;
        
        ctx.fillStyle = `rgba(13, 148, 136, ${pt.opacity})`; // Glowing teal dots
        ctx.beginPath();
        // Slightly size-scale depending on z for simulated 3D depth
        const dotSize = 1.0 + (z / radius) * 0.8;
        ctx.arc(px, py, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 5. Draw Orbit Paths for Satellites
    const orbitRadiusTypeA = radius * 1.35;
    const orbitRadiusTypeB = radius * 1.45;
    
    // Draw orbit path A (light gray/teal dashed)
    ctx.strokeStyle = 'rgba(14, 116, 144, 0.08)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, orbitRadiusTypeA, orbitRadiusTypeA * 0.25, -Math.PI / 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // 6. Draw Orbits / Scanning overlay for Sentinel & Landsat Satellites
    // Satellite positions (calculated over time)
    const time = Date.now() * 0.0004;
    const satAPos = {
      x: centerX + Math.cos(time) * orbitRadiusTypeA,
      y: centerY + Math.sin(time) * orbitRadiusTypeA * 0.25 - (Math.cos(time) * 15)
    };
    
    const satBPos = {
      x: centerX + Math.cos(-time * 0.8 + 2.5) * orbitRadiusTypeB * 0.9,
      y: centerY + Math.sin(-time * 0.8 + 2.5) * orbitRadiusTypeB * 0.3 + 20
    };

    // Draw active scanning ray from satellite A to Globe center
    ctx.save();
    const gradA = ctx.createLinearGradient(satAPos.x, satAPos.y, centerX, centerY);
    gradA.addColorStop(0, 'rgba(20, 184, 166, 0.35)'); // vibrant teal
    gradA.addColorStop(1, 'rgba(20, 184, 166, 0.0)');
    ctx.strokeStyle = gradA;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(satAPos.x, satAPos.y);
    ctx.lineTo(centerX + Math.sin(time * 30) * 10, centerY + Math.cos(time * 30) * 10);
    ctx.stroke();
    ctx.restore();

    // Draw Satellite nodes
    // Sat A
    ctx.fillStyle = '#0f766e'; // Deep teal
    ctx.beginPath();
    ctx.arc(satAPos.x, satAPos.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Glowing ring for Sat A
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.4)';
    ctx.beginPath();
    ctx.arc(satAPos.x, satAPos.y, 8 + Math.sin(time * 10) * 3, 0, Math.PI * 2);
    ctx.stroke();

    // Sat B
    ctx.fillStyle = '#0369a1'; // Deep blue
    ctx.beginPath();
    ctx.arc(satBPos.x, satBPos.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Glowing ring for Sat B
    ctx.strokeStyle = 'rgba(3, 105, 161, 0.4)';
    ctx.beginPath();
    ctx.arc(satBPos.x, satBPos.y, 6 + Math.cos(time * 8) * 2, 0, Math.PI * 2);
    ctx.stroke();

    // Label satellites
    ctx.font = '9px monospace font-mono';
    ctx.fillStyle = '#0f766e';
    ctx.fillText('SENTINEL-2C', satAPos.x + 8, satAPos.y + 3);
    ctx.fillStyle = '#0369a1';
    ctx.fillText('LANDSAT-9', satBPos.x + 8, satBPos.y + 3);

    // 7. Project and Draw Mock Environmental Threats (Monitoring Zones)
    mockZones.forEach(zone => {
      const latRad = (zone.lat * Math.PI) / 180;
      const lngRad = (zone.lng * Math.PI) / 180;
      const currentRotLng = lngRad + rotation;

      // 3D coordinate mapping
      const x = radius * Math.cos(latRad) * Math.sin(currentRotLng);
      const y = -radius * Math.sin(latRad);
      const z = radius * Math.cos(latRad) * Math.cos(currentRotLng);

      // Only draw on front hemisphere
      if (z > 0) {
        const px = centerX + x;
        const py = centerY + y;

        // Choose color based on threat level
        let color = '#ef4444'; // critical (red)
        let glowColor = 'rgba(239, 68, 68, 0.2)';
        if (zone.threatLevel === 'HIGH') {
          color = '#f97316'; // orange
          glowColor = 'rgba(249, 115, 22, 0.2)';
        } else if (zone.threatLevel === 'MEDIUM') {
          color = '#eab308'; // yellow
          glowColor = 'rgba(234, 179, 8, 0.2)';
        } else if (zone.threatLevel === 'LOW') {
          color = '#10b981'; // green
          glowColor = 'rgba(16, 185, 129, 0.2)';
        }

        // Animated pulsing effect
        const t = Date.now() * 0.005;
        const pulseRatio = (Math.sin(t + zone.lat) + 1) / 2; // Unique offsets
        const pulseRadius = 5 + pulseRatio * 15;

        // Draw outer translucent alert rings
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(px, py, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = glowColor;
        ctx.beginPath();
        ctx.arc(px, py, pulseRadius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Check if selected
        const isSelected = selectedZone?.id === zone.id;

        // Draw solid core
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, isSelected ? 5.5 : 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw details if custom-hovered or selected
        if (isSelected) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px, py, 7, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Display brief tag on hover/selection
        if (isSelected || (hoveredNode && hoveredNode.id === zone.id)) {
          ctx.save();
          const tagX = px + 10;
          const tagY = py - 10;
          
          // Draw connecting line
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(tagX, tagY);
          ctx.stroke();

          // Draw dark technical badge
          ctx.font = '10px monospace';
          const text = `${zone.name} [R:${zone.riskScore}%]`;
          const textWidth = ctx.measureText(text).width;
          
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'; // deep dark charcoal
          ctx.borderRadius = 4;
          ctx.beginPath();
          ctx.roundRect?.(tagX - 4, tagY - 14, textWidth + 8, 18, 3);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, tagX, tagY - 1);
          ctx.restore();
        }
      }
    });

  }, [rotation, selectedZone, hoveredNode]);

  // Click & hover mouse interaction mapping
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.35;

    let foundZone: MonitoringZone | null = null;

    // Search closest zone
    for (const zone of mockZones) {
      const latRad = (zone.lat * Math.PI) / 180;
      const lngRad = (zone.lng * Math.PI) / 180;
      const currentRotLng = lngRad + rotation;

      // 3D coordinates
      const zX = radius * Math.cos(latRad) * Math.sin(currentRotLng);
      const zY = -radius * Math.sin(latRad);
      const zZ = radius * Math.cos(latRad) * Math.cos(currentRotLng);

      if (zZ > 0) {
        const px = centerX + zX;
        const py = centerY + zY;

        // Distance check (20px sensitivity radius)
        const dist = Math.hypot(x - px, y - py);
        if (dist < 20) {
          foundZone = zone;
          break;
        }
      }
    }

    setHoveredNode(foundZone);
    setIsHovered(!!foundZone);
    if (foundZone) {
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = 'default';
    }
  };

  const handleMouseClick = () => {
    if (hoveredNode && onSelectZone) {
      onSelectZone(hoveredNode);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col items-center justify-center bg-transparent">
      {/* Real-time status watermark */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[10px] tracking-widest text-[#0e7490]/70 uppercase select-none flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
        </span>
        GEOWATCH-GEO_CONCENTRIC_ARRAY // ONLINE
      </div>

      <div className="absolute top-4 right-4 z-10 font-mono text-[10px] text-right text-[#0e7490]/70 uppercase select-none hidden md:block">
        GRID-PROJ: EQUATORIAL SPHERICAL<br />
        FOV: 42° N/S
      </div>

      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseMove={handleMouseMove}
        onClick={handleMouseClick}
        onMouseLeave={() => {
          setHoveredNode(null);
          setIsHovered(false);
        }}
        className="max-w-full aspect-square transition-transform duration-300 hover:scale-[1.02]"
      />

      {/* Floating active sensor overlay */}
      <div className="absolute bottom-4 bg-white/70 backdrop-blur-md px-4 py-2 border border-slate-100/80 rounded-full shadow-sm text-[11px] font-medium text-slate-600 flex items-center gap-4 transition-all duration-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse inline-block"></span>
          <span>Critical Pits ({mockZones.filter(z => z.threatLevel === 'CRITICAL').length})</span>
        </div>
        <div className="h-3 w-px bg-slate-300"></div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-orange-500 rounded-full inline-block"></span>
          <span>High Risk ({mockZones.filter(z => z.threatLevel === 'HIGH').length})</span>
        </div>
        <div className="h-3 w-px bg-slate-300"></div>
        <button
          onClick={() => {
            // Pick a random critical/high zone to highlight
            const targetable = mockZones.filter(z => z.threatLevel === 'CRITICAL' || z.threatLevel === 'HIGH');
            if (targetable.length > 0 && onSelectZone) {
              const pick = targetable[Math.floor(Math.random() * targetable.length)];
              onSelectZone(pick);
            }
          }}
          className="text-teal-600 font-semibold hover:text-teal-700 hover:underline transition-colors focus:outline-none"
        >
          Scan Hotspot
        </button>
      </div>
    </div>
  );
}
