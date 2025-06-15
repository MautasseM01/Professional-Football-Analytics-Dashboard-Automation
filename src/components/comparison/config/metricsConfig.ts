
import { TrendingUp, Target, BarChart3, Medal } from "lucide-react";
import { MetricConfig } from '../types';
import { getPassCompletionPercentage, formatPercentage } from "@/utils/comparisonUtils";

export const metrics: MetricConfig[] = [
  {
    key: 'distance',
    label: 'Total Distance',
    shortLabel: 'Distance',
    mobileLabel: 'Dist',
    getValue: (player) => player.distance || null,
    format: (value) => value ? `${value.toFixed(1)} km` : 'N/A',
    unit: 'km',
    icon: TrendingUp,
    description: 'Total distance covered during the match',
    priority: 1
  },
  {
    key: 'passCompletion',
    label: 'Pass Completion',
    shortLabel: 'Pass %',
    mobileLabel: 'Pass',
    getValue: (player) => player.passes_attempted && player.passes_attempted > 0 
      ? getPassCompletionPercentage(player) : null,
    format: (value) => value ? formatPercentage(value) : 'N/A',
    unit: '%',
    icon: Target,
    description: 'Percentage of successful passes',
    priority: 1
  },
  {
    key: 'shots',
    label: 'Shots on Target',
    shortLabel: 'Shots',
    mobileLabel: 'SOT',
    getValue: (player) => player.shots_on_target || null,
    format: (value) => value !== null ? value.toString() : 'N/A',
    unit: '',
    icon: BarChart3,
    description: 'Number of shots that were on target',
    priority: 2
  },
  {
    key: 'tackles',
    label: 'Tackles Won',
    shortLabel: 'Tackles',
    mobileLabel: 'Tack',
    getValue: (player) => player.tackles_won || null,
    format: (value) => value !== null ? value.toString() : 'N/A',
    unit: '',
    icon: Medal,
    description: 'Number of successful tackles',
    priority: 2
  }
];
