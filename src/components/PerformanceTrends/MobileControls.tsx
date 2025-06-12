
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { KPI_OPTIONS, TIME_PERIOD_OPTIONS } from "./constants";

interface MobileControlsProps {
  currentMetricIndex: number;
  selectedTimePeriod: string;
  currentMetric: typeof KPI_OPTIONS[0];
  prevMetric: () => void;
  nextMetric: () => void;
}

export const MobileControls = ({ 
  currentMetricIndex, 
  selectedTimePeriod, 
  currentMetric, 
  prevMetric, 
  nextMetric 
}: MobileControlsProps) => {
  const { theme } = useTheme();

  return (
    <>
      {/* Mobile navigation controls - iPhone weather style */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevMetric}
          className="h-9 w-9 text-club-gold hover:bg-club-gold/10 rounded-full hover-scale"
          aria-label="Previous metric"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMetric}
          className="h-9 w-9 text-club-gold hover:bg-club-gold/10 rounded-full hover-scale"
          aria-label="Next metric"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile metric display - iPhone weather style */}
      <div className="text-center space-y-2 animate-fade-in">
        <h3 className="text-lg font-semibold text-club-gold">
          {currentMetric.shortLabel}
        </h3>
        <div className="text-xs text-club-light-gray/70">
          {TIME_PERIOD_OPTIONS.find(t => t.value === selectedTimePeriod)?.shortLabel}
        </div>
        
        {/* Metric indicator dots */}
        <div className="flex justify-center gap-1 mt-3">
          {KPI_OPTIONS.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentMetricIndex ? 'bg-club-gold scale-125' : 'bg-club-gold/30'
              )}
            />
          ))}
        </div>
      </div>
    </>
  );
};
