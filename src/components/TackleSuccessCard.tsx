
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
    <Card className="border-club-gold/20 bg-club-dark-gray">
      <CardHeader>
        <CardTitle className="text-club-gold">Tackle Success</CardTitle>
        <CardDescription>Defensive performance breakdown</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-club-light-gray/70">Success Rate</span>
            <span className="text-club-gold font-medium">{tackleSuccessRate}%</span>
          </div>
          <div className="w-full bg-club-black rounded-full h-2">
            <div 
              className="bg-club-gold h-2 rounded-full" 
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
            className="w-full border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold"
          >
            <Download size={16} className="mr-2" />
            Download Full Report
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
