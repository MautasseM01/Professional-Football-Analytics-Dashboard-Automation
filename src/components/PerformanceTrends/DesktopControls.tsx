
import React from "react";
import { Button } from "@/components/ui/button";

interface DesktopControlsProps {
  metrics: Array<{ key: string; label: string; color: string }>;
  timeRanges: Array<{ key: string; label: string }>;
  selectedMetric: string;
  timeRange: string;
  onMetricChange: (metric: string) => void;
  onTimeRangeChange: (range: string) => void;
  isExpanded: boolean;
}

export const DesktopControls = ({
  metrics,
  timeRanges,
  selectedMetric,
  timeRange,
  onMetricChange,
  onTimeRangeChange,
  isExpanded
}: DesktopControlsProps) => {
  return (
    <div className="space-y-3">
      {/* Metric Buttons */}
      <div className="flex flex-wrap gap-2">
        {metrics.map((metric) => (
          <Button
            key={metric.key}
            variant={selectedMetric === metric.key ? "default" : "outline"}
            size="sm"
            onClick={() => onMetricChange(metric.key)}
            className="text-xs"
          >
            {metric.label}
          </Button>
        ))}
      </div>
      
      {/* Time Range Buttons */}
      <div className="flex flex-wrap gap-2">
        {timeRanges.map((range) => (
          <Button
            key={range.key}
            variant={timeRange === range.key ? "default" : "outline"}
            size="sm"
            onClick={() => onTimeRangeChange(range.key)}
            className="text-xs"
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
