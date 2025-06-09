
import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  className?: string;
}

export const PullToRefresh = ({ 
  children, 
  onRefresh, 
  threshold = 80,
  className 
}: PullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHapticFeedback();

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;
    
    setStartY(e.touches[0].clientY);
    setIsPulling(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return;
    
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);
    
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance, threshold * 1.5));
      
      // Haptic feedback when reaching threshold
      if (distance >= threshold && pullDistance < threshold) {
        triggerHaptic('impact');
      }
    }
  }, [isPulling, isRefreshing, startY, threshold, pullDistance, triggerHaptic]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;
    
    setIsPulling(false);
    
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      triggerHaptic('heavy');
      
      try {
        await onRefresh();
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 300);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh, triggerHaptic]);

  const pullProgress = Math.min(pullDistance / threshold, 1);
  const shouldShowRefreshIcon = pullDistance > 20;

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-auto h-full", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-300 ease-out"
        style={{
          height: `${pullDistance}px`,
          opacity: shouldShowRefreshIcon ? 1 : 0,
          transform: `translateY(-${Math.max(0, 40 - pullDistance)}px)`
        }}
      >
        <div className="bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-md rounded-full p-3 shadow-lg">
          <RefreshCw 
            className={cn(
              "w-5 h-5 text-[#007AFF] transition-transform duration-200",
              isRefreshing && "animate-spin",
              !isRefreshing && pullProgress >= 1 && "rotate-180"
            )}
          />
        </div>
      </div>
      
      {/* Content */}
      <div 
        className="transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${isPulling ? pullDistance : 0}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
};
