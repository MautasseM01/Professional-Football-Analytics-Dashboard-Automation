
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
  timestamp?: number;
}

interface ResponsiveHeatmapCanvasProps {
  heatmapData: HeatmapPoint[];
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  panOffset: { x: number; y: number };
  onPanChange: (offset: { x: number; y: number }) => void;
  className?: string;
  showPlayerIllustration?: boolean;
}

export const ResponsiveHeatmapCanvas = ({
  heatmapData,
  zoomLevel,
  onZoomChange,
  panOffset,
  onPanChange,
  className = "",
  showPlayerIllustration = true
}: ResponsiveHeatmapCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const [isDragging, setIsDragging] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [lastPinchDistance, setLastPinchDistance] = useState(0);

  // Draw football field background with enhanced contrast
  const drawFootballField = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Apply zoom and pan transformations
    ctx.save();
    ctx.translate(width / 2 + panOffset.x, height / 2 + panOffset.y);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-width / 2, -height / 2);
    
    // Field dimensions (proportional to canvas)
    const fieldWidth = width * 0.9;
    const fieldHeight = height * 0.85;
    const fieldX = (width - fieldWidth) / 2;
    const fieldY = (height - fieldHeight) / 2;
    
    // Enhanced field background with better contrast
    const gradient = ctx.createLinearGradient(fieldX, fieldY, fieldX, fieldY + fieldHeight);
    gradient.addColorStop(0, '#166534'); // Darker green for better contrast
    gradient.addColorStop(0.5, '#15803d');
    gradient.addColorStop(1, '#14532d'); // Much darker green
    ctx.fillStyle = gradient;
    ctx.fillRect(fieldX, fieldY, fieldWidth, fieldHeight);
    
    // Add field texture pattern for better definition
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    const stripeWidth = fieldHeight / 20;
    for (let i = 0; i < fieldHeight; i += stripeWidth * 2) {
      ctx.fillRect(fieldX, fieldY + i, fieldWidth, stripeWidth);
    }
    
    // Enhanced field markings with better contrast and shadows
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.setLineDash([]);
    
    // Outer boundary with double lines for better visibility
    ctx.strokeRect(fieldX, fieldY, fieldWidth, fieldHeight);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.strokeRect(fieldX - 2, fieldY - 2, fieldWidth + 4, fieldHeight + 4);
    
    // Center line with enhanced visibility
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(fieldX + fieldWidth / 2, fieldY);
    ctx.lineTo(fieldX + fieldWidth / 2, fieldY + fieldHeight);
    ctx.stroke();
    
    // Center circle with enhanced contrast
    const centerX = fieldX + fieldWidth / 2;
    const centerY = fieldY + fieldHeight / 2;
    const centerRadius = Math.min(fieldWidth, fieldHeight) * 0.08;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Center spot with better visibility
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Penalty areas with enhanced contrast
    const penaltyWidth = fieldWidth * 0.14;
    const penaltyHeight = fieldHeight * 0.35;
    const penaltyY = (fieldHeight - penaltyHeight) / 2 + fieldY;
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 2;
    
    // Left penalty area
    ctx.strokeRect(fieldX, penaltyY, penaltyWidth, penaltyHeight);
    
    // Right penalty area
    ctx.strokeRect(fieldX + fieldWidth - penaltyWidth, penaltyY, penaltyWidth, penaltyHeight);
    
    // Goal areas with better definition
    const goalWidth = fieldWidth * 0.05;
    const goalHeight = fieldHeight * 0.18;
    const goalY = (fieldHeight - goalHeight) / 2 + fieldY;
    
    // Left goal area
    ctx.strokeRect(fieldX, goalY, goalWidth, goalHeight);
    
    // Right goal area
    ctx.strokeRect(fieldX + fieldWidth - goalWidth, goalY, goalWidth, goalHeight);
    
    // Enhanced penalty spots with better visibility
    const penaltySpotDistance = fieldWidth * 0.1;
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(fieldX + penaltySpotDistance, centerY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(fieldX + fieldWidth - penaltySpotDistance, centerY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.restore();
  }, [zoomLevel, panOffset]);

  // Draw heatmap overlay with improved contrast and colorblind accessibility
  const drawHeatmap = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!heatmapData.length) return;
    
    ctx.save();
    ctx.translate(width / 2 + panOffset.x, height / 2 + panOffset.y);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-width / 2, -height / 2);
    
    // Create heatmap overlay with enhanced contrast and colorblind-friendly colors
    heatmapData.forEach(point => {
      const x = point.x * width;
      const y = point.y * height;
      const radius = Math.max(25, 45 * point.intensity) * zoomLevel;
      
      // Create radial gradient for smooth heat effect with better contrast
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      
      // Enhanced colorblind-friendly color scheme with better contrast
      if (point.intensity < 0.25) {
        // Cool blue for low intensity
        gradient.addColorStop(0, `rgba(37, 99, 235, ${Math.min(point.intensity * 1.2, 0.9)})`);
        gradient.addColorStop(0.7, `rgba(37, 99, 235, ${point.intensity * 0.6})`);
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');
      } else if (point.intensity < 0.5) {
        // Teal for medium-low intensity
        gradient.addColorStop(0, `rgba(6, 182, 212, ${Math.min(point.intensity * 1.2, 0.9)})`);
        gradient.addColorStop(0.7, `rgba(6, 182, 212, ${point.intensity * 0.6})`);
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
      } else if (point.intensity < 0.75) {
        // Orange for medium-high intensity
        gradient.addColorStop(0, `rgba(251, 146, 60, ${Math.min(point.intensity * 1.2, 0.9)})`);
        gradient.addColorStop(0.7, `rgba(251, 146, 60, ${point.intensity * 0.6})`);
        gradient.addColorStop(1, 'rgba(251, 146, 60, 0)');
      } else {
        // Red for high intensity
        gradient.addColorStop(0, `rgba(220, 38, 127, ${Math.min(point.intensity * 1.2, 0.9)})`);
        gradient.addColorStop(0.7, `rgba(220, 38, 127, ${point.intensity * 0.6})`);
        gradient.addColorStop(1, 'rgba(220, 38, 127, 0)');
      }
      
      // Add subtle shadow for better definition
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 3;
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Add pattern overlay for colorblind accessibility
      if (point.intensity > 0.5) {
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = `rgba(255, 255, 255, ${point.intensity * 0.3})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    ctx.restore();
  }, [heatmapData, zoomLevel, panOffset]);

  // Redraw canvas when data or zoom changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    drawFootballField(ctx, width, height);
    drawHeatmap(ctx, width, height);
  }, [drawFootballField, drawHeatmap]);

  // Handle touch/mouse events for pan and zoom
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastPanPoint.x;
    const deltaY = e.clientY - lastPanPoint.y;
    
    onPanChange({
      x: panOffset.x + deltaX,
      y: panOffset.y + deltaY
    });
    
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastPanPoint, panOffset, onPanChange]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle pinch zoom on mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      setLastPinchDistance(distance);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (lastPinchDistance > 0) {
        const scale = distance / lastPinchDistance;
        const newZoom = Math.min(3, Math.max(0.5, zoomLevel * scale));
        onZoomChange(newZoom);
      }
      
      setLastPinchDistance(distance);
    }
  }, [lastPinchDistance, zoomLevel, onZoomChange]);

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(3, Math.max(0.5, zoomLevel * delta));
    onZoomChange(newZoom);
  }, [zoomLevel, onZoomChange]);

  return (
    <div 
      ref={containerRef}
      className={`relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-2xl overflow-hidden shadow-xl ${className}`}
      style={{ 
        aspectRatio: isMobile ? '4/3' : '16/10',
        minHeight: isMobile ? '250px' : '400px',
        touchAction: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={isMobile ? 600 : 500}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onWheel={handleWheel}
        style={{ touchAction: 'none' }}
      />
      
      {/* Enhanced mobile zoom hint with better contrast */}
      {isMobile && (
        <div className="absolute top-3 right-3 bg-white/98 dark:bg-slate-900/98 text-slate-900 dark:text-slate-100 px-4 py-3 rounded-xl shadow-lg border-2 border-slate-300 dark:border-slate-600 backdrop-blur-md">
          <span className="text-sm font-semibold">Pinch to zoom • Drag to pan</span>
        </div>
      )}
      
      {/* Enhanced heat intensity legend with better contrast and colorblind accessibility */}
      <div className="absolute bottom-3 left-3 bg-white/98 dark:bg-slate-900/98 rounded-xl p-4 shadow-xl border-2 border-slate-300 dark:border-slate-600 backdrop-blur-md">
        <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          Activity Intensity
          <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500"></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-5 h-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-sm shadow-md border border-blue-300"></div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Low</span>
            <div className="w-3 h-0.5 bg-blue-500 opacity-50"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-4 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-sm shadow-md border border-cyan-300"></div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Medium</span>
            <div className="w-3 h-0.5 bg-cyan-500 opacity-50"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-4 bg-gradient-to-r from-orange-600 to-orange-500 rounded-sm shadow-md border border-orange-300"></div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">High</span>
            <div className="w-3 h-0.5 bg-orange-500 opacity-50"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-4 bg-gradient-to-r from-pink-600 to-pink-500 rounded-sm shadow-md border border-pink-300"></div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Peak</span>
            <div className="w-3 h-0.5 bg-pink-500 opacity-50 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
