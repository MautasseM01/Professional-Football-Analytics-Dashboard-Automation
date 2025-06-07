
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
    <Card className="bg-white/95 dark:bg-club-dark-gray/95 backdrop-blur-md border border-white/30 dark:border-club-gold/10 shadow-lg shadow-black/5 dark:shadow-black/20 h-full transition-all duration-300 ease-out hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 group">
      <CardHeader className="p-4 sm:p-5 lg:p-6 pb-3">
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-club-light-gray">Tackle Success</CardTitle>
        <div className="text-sm text-gray-600 dark:text-club-light-gray/70 font-medium">Defensive performance breakdown</div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 lg:p-6 pt-0 space-y-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-club-gold group-hover:text-gray-800 dark:group-hover:text-club-gold/90 transition-colors duration-300">
              {tackleSuccessRate}%
            </span>
            <span className="text-sm font-medium text-gray-500 dark:text-club-light-gray/60">Success Rate</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-club-black/40 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-club-gold dark:to-club-gold/80 h-2 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${tackleSuccessRate}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-club-light-gray/70">
            <span>Won: {player.tackles_won}</span>
            <span>Attempted: {player.tackles_attempted}</span>
          </div>
        </div>

        {player.reportUrl && (
          <Button 
            onClick={handleReportDownload}
            variant="outline"
            size="sm"
            className="w-full border-blue-200 dark:border-club-gold/30 hover:bg-blue-50 dark:hover:bg-club-gold/10 hover:text-blue-700 dark:hover:text-club-gold text-sm font-medium transition-all duration-300"
          >
            <Download size={16} className="mr-2" />
            Download Full Report
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
