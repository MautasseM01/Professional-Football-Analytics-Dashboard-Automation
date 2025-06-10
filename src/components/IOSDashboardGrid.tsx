
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { RefreshCw } from "lucide-react";

interface IOSDashboardGridProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const IOSDashboardGrid = ({ 
  children, 
  onRefresh,
  className = "",
  title,
  subtitle
}: IOSDashboardGridProps) => {
  const isMobile = useIsMobile();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);

  // Pull-to-refresh functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && startY > 0) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startY);
      setPullDistance(Math.min(distance, 100));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 60 && onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
    setStartY(0);
  };

  return (
    <div 
      className={cn("min-h-screen transition-all duration-300", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* iOS-style header with blur background */}
      {(title || subtitle) && (
        <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-white/20 dark:border-slate-700/20">
          <div className="p-4 sm:p-6">
            {title && (
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Pull-to-refresh indicator */}
          {pullDistance > 0 && (
            <div 
              className="absolute top-full left-1/2 transform -translate-x-1/2 transition-all duration-200"
              style={{ transform: `translateX(-50%) translateY(${Math.min(pullDistance - 60, 20)}px)` }}
            >
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                <RefreshCw 
                  size={16} 
                  className={cn(
                    "text-gray-600 dark:text-gray-400 transition-transform duration-200",
                    (isRefreshing || pullDistance > 60) && "animate-spin"
                  )} 
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Responsive grid container */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className={cn(
          "grid gap-4 sm:gap-6 transition-all duration-300",
          // Mobile: 1 column
          "grid-cols-1",
          // Tablet: 2 columns
          "sm:grid-cols-2",
          // Desktop: 3+ columns based on content
          "lg:grid-cols-3 xl:grid-cols-4"
        )}>
          {children}
        </div>
      </div>

      {/* Safe area spacing for mobile devices */}
      {isMobile && <div className="h-8" />}
    </div>
  );
};
