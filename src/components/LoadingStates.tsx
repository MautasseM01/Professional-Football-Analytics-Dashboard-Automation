
import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';

interface ChartLoadingSkeletonProps {
  className?: string;
  showHeader?: boolean;
}

export const ChartLoadingSkeleton = ({ 
  className, 
  showHeader = true 
}: ChartLoadingSkeletonProps) => {
  const { theme } = useTheme();
  
  return (
    <Card className={cn(
      "border-club-gold/20 overflow-hidden backdrop-blur-sm",
      theme === 'dark' 
        ? "bg-club-dark-gray/60" 
        : "bg-white/80",
      "shadow-xl",
      className
    )}>
      {showHeader && (
        <CardHeader className="pb-3 space-y-3">
          <Skeleton className="h-6 w-2/3 bg-club-gold/20" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16 bg-club-gold/10" />
            <Skeleton className="h-4 w-16 bg-club-gold/10" />
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {/* Chart area skeleton */}
        <div className="relative">
          <Skeleton className="h-64 w-full bg-club-gold/10 rounded-xl" />
          {/* Animated loading dots */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-club-gold/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-club-gold/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-club-gold/60 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="h-6 w-12 mx-auto bg-club-gold/20" />
              <Skeleton className="h-3 w-16 mx-auto bg-club-gold/10" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface TableLoadingSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableLoadingSkeleton = ({ 
  rows = 5, 
  columns = 4, 
  className 
}: TableLoadingSkeletonProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header skeleton */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 bg-club-gold/20" />
        ))}
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={rowIndex} 
          className="grid gap-4" 
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              className="h-6 bg-club-gold/10" 
              style={{ 
                animationDelay: `${(rowIndex * columns + colIndex) * 0.1}s` 
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
