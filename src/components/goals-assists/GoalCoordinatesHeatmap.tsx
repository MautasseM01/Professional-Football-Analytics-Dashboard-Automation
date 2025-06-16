
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types";
import { useGoalsData } from "@/hooks/use-goals-data";
import { useShotsData } from "@/hooks/use-shots-data";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { Badge } from "@/components/ui/badge";

interface GoalCoordinatesHeatmapProps {
  player: Player;
}

export const GoalCoordinatesHeatmap = ({ player }: GoalCoordinatesHeatmapProps) => {
  const { goals, loading: goalsLoading, error: goalsError } = useGoalsData(player);
  const { shots, loading: shotsLoading } = useShotsData();

  if (goalsLoading || shotsLoading) return <ChartLoadingSkeleton />;
  if (goalsError) return <div className="text-red-500">Error: {goalsError}</div>;

  // Filter shots for this player
  const playerShots = shots.filter(shot => shot.player_id === player.id);
  const playerGoals = playerShots.filter(shot => shot.outcome === 'Goal');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Goal Locations Heatmap
          <Badge variant="secondary">{playerGoals.length} goals mapped</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Football Pitch Visualization */}
          <div className="relative bg-green-100 rounded-lg p-4" style={{ aspectRatio: '1.5/1', minHeight: '300px' }}>
            {/* Pitch markings */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 150 100">
              {/* Pitch outline */}
              <rect x="5" y="5" width="140" height="90" fill="none" stroke="#fff" strokeWidth="1"/>
              
              {/* Center circle */}
              <circle cx="75" cy="50" r="15" fill="none" stroke="#fff" strokeWidth="1"/>
              <line x1="75" y1="5" x2="75" y2="95" stroke="#fff" strokeWidth="1"/>
              
              {/* Goal areas */}
              <rect x="5" y="35" width="18" height="30" fill="none" stroke="#fff" strokeWidth="1"/>
              <rect x="127" y="35" width="18" height="30" fill="none" stroke="#fff" strokeWidth="1"/>
              
              {/* Penalty areas */}
              <rect x="5" y="25" width="35" height="50" fill="none" stroke="#fff" strokeWidth="1"/>
              <rect x="110" y="25" width="35" height="50" fill="none" stroke="#fff" strokeWidth="1"/>
              
              {/* Goals plotted */}
              {playerGoals.map((goal, index) => {
                // Convert coordinates to pitch position (assuming x: 0-100, y: 0-100)
                const x = (goal.x_coordinate / 100) * 140 + 5;
                const y = (goal.y_coordinate / 100) * 90 + 5;
                
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#22c55e"
                    stroke="#fff"
                    strokeWidth="1"
                    opacity="0.8"
                  />
                );
              })}
              
              {/* All shots (non-goals) */}
              {playerShots.filter(shot => shot.outcome !== 'Goal').map((shot, index) => {
                const x = (shot.x_coordinate / 100) * 140 + 5;
                const y = (shot.y_coordinate / 100) * 90 + 5;
                
                return (
                  <circle
                    key={`shot-${index}`}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="#ef4444"
                    opacity="0.4"
                  />
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Goals ({playerGoals.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 opacity-40"></div>
              <span>Shots ({playerShots.filter(s => s.outcome !== 'Goal').length})</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t">
            <div>
              <div className="text-lg font-bold text-green-600">{playerGoals.length}</div>
              <div className="text-xs text-muted-foreground">Goals</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{playerShots.length}</div>
              <div className="text-xs text-muted-foreground">Total Shots</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {playerShots.length > 0 ? ((playerGoals.length / playerShots.length) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-xs text-muted-foreground">Conversion</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
