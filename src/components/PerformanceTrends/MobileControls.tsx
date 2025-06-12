
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MobileControlsProps {
  metrics: Array<{ key: string; label: string; color: string }>;
  timeRanges: Array<{ key: string; label: string }>;
  currentIndex: number;
  selectedMetric: string;
  timeRange: string;
  onPrevious: () => void;
  onNext: () => void;
  onMetricChange: (metric: string) => void;
  onTimeRangeChange: (range: string) => void;
  isExpanded: boolean;
}

export const MobileControls = ({
  metrics,
  timeRanges,
  currentIndex,
  selectedMetric,
  timeRange,
  onPrevious,
  onNext,
  onMetricChange,
  onTimeRangeChange,
  isExpanded
}: MobileControlsProps) => {
  const currentMetric = metrics[currentIndex];

  return (
    <div className="space-y-3">
      {/* Metric Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="text-club-light-gray border-club-gold/30"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center flex-1 mx-3">
          <h3 className="text-sm font-medium text-club-light-gray">
            {currentMetric?.label}
          </h3>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={currentIndex === metrics.length - 1}
          className="text-club-light-gray border-club-gold/30"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
