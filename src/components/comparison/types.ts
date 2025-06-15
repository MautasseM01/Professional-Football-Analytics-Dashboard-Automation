
export type SortDirection = 'asc' | 'desc';
export type SortableMetric = 'name' | 'distance' | 'passCompletion' | 'shots' | 'tackles';

export interface MetricConfig {
  key: SortableMetric;
  label: string;
  shortLabel: string;
  mobileLabel: string;
  getValue: (player: any) => number | null;
  format: (value: number | null) => string;
  unit: string;
  icon: any;
  description: string;
  priority: number;
}

export interface SortState {
  metric: SortableMetric;
  direction: SortDirection;
}
