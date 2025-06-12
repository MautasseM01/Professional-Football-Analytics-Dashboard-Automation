
import { Player } from "@/types";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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
    <Card className="border-club-gold/20 bg-club-dark-gray h-full transition-all duration-300 ease-in-out hover:border-club-gold/40 hover:shadow-lg group">
      <CardHeader className="p-3 xs:p-4 sm:p-5 lg:p-6 pb-2 xs:pb-3">
        <CardTitle className="text-xs xs:text-sm sm:text-base text-club-light-gray/70 font-medium">
          Tackle Success
        </CardTitle>
        <div className="text-xs text-club-light-gray/60 hidden xs:block">
          Defensive performance breakdown
        </div>
      </CardHeader>
      <CardContent className="p-3 xs:p-4 sm:p-5 lg:p-6 pt-0 space-y-3 xs:space-y-4">
        <div className="space-y-2 xs:space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xl xs:text-2xl sm:text-3xl font-bold text-club-gold group-hover:text-club-gold/90 transition-colors duration-300">
              {tackleSuccessRate}%
            </span>
            <span className="text-xs text-club-light-gray/60">Success Rate</span>
          </div>
          <div className="w-full bg-club-black rounded-full h-1.5 xs:h-2">
            <div 
              className="bg-club-gold h-1.5 xs:h-2 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${tackleSuccessRate}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-club-light-gray/60">
            <span>Won: {player.tackles_won}</span>
            <span>Attempted: {player.tackles_attempted}</span>
          </div>
        </div>

        {player.reportUrl && (
          <Button 
            onClick={handleReportDownload}
            variant="outline"
            size="sm"
            className="w-full border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold text-xs transition-all duration-300 min-h-[44px]"
          >
            <Download size={14} className="mr-2" />
            <span className="hidden xs:inline">Download Full Report</span>
            <span className="xs:hidden">Report</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
