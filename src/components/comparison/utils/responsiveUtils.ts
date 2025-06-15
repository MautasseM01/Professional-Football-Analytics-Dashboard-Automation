
import { useMemo } from 'react';
import { MetricConfig } from '../types';
import { cn } from '@/lib/utils';

export const useResponsiveMetrics = (metrics: MetricConfig[]) => {
  return useMemo(() => {
    if (typeof window === 'undefined') return metrics;
    
    const screenWidth = window.innerWidth;
    
    if (screenWidth < 640) {
      return metrics.filter(m => m.priority === 1);
    }
    
    if (screenWidth < 1024) {
      return metrics.filter(m => m.priority <= 2);
    }
    
    return metrics;
  }, [metrics, typeof window !== 'undefined' ? window.innerWidth : 0]);
};

export const responsiveClasses = {
  headerText: cn("text-base font-semibold", "sm:text-lg", "lg:text-xl"),
  tablePadding: cn("p-2", "sm:p-3", "lg:p-4"),
  cellPadding: cn("p-1", "sm:p-2", "lg:p-3"),
  fontSize: cn("text-xs", "sm:text-sm", "lg:text-base"),
  iconSize: cn("w-3 h-3", "sm:w-4 sm:h-4", "lg:w-5 lg:h-5")
};
