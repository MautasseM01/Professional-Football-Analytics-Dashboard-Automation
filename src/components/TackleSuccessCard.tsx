
import { Player } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
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
    <Card className="border-club-gold/20 bg-club-dark-gray h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg text-club-gold">Tackle Success</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Defensive performance breakdown</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-club-light-gray/70">Success Rate</span>
            <span className="text-club-gold font-medium">{tackleSuccessRate}%</span>
          </div>
          <div className="w-full bg-club-black rounded-full h-2">
            <div 
              className="bg-club-gold h-2 rounded-full transition-all duration-300 ease-in-out" 
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
            className="w-full border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold text-xs sm:text-sm"
          >
            <Download size={14} className="mr-2" />
            Download Full Report
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
