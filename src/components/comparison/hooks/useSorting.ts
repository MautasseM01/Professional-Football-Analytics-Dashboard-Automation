
import { useState, useMemo } from 'react';
import { Player } from '@/types';
import { SortableMetric, SortDirection, SortState, MetricConfig } from '../types';

interface UseSortingProps {
  players: Player[];
  metrics: MetricConfig[];
}

export const useSorting = ({ players, metrics }: UseSortingProps) => {
  // Default sort by player name ascending
  const [sortState, setSortState] = useState<SortState>({
    metric: 'name',
    direction: 'asc'
  });

  const handleSort = (metric: SortableMetric) => {
    setSortState(prev => {
      if (prev.metric === metric) {
        // Toggle direction for same metric
        return {
          metric,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      } else {
        // New metric - start with descending for performance metrics, ascending for name
        return {
          metric,
          direction: metric === 'name' ? 'asc' : 'desc'
        };
      }
    });
  };

  const clearSort = () => {
    setSortState({
      metric: 'name',
      direction: 'asc'
    });
  };

  const sortedPlayers = useMemo(() => {
    if (!players?.length) return [];

    const metricConfig = metrics.find(m => m.key === sortState.metric);
    
    return [...players].sort((a, b) => {
      if (sortState.metric === 'name') {
        // Add null/undefined checks for player names
        const nameA = a.name || '';
        const nameB = b.name || '';
        const comparison = nameA.localeCompare(nameB);
        return sortState.direction === 'asc' ? comparison : -comparison;
      }

      if (!metricConfig) return 0;

      const valueA = metricConfig.getValue(a);
      const valueB = metricConfig.getValue(b);
      
      // Handle null values - put them at the end
      if (valueA === null && valueB === null) return 0;
      if (valueA === null) return 1;
      if (valueB === null) return -1;
      
      const comparison = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      return sortState.direction === 'asc' ? comparison : -comparison;
    });
  }, [players, sortState, metrics]);

  return {
    sortState,
    handleSort,
    clearSort,
    sortedPlayers
  };
};
