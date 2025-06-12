
import { useState } from "react";
import { Player } from "@/types";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, ZoomIn, ZoomOut, RotateCcw, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface HeatmapCardProps {
  player: Player;
}

export const HeatmapCard = ({ player }: HeatmapCardProps) => {
  const { theme } = useTheme();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [timeFilter, setTimeFilter] = useState("full-match");

  const timeFilters = [
    { value: "full-match", label: "Full Match" },
    { value: "first-half", label: "First Half" },
    { value: "second-half", label: "Second Half" },
    { value: "final-third", label: "Final Third" }
  ];

  const activityLevels = [
    { level: "Low", color: "bg-blue-300/60", description: "1-5 touches" },
    { level: "Medium", color: "bg-yellow-400/70", description: "6-15 touches" },
    { level: "High", color: "bg-orange-500/80", description: "16-30 touches" },
    { level: "Very High", color: "bg-red-600/90", description: "30+ touches" }
  ];

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(50, prev - 25));
  };

  const handleReset = () => {
    setZoomLevel(100);
  };

  const handleDownload = () => {
    if (player.heatmapUrl) {
      window.open(player.heatmapUrl, '_blank');
    }
  };

  return (
    <Card className={cn(
      "border-club-gold/20 w-full overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-2xl group",
      theme === 'dark' 
        ? "bg-club-dark-gray/60 hover:bg-club-dark-gray/70 shadow-xl" 
        : "bg-white/80 hover:bg-white/90 shadow-xl",
      "h-full"
    )}>
      <CardHeader className="p-4 sm:p-5 lg:p-6 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-xl transition-all duration-300",
              theme === 'dark' 
                ? "bg-club-gold/20 group-hover:bg-club-gold/30" 
                : "bg-club-gold/10 group-hover:bg-club-gold/20"
            )}>
              <MapPin className="h-5 w-5 text-club-gold" />
            </div>
            <div className="flex-1">
              <CardTitle className={cn(
                "text-sm font-semibold",
                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
              )}>
                Position Heatmap
              </CardTitle>
              <div className={cn(
                "text-xs mt-1",
                theme === 'dark' ? "text-club-light-gray/60" : "text-gray-600"
              )}>
                Field activity zones
              </div>
            </div>
          </div>
        </div>

        {/* Controls Row - Time Filter and Zoom on Same Row */}
        <div className="flex items-center gap-2 mt-4">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className={cn(
              "w-[140px] h-8 text-xs border-club-gold/30",
              theme === 'dark' 
                ? "bg-club-black/30 text-club-light-gray" 
                : "bg-white/50 text-gray-900"
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={cn(
              "border-club-gold/30",
              theme === 'dark' ? "bg-club-dark-gray text-club-light-gray" : "bg-white text-gray-900"
            )}>
              {timeFilters.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className={cn(
                "h-8 w-8 p-0 border-club-gold/30 hover:bg-club-gold/10",
                theme === 'dark' 
                  ? "bg-club-black/20 text-club-light-gray" 
                  : "bg-white/50 text-gray-900"
              )}
            >
              <ZoomOut size={14} />
            </Button>
            <span className={cn(
              "text-xs font-medium px-2",
              theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
            )}>
              {zoomLevel}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className={cn(
                "h-8 w-8 p-0 border-club-gold/30 hover:bg-club-gold/10",
                theme === 'dark' 
                  ? "bg-club-black/20 text-club-light-gray" 
                  : "bg-white/50 text-gray-900"
              )}
            >
              <ZoomIn size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className={cn(
                "h-8 w-8 p-0 border-club-gold/30 hover:bg-club-gold/10",
                theme === 'dark' 
                  ? "bg-club-black/20 text-club-light-gray" 
                  : "bg-white/50 text-gray-900"
              )}
            >
              <RotateCcw size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-5 lg:p-6 pt-0 space-y-4">
        {/* Heatmap Display */}
        <div className={cn(
          "rounded-2xl overflow-hidden transition-all duration-300 border",
          theme === 'dark' 
            ? "bg-club-black/30 border-club-gold/10" 
            : "bg-gray-50/50 border-club-gold/20"
        )}>
          <AspectRatio ratio={16 / 10}>
            <div 
              className="w-full h-full bg-gradient-to-br from-green-200 via-green-300 to-green-400 relative overflow-hidden"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {/* Football pitch background */}
              <div className="absolute inset-4 border-2 border-white rounded">
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white rounded-full"></div>
                {/* Center line */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-white"></div>
                {/* Goal areas */}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-8 h-12 border-2 border-white border-l-0"></div>
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-8 h-12 border-2 border-white border-r-0"></div>
              </div>
              
              {/* Sample heatmap points with proper database colors */}
              <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-red-600/90 rounded-full blur-sm"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-orange-500/80 rounded-full blur-md"></div>
              <div className="absolute top-3/4 left-2/5 w-6 h-6 bg-yellow-400/70 rounded-full blur-sm"></div>
              <div className="absolute top-2/3 left-1/2 w-10 h-10 bg-red-600/90 rounded-full blur-md"></div>
              <div className="absolute top-1/3 left-3/5 w-4 h-4 bg-blue-300/60 rounded-full blur-sm"></div>
            </div>
          </AspectRatio>
        </div>

        {/* Activity Density Legend */}
        <div className="space-y-2">
          <h4 className={cn(
            "text-xs font-medium",
            theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
          )}>
            Activity Density
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {activityLevels.map((level, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                <div className="flex-1">
                  <span className={cn(
                    "text-xs font-medium",
                    theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
                  )}>
                    {level.level}
                  </span>
                  <div className={cn(
                    "text-xs",
                    theme === 'dark' ? "text-club-light-gray/50" : "text-gray-500"
                  )}>
                    {level.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download button */}
        {player.heatmapUrl && (
          <Button 
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className={cn(
              "w-full border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold text-xs font-medium transition-all duration-300 rounded-xl",
              theme === 'dark' 
                ? "bg-club-black/20 text-club-light-gray hover:bg-club-gold/20" 
                : "bg-white/50 text-gray-900 hover:bg-club-gold/10",
              "group-hover:border-club-gold/50"
            )}
          >
            <Download size={14} className="mr-2" />
            Download Full Heatmap
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
