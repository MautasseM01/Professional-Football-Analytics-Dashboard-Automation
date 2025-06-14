
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
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

  return (
    <>
      {/* Main Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className={cn(
            "text-xs font-medium",
            theme === 'dark' ? "text-club-light-gray/80" : "text-gray-600"
          )}>Performance Metric</Label>
          <Select value={selectedKPI} onValueChange={setSelectedKPI}>
            <SelectTrigger className={cn(
              "w-full border-club-gold/30 focus:ring-club-gold/50 h-9 text-sm rounded-xl transition-all duration-200",
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
                  className="focus:bg-club-gold/20 text-sm rounded-lg transition-colors duration-150"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <Label className={cn(
            "text-xs font-medium",
            theme === 'dark' ? "text-club-light-gray/80" : "text-gray-600"
          )}>Time Period</Label>
          <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
            <SelectTrigger className={cn(
              "w-full border-club-gold/30 focus:ring-club-gold/50 h-9 text-sm rounded-xl transition-all duration-200",
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
                  className="focus:bg-club-gold/20 text-sm rounded-lg transition-colors duration-150"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className={cn(
            "text-xs font-medium",
            theme === 'dark' ? "text-club-light-gray/80" : "text-gray-600"
          )}>Chart View</Label>
          <Select value={chartView} onValueChange={setChartView}>
            <SelectTrigger className={cn(
              "w-full border-club-gold/30 focus:ring-club-gold/50 h-9 text-sm rounded-xl transition-all duration-200",
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
                  className="focus:bg-club-gold/20 text-sm rounded-lg transition-colors duration-150"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Secondary Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Label 
              htmlFor="showStatistics"
              className={cn(
                "text-xs cursor-pointer select-none font-medium transition-colors duration-200",
                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
              )}
            >
              Show Statistics
            </Label>
            <Switch 
              id="showStatistics" 
              checked={showStatistics}
              onCheckedChange={setShowStatistics}
              className="data-[state=checked]:bg-club-gold data-[state=unchecked]:bg-club-black/40 border-club-gold/30"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Label 
              htmlFor="movingAverage"
              className={cn(
                "text-xs cursor-pointer select-none font-medium transition-colors duration-200",
                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
              )}
            >
              3-Match Moving Average
            </Label>
            <Switch 
              id="movingAverage" 
              checked={showMovingAverage}
              onCheckedChange={setShowMovingAverage}
              className="data-[state=checked]:bg-club-gold data-[state=unchecked]:bg-club-black/40 border-club-gold/30"
            />
          </div>
        </div>
      </div>
    </>
  );
};
