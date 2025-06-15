
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, RotateCcw } from "lucide-react";
import { SortableMetric, SortDirection, MetricConfig } from '../types';
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface SortControlsProps {
  currentMetric: SortableMetric;
  currentDirection: SortDirection;
  metrics: MetricConfig[];
  onSort: (metric: SortableMetric) => void;
  onClear: () => void;
}

export const SortControls = ({
  currentMetric,
  currentDirection,
  metrics,
  onSort,
  onClear
}: SortControlsProps) => {
  const { theme } = useTheme();

  const allMetrics = [
    { key: 'name' as const, label: 'Player Name' },
    ...metrics.map(m => ({ key: m.key, label: m.label }))
  ];

  const handleMetricChange = (value: string) => {
    onSort(value as SortableMetric);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-club-gold" />
        <span className={cn(
          "text-sm font-medium",
          theme === 'dark' ? "text-club-light-gray" : "text-gray-700"
        )}>
          Sort by:
        </span>
      </div>
      
      <Select value={currentMetric} onValueChange={handleMetricChange}>
        <SelectTrigger className={cn(
          "w-[140px] sm:w-[160px]",
          "bg-club-black/20 border-club-gold/30",
          theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
        )}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className={cn(
          "z-50",
          theme === 'dark' 
            ? "bg-club-dark-gray border-club-gold/30" 
            : "bg-white border-gray-200"
        )}>
          {allMetrics.map((metric) => (
            <SelectItem key={metric.key} value={metric.key}>
              {metric.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className={cn(
        "flex items-center gap-1 px-2 py-1 rounded text-xs",
        "bg-club-gold/20 text-club-gold border border-club-gold/30"
      )}>
        {currentDirection === 'asc' ? '↑' : '↓'}
        <span className="hidden sm:inline">
          {currentDirection === 'asc' ? 'Ascending' : 'Descending'}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onClear}
        className="text-xs"
        title="Reset to default sort"
      >
        <RotateCcw className="w-3 h-3 mr-1" />
        <span className="hidden sm:inline">Reset</span>
      </Button>
    </div>
  );
};
