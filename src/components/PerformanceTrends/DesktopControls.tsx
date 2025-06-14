
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { KPI_OPTIONS, TIME_PERIOD_OPTIONS, CHART_VIEW_OPTIONS } from "./constants";

interface DesktopControlsProps {
  selectedKPI: string;
  selectedTimePeriod: string;
  chartView: string;
  showMovingAverage: boolean;
  showStatistics: boolean;
  setSelectedKPI: (value: string) => void;
  setSelectedTimePeriod: (value: string) => void;
  setChartView: (value: string) => void;
  setShowMovingAverage: (value: boolean) => void;
  setShowStatistics: (value: boolean) => void;
}

export const DesktopControls = ({
  selectedKPI,
  selectedTimePeriod,
  chartView,
  showMovingAverage,
  showStatistics,
  setSelectedKPI,
  setSelectedTimePeriod,
  setChartView,
  setShowMovingAverage,
  setShowStatistics
}: DesktopControlsProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <>
      {/* Main Controls - Responsive Grid */}
      <div className={cn(
        "grid gap-3 sm:gap-4",
        isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      )}>
        <div className="space-y-2">
          <Label className={cn(
            "text-sm font-medium",
            theme === 'dark' ? "text-club-light-gray/80" : "text-gray-600"
          )}>Performance Metric</Label>
          <Select value={selectedKPI} onValueChange={setSelectedKPI}>
            <SelectTrigger className={cn(
              "w-full border-club-gold/30 focus:ring-club-gold/50 text-sm rounded-xl transition-all duration-200",
              isMobile ? "h-11" : "h-10",
              theme === 'dark' 
                ? "bg-club-black/50 text-club-light-gray" 
                : "bg-white/70 text-gray-900"
            )}>
              <SelectValue placeholder="Select KPI" />
            </SelectTrigger>
            <SelectContent className={cn(
              "border-club-gold/30 z-50 max-h-60 rounded-xl backdrop-blur-md",
              theme === 'dark' 
                ? "bg-club-black/90 text-club-light-gray" 
                : "bg-white/90 text-gray-900"
            )}>
              {KPI_OPTIONS.map(option => (
                <SelectItem 
                  key={option.value} 
                  value={option.value} 
                  className={cn(
                    "focus:bg-club-gold/20 rounded-lg transition-colors duration-150",
                    isMobile ? "text-base py-3" : "text-sm"
                  )}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className={cn(
            "text-sm font-medium",
            theme === 'dark' ? "text-club-light-gray/80" : "text-gray-600"
          )}>Time Period</Label>
          <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
            <SelectTrigger className={cn(
              "w-full border-club-gold/30 focus:ring-club-gold/50 text-sm rounded-xl transition-all duration-200",
              isMobile ? "h-11" : "h-10",
              theme === 'dark' 
                ? "bg-club-black/50 text-club-light-gray" 
                : "bg-white/70 text-gray-900"
            )}>
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent className={cn(
              "border-club-gold/30 z-50 rounded-xl backdrop-blur-md",
              theme === 'dark' 
                ? "bg-club-black/90 text-club-light-gray" 
                : "bg-white/90 text-gray-900"
            )}>
              {TIME_PERIOD_OPTIONS.map(option => (
                <SelectItem 
                  key={option.value} 
                  value={option.value} 
                  className={cn(
                    "focus:bg-club-gold/20 rounded-lg transition-colors duration-150",
                    isMobile ? "text-base py-3" : "text-sm"
                  )}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className={cn(
            "text-sm font-medium",
            theme === 'dark' ? "text-club-light-gray/80" : "text-gray-600"
          )}>Chart View</Label>
          <Select value={chartView} onValueChange={setChartView}>
            <SelectTrigger className={cn(
              "w-full border-club-gold/30 focus:ring-club-gold/50 text-sm rounded-xl transition-all duration-200",
              isMobile ? "h-11" : "h-10",
              theme === 'dark' 
                ? "bg-club-black/50 text-club-light-gray" 
                : "bg-white/70 text-gray-900"
            )}>
              <SelectValue placeholder="Chart View" />
            </SelectTrigger>
            <SelectContent className={cn(
              "border-club-gold/30 z-50 rounded-xl backdrop-blur-md",
              theme === 'dark' 
                ? "bg-club-black/90 text-club-light-gray" 
                : "bg-white/90 text-gray-900"
            )}>
              {CHART_VIEW_OPTIONS.map(option => (
                <SelectItem 
                  key={option.value} 
                  value={option.value} 
                  className={cn(
                    "focus:bg-club-gold/20 rounded-lg transition-colors duration-150",
                    isMobile ? "text-base py-3" : "text-sm"
                  )}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Secondary Controls - Responsive Layout */}
      <div className={cn(
        "flex gap-4 pt-2",
        isMobile ? "flex-col space-y-4" : "items-center justify-between"
      )}>
        <div className={cn(
          "flex gap-6",
          isMobile ? "flex-col space-y-4" : "items-center"
        )}>
          <div className="flex items-center gap-3">
            <Label 
              htmlFor="showStatistics"
              className={cn(
                "cursor-pointer select-none font-medium transition-colors duration-200",
                isMobile ? "text-base" : "text-sm",
                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
              )}
            >
              Show Statistics
            </Label>
            <Switch 
              id="showStatistics" 
              checked={showStatistics}
              onCheckedChange={setShowStatistics}
              className={cn(
                "data-[state=checked]:bg-club-gold data-[state=unchecked]:bg-club-black/40 border-club-gold/30",
                isMobile && "scale-110"
              )}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Label 
              htmlFor="movingAverage"
              className={cn(
                "cursor-pointer select-none font-medium transition-colors duration-200",
                isMobile ? "text-base" : "text-sm",
                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
              )}
            >
              3-Match Moving Average
            </Label>
            <Switch 
              id="movingAverage" 
              checked={showMovingAverage}
              onCheckedChange={setShowMovingAverage}
              className={cn(
                "data-[state=checked]:bg-club-gold data-[state=unchecked]:bg-club-black/40 border-club-gold/30",
                isMobile && "scale-110"
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};
