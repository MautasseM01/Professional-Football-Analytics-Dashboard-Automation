
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartSkeletonProps {
  height?: number;
  showLegend?: boolean;
  showHeader?: boolean;
  className?: string;
}

export const ChartSkeleton = ({ 
  height = 300, 
  showLegend = false, 
  showHeader = true,
  className = "" 
}: ChartSkeletonProps) => {
  return (
    <Card className={`bg-club-dark-gray border-club-gold/20 ${className}`}>
      {showHeader && (
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-48 bg-club-gold/20" />
          <Skeleton className="h-4 w-32 bg-club-light-gray/20" />
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          {/* Chart area */}
          <div 
            className="w-full bg-club-black/40 rounded-lg relative overflow-hidden"
            style={{ height: `${height}px` }}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-club-gold/10 to-transparent animate-pulse" 
                 style={{ 
                   animation: 'shimmer 2s infinite linear',
                   backgroundSize: '200% 100%'
                 }} 
            />
            
            {/* Mock chart elements */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-club-gold/30 rounded-t"
                  style={{
                    width: '20px',
                    height: `${Math.random() * 60 + 20}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Legend */}
          {showLegend && (
            <div className="flex flex-wrap gap-4 justify-center">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-full bg-club-gold/20" />
                  <Skeleton className="h-4 w-16 bg-club-light-gray/20" />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </Card>
  );
};
