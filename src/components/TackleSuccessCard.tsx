
import { Player } from "@/types";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Shield } from "lucide-react";

interface TackleSuccessCardProps {
  player: Player;
}

export const TackleSuccessCard = ({ player }: TackleSuccessCardProps) => {
  const tackleSuccessRate = player.tackles_attempted > 0
    ? ((player.tackles_won / player.tackles_attempted) * 100).toFixed(1)
    : "0";

  const handleReportDownload = () => {
    if (player.reportUrl) {
      window.open(player.reportUrl, '_blank');
    }
  };

  return (
    <Card className="border-club-gold/20 bg-club-dark-gray h-full transition-all duration-300 ease-in-out hover:border-club-gold/40 hover:shadow-lg hover:shadow-club-gold/10 group">
      <CardHeader className="p-4 sm:p-5 md:p-6 pb-3 sm:pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-club-gold flex-shrink-0" />
          <CardTitle className="text-sm sm:text-base md:text-lg text-club-gold font-semibold mb-0">
            Tackle Success
          </CardTitle>
        </div>
        <div className="text-xs sm:text-sm text-club-light-gray/70">
          Defensive performance breakdown
        </div>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-4 sm:space-y-5">
        <div className="space-y-3 sm:space-y-4">
          {/* Main percentage display */}
          <div className="flex justify-between items-end">
            <div className="flex-1">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-club-gold group-hover:text-club-gold/90 transition-colors duration-300 block leading-none">
                {tackleSuccessRate}%
              </span>
              <span className="text-xs sm:text-sm text-club-light-gray/60 mt-1 block">Success Rate</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-club-black rounded-full h-2 sm:h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-club-gold to-club-gold/80 h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${tackleSuccessRate}%` }}
            ></div>
          </div>
          
          {/* Stats breakdown */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-club-black/40 rounded-lg p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-club-gold">
                {player.tackles_won}
              </div>
              <div className="text-xs sm:text-sm text-club-light-gray/70">
                Won
              </div>
            </div>
            <div className="bg-club-black/40 rounded-lg p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-club-light-gray">
                {player.tackles_attempted}
              </div>
              <div className="text-xs sm:text-sm text-club-light-gray/70">
                Attempted
              </div>
            </div>
          </div>
        </div>

        {/* Download button */}
        {player.reportUrl && (
          <Button 
            onClick={handleReportDownload}
            variant="outline"
            size="sm"
            className="w-full border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold hover:border-club-gold/50 text-xs sm:text-sm transition-all duration-300 min-h-[44px] group/btn"
          >
            <Download size={16} className="mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline">Download Full Report</span>
            <span className="sm:hidden">Report</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
