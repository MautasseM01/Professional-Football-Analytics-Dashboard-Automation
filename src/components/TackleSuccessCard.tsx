
import { Player } from "@/types";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Shield, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface TackleSuccessCardProps {
  player: Player;
}

export const TackleSuccessCard = ({ player }: TackleSuccessCardProps) => {
  const { theme } = useTheme();
  const tackleSuccessRate = player.tackles_attempted > 0
    ? ((player.tackles_won / player.tackles_attempted) * 100).toFixed(1)
    : "0";

  const handleReportDownload = () => {
    if (player.reportUrl) {
      window.open(player.reportUrl, '_blank');
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
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-xl transition-all duration-300",
            theme === 'dark' 
              ? "bg-club-gold/20 group-hover:bg-club-gold/30" 
              : "bg-club-gold/10 group-hover:bg-club-gold/20"
          )}>
            <Shield className="h-5 w-5 text-club-gold" />
          </div>
          <div className="flex-1">
            <CardTitle className={cn(
              "text-sm font-semibold",
              theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
            )}>
              Tackle Success
            </CardTitle>
            <div className={cn(
              "text-xs mt-1",
              theme === 'dark' ? "text-club-light-gray/60" : "text-gray-600"
            )}>
              Defensive performance
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-5 lg:p-6 pt-0 space-y-4">
        {/* Main success rate display - iPhone weather style */}
        <div className={cn(
          "text-center p-4 rounded-2xl transition-all duration-300",
          theme === 'dark' 
            ? "bg-club-black/30 border border-club-gold/10" 
            : "bg-gray-50/50 border border-club-gold/20"
        )}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={cn(
              "text-3xl sm:text-4xl font-bold text-club-gold transition-all duration-300",
              "group-hover:scale-105"
            )}>
              {tackleSuccessRate}%
            </span>
            {parseFloat(tackleSuccessRate) > 75 && (
              <TrendingUp className="h-5 w-5 text-green-400" />
            )}
          </div>
          <div className={cn(
            "text-xs font-medium",
            theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
          )}>
            Success Rate
          </div>
        </div>

        {/* Progress bar - iPhone weather style */}
        <div className="space-y-2">
          <div className={cn(
            "w-full rounded-full h-3 transition-all duration-300",
            theme === 'dark' 
              ? "bg-club-black/40" 
              : "bg-gray-200/60"
          )}>
            <div 
              className={cn(
                "h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden",
                parseFloat(tackleSuccessRate) > 80 
                  ? "bg-gradient-to-r from-club-gold to-yellow-400"
                  : parseFloat(tackleSuccessRate) > 60
                  ? "bg-gradient-to-r from-club-gold to-orange-400"
                  : "bg-gradient-to-r from-orange-400 to-red-400"
              )}
              style={{ width: `${tackleSuccessRate}%` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
          
          {/* Stats breakdown */}
          <div className="flex justify-between items-center text-xs">
            <div className={cn(
              "flex items-center gap-1",
              theme === 'dark' ? "text-club-light-gray/60" : "text-gray-600"
            )}>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>Won: {player.tackles_won}</span>
            </div>
            <div className={cn(
              "flex items-center gap-1",
              theme === 'dark' ? "text-club-light-gray/60" : "text-gray-600"
            )}>
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span>Attempted: {player.tackles_attempted}</span>
            </div>
          </div>
        </div>

        {/* Report download button - iPhone weather style */}
        {player.reportUrl && (
          <Button 
            onClick={handleReportDownload}
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
            Download Full Report
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
