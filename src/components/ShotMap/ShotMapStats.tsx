import { Shot } from "@/types/shot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Activity, Award } from "lucide-react";

interface ShotMapStatsProps {
  shots: Shot[];
  selectedPlayer?: string;
}

export const ShotMapStats = ({ shots, selectedPlayer }: ShotMapStatsProps) => {
  const totalShots = shots.length;
  const goals = shots.filter(shot => shot.outcome === "Goal").length;
  const onTarget = shots.filter(shot => shot.outcome === "Shot on Target").length;
  const offTarget = shots.filter(shot => shot.outcome === "Shot Off Target").length;
  const blocked = shots.filter(shot => shot.outcome === "Blocked Shot").length;
  
  const conversionRate = totalShots > 0 ? ((goals / totalShots) * 100).toFixed(1) : "0";
  const accuracy = totalShots > 0 ? (((goals + onTarget) / totalShots) * 100).toFixed(1) : "0";

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          {selectedPlayer ? `${selectedPlayer} - Shot Statistics` : "Shot Statistics"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-foreground">{totalShots}</div>
            <div className="text-xs text-muted-foreground">Total Shots</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-orange-500">{goals}</div>
            <div className="text-xs text-muted-foreground">Goals</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-blue-500">{onTarget}</div>
            <div className="text-xs text-muted-foreground">On Target</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-gray-500">{offTarget + blocked}</div>
            <div className="text-xs text-muted-foreground">Missed</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            <div>
              <div className="text-sm font-medium text-foreground">{conversionRate}%</div>
              <div className="text-xs text-muted-foreground">Conversion Rate</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-sm font-medium text-foreground">{accuracy}%</div>
              <div className="text-xs text-muted-foreground">Shot Accuracy</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};