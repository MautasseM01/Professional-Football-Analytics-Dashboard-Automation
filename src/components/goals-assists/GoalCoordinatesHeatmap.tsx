
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types";
import { useGoalsData } from "@/hooks/use-goals-data";
import { useShotsData } from "@/hooks/use-shots-data";
import { usePlayerAttributes } from "@/hooks/use-player-attributes";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface GoalCoordinatesHeatmapProps {
  player: Player;
}

export const GoalCoordinatesHeatmap = ({ player }: GoalCoordinatesHeatmapProps) => {
  const { goals, loading: goalsLoading, error: goalsError } = useGoalsData(player);
  const { shots, loading: shotsLoading } = useShotsData();
  const { attributes, loading: attributesLoading } = usePlayerAttributes(player);

  if (goalsLoading || shotsLoading || attributesLoading) return <ChartLoadingSkeleton />;
  if (goalsError) return <div className="text-red-500">Error: {goalsError}</div>;

  // Filter shots for this player
  const playerShots = shots.filter(shot => shot.player_id === player.id);
  const playerGoals = playerShots.filter(shot => shot.outcome === 'Goal');

  // Calculate shooting efficiency based on attributes
  const shootingEfficiency = attributes ? 
    Math.round((attributes.finishing + attributes.positioning + attributes.decision_making) / 3) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 flex-wrap">
          Goal Locations Heatmap
          <div className="flex gap-2">
            <Badge variant="secondary">{playerGoals.length} goals mapped</Badge>
            {attributes && (
              <>
                <Badge variant="outline">Finishing: {attributes.finishing}</Badge>
                <Badge variant="outline">Efficiency: {shootingEfficiency}</Badge>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Football Pitch Visualization with AspectRatio for responsiveness */}
          <AspectRatio ratio={1.5} className="w-full">
            <div className="relative bg-green-100 rounded-lg p-2 sm:p-4 w-full h-full">
              {/* Responsive SVG that scales with container */}
              <svg 
                className="w-full h-full" 
                viewBox="0 0 150 100" 
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Pitch markings */}
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
                
                {/* Goals plotted with enhanced visualization */}
                {playerGoals.map((goal, index) => {
                  // Convert coordinates to pitch position (assuming x: 0-100, y: 0-100)
                  const x = (goal.x_coordinate / 100) * 140 + 5;
                  const y = (goal.y_coordinate / 100) * 90 + 5;
                  
                  // Size goals based on player's finishing attribute
                  const goalSize = attributes ? 
                    2 + (attributes.finishing / 100) * 2 : 3;
                  
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r={goalSize}
                      fill="#22c55e"
                      stroke="#fff"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                  );
                })}
                
                {/* All shots (non-goals) with attribute-based styling */}
                {playerShots.filter(shot => shot.outcome !== 'Goal').map((shot, index) => {
                  const x = (shot.x_coordinate / 100) * 140 + 5;
                  const y = (shot.y_coordinate / 100) * 90 + 5;
                  
                  // Vary shot visualization based on attributes
                  const shotSize = attributes ? 
                    1.5 + (attributes.positioning / 100) * 1 : 2;
                  
                  return (
                    <circle
                      key={`shot-${index}`}
                      cx={x}
                      cy={y}
                      r={shotSize}
                      fill="#ef4444"
                      opacity="0.4"
                    />
                  );
                })}
              </svg>
            </div>
          </AspectRatio>

          {/* Enhanced Legend with attribute context */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Goals ({playerGoals.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 opacity-40"></div>
              <span>Shots ({playerShots.filter(s => s.outcome !== 'Goal').length})</span>
            </div>
          </div>

          {/* Enhanced Stats with attribute insights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center pt-4 border-t">
            <div>
              <div className="text-base sm:text-lg font-bold text-green-600">{playerGoals.length}</div>
              <div className="text-xs text-muted-foreground">Goals</div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-blue-600">{playerShots.length}</div>
              <div className="text-xs text-muted-foreground">Total Shots</div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-purple-600">
                {playerShots.length > 0 ? ((playerGoals.length / playerShots.length) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-xs text-muted-foreground">Conversion</div>
            </div>
            {attributes && (
              <div>
                <div className="text-base sm:text-lg font-bold text-orange-600">{shootingEfficiency}</div>
                <div className="text-xs text-muted-foreground">Shot Quality</div>
              </div>
            )}
          </div>

          {/* Player shooting profile based on attributes */}
          {attributes && (
            <div className="bg-club-black/20 light:bg-gray-50 rounded-lg p-3 mt-4">
              <h4 className="font-semibold text-club-gold light:text-yellow-600 mb-2">Shooting Profile</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-club-light-gray light:text-gray-700">Finishing:</span>
                  <span className="font-medium">{attributes.finishing}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-club-light-gray light:text-gray-700">Positioning:</span>
                  <span className="font-medium">{attributes.positioning}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-club-light-gray light:text-gray-700">Preferred Foot:</span>
                  <span className="font-medium">{attributes.preferred_foot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-club-light-gray light:text-gray-700">Weak Foot:</span>
                  <span className="font-medium">★{attributes.weak_foot_rating}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
