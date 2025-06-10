
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

  // Draw football field background
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
    
    // Field background
    const gradient = ctx.createLinearGradient(fieldX, fieldY, fieldX, fieldY + fieldHeight);
    gradient.addColorStop(0, '#22c55e');
    gradient.addColorStop(0.5, '#16a34a');
    gradient.addColorStop(1, '#15803d');
    ctx.fillStyle = gradient;
    ctx.fillRect(fieldX, fieldY, fieldWidth, fieldHeight);
    
    // Field markings
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    
    // Outer boundary
    ctx.strokeRect(fieldX, fieldY, fieldWidth, fieldHeight);
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(fieldX + fieldWidth / 2, fieldY);
    ctx.lineTo(fieldX + fieldWidth / 2, fieldY + fieldHeight);
    ctx.stroke();
    
    // Center circle
    const centerX = fieldX + fieldWidth / 2;
    const centerY = fieldY + fieldHeight / 2;
    const centerRadius = Math.min(fieldWidth, fieldHeight) * 0.08;
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Center spot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    // Penalty areas
    const penaltyWidth = fieldWidth * 0.14;
    const penaltyHeight = fieldHeight * 0.35;
    const penaltyY = (fieldHeight - penaltyHeight) / 2 + fieldY;
    
    // Left penalty area
    ctx.strokeRect(fieldX, penaltyY, penaltyWidth, penaltyHeight);
    
    // Right penalty area
    ctx.strokeRect(fieldX + fieldWidth - penaltyWidth, penaltyY, penaltyWidth, penaltyHeight);
    
    // Goal areas
    const goalWidth = fieldWidth * 0.05;
    const goalHeight = fieldHeight * 0.18;
    const goalY = (fieldHeight - goalHeight) / 2 + fieldY;
    
    // Left goal area
    ctx.strokeRect(fieldX, goalY, goalWidth, goalHeight);
    
    // Right goal area
    ctx.strokeRect(fieldX + fieldWidth - goalWidth, goalY, goalWidth, goalHeight);
    
    // Penalty spots
    const penaltySpotDistance = fieldWidth * 0.1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(fieldX + penaltySpotDistance, centerY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(fieldX + fieldWidth - penaltySpotDistance, centerY, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }, [zoomLevel, panOffset]);

  // Draw heatmap overlay
  const drawHeatmap = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!heatmapData.length) return;
    
    ctx.save();
    ctx.translate(width / 2 + panOffset.x, height / 2 + panOffset.y);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-width / 2, -height / 2);
    
    // Create heatmap overlay
    heatmapData.forEach(point => {
      const x = point.x * width;
      const y = point.y * height;
      const radius = Math.max(20, 40 * point.intensity) * zoomLevel;
      
      // Create radial gradient for smooth heat effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      
      // Color based on intensity (blue -> green -> yellow -> red)
      if (point.intensity < 0.25) {
        gradient.addColorStop(0, `rgba(59, 130, 246, ${point.intensity * 0.8})`);
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      } else if (point.intensity < 0.5) {
        gradient.addColorStop(0, `rgba(34, 197, 94, ${point.intensity * 0.8})`);
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
      } else if (point.intensity < 0.75) {
        gradient.addColorStop(0, `rgba(234, 179, 8, ${point.intensity * 0.8})`);
        gradient.addColorStop(1, 'rgba(234, 179, 8, 0)');
      } else {
        gradient.addColorStop(0, `rgba(239, 68, 68, ${point.intensity * 0.8})`);
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
      }
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
    
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
      className={`relative bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-300/50 dark:border-green-700/50 rounded-2xl overflow-hidden ${className}`}
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
      
      {/* Mobile zoom hint */}
      {isMobile && (
        <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-xl shadow-lg border border-white/30 dark:border-slate-700/30 backdrop-blur-sm">
          <span className="text-sm font-medium">Pinch to zoom • Drag to pan</span>
        </div>
      )}
      
      {/* Heat intensity legend */}
      <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 rounded-xl p-3 shadow-lg border border-white/30 dark:border-slate-700/30 backdrop-blur-sm">
        <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Activity Intensity
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-sm" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-gradient-to-r from-green-500 to-yellow-500 rounded-sm" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-sm" />
            <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};
