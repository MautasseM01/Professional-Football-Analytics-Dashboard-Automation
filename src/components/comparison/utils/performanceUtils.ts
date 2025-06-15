
import { MetricConfig } from '../types';
import { Player } from '@/types';

export const getPerformanceLevel = (value: number | null, metric: MetricConfig, allPlayers: Player[]) => {
  if (value === null || value === undefined) return 'none';
  
  if (metric.key === 'passCompletion') {
    if (value >= 90) return 'excellent';
    if (value >= 80) return 'good';
    if (value >= 70) return 'average';
    return 'poor';
  }
  
  const allValues = allPlayers
    .map(p => metric.getValue(p))
    .filter(v => v !== null && v !== undefined) as number[];
  
  if (allValues.length === 0) return 'none';
  
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const range = max - min;
  
  if (range === 0) return 'average';
  
  const normalized = (value - min) / range;
  if (normalized >= 0.8) return 'excellent';
  if (normalized >= 0.6) return 'good';
  if (normalized >= 0.4) return 'average';
  return 'poor';
};

export const getPerformanceLevelColor = (level: string) => {
  switch (level) {
    case 'excellent': return 'text-green-500';
    case 'good': return 'text-blue-500';
    case 'average': return 'text-yellow-500';
    case 'poor': return 'text-red-500';
    default: return 'text-gray-500';
  }
};
