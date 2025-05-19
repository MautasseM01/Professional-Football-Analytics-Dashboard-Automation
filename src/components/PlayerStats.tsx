
import { Player } from "@/types";
import { StatCard } from "./StatCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart, 
  PieChart, 
  Download,
} from "lucide-react";

interface PlayerStatsProps {
  player: Player | null;
}

export const PlayerStats = ({ player }: PlayerStatsProps) => {
  if (!player) {
    return <div className="text-center py-8">No player selected</div>;
  }

  const handleReportDownload = () => {
    if (player.reportUrl) {
      window.open(player.reportUrl, '_blank');
    }
  };

  const passCompletionRate = player.passes_attempted > 0
    ? ((player.passes_completed / player.passes_attempted) * 100).toFixed(1)
    : "0";

  const shotsAccuracy = player.shots_total > 0
    ? ((player.shots_on_target / player.shots_total) * 100).toFixed(1)
    : "0";

  const tackleSuccessRate = player.tackles_attempted > 0
    ? ((player.tackles_won / player.tackles_attempted) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Matches Played" 
          value={player.matches} 
          icon={<Calendar size={24} />} 
        />
        <StatCard 
          title="Distance Covered" 
          value={player.distance} 
          subValue="kilometers" 
          icon={<Activity size={24} />} 
        />
        <StatCard 
          title="Pass Completion" 
          value={`${passCompletionRate}%`} 
          subValue={`${player.passes_completed}/${player.passes_attempted} passes`} 
          icon={<BarChart size={24} />} 
        />
        <StatCard 
          title="Shot Accuracy" 
          value={`${shotsAccuracy}%`} 
          subValue={`${player.shots_on_target}/${player.shots_total} shots`} 
          icon={<PieChart size={24} />} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-club-gold/20 bg-club-dark-gray md:col-span-2">
          <CardHeader>
            <CardTitle className="text-club-gold">Performance Heatmap</CardTitle>
            <CardDescription>Player's match positioning and movement</CardDescription>
          </CardHeader>
          <CardContent>
            {player.heatmapUrl ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <img 
                  src={player.heatmapUrl} 
                  alt={`${player.name} heatmap`} 
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <Alert className="bg-club-gold/10 border-club-gold/30">
                <AlertDescription>
                  Heatmap not available for this player
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
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
      </div>
    </div>
  );
};

import { Activity } from "lucide-react";
import { Calendar } from "lucide-react";
