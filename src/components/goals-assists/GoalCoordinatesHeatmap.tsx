
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
    <Card className="bg-club-black/40 dark:bg-club-black/40 light:bg-white/90 border-club-gold/20 dark:border-club-gold/20 light:border-gray-200 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 flex-wrap text-club-gold dark:text-club-gold light:text-gray-900 text-lg font-semibold">
          Goal Locations Heatmap
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-club-gold/20 dark:bg-club-gold/20 light:bg-yellow-100 text-club-gold dark:text-club-gold light:text-yellow-800 border-club-gold/30 dark:border-club-gold/30 light:border-yellow-200">
              {playerGoals.length} goals mapped
            </Badge>
            {attributes && (
              <>
                <Badge variant="outline" className="border-club-gold/30 dark:border-club-gold/30 light:border-yellow-200 text-club-gold dark:text-club-gold light:text-yellow-700">
                  Finishing: {attributes.finishing}
                </Badge>
                <Badge variant="outline" className="border-club-gold/30 dark:border-club-gold/30 light:border-yellow-200 text-club-gold dark:text-club-gold light:text-yellow-700">
                  Efficiency: {shootingEfficiency}
                </Badge>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Football Pitch Visualization with AspectRatio for responsiveness */}
          <AspectRatio ratio={1.5} className="w-full">
            <div className="relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 light:from-green-50 light:to-green-100 rounded-lg p-2 sm:p-4 w-full h-full border border-club-gold/20 dark:border-club-gold/20 light:border-green-200">
              {/* Responsive SVG that scales with container */}
              <svg 
                className="w-full h-full drop-shadow-sm" 
                viewBox="0 0 150 100" 
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Pitch markings */}
                {/* Pitch outline */}
                <rect x="5" y="5" width="140" height="90" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.8"/>
                
                {/* Center circle */}
                <circle cx="75" cy="50" r="15" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.7"/>
                <line x1="75" y1="5" x2="75" y2="95" stroke="#D4AF37" strokeWidth="1.2" opacity="0.7"/>
                
                {/* Goal areas */}
                <rect x="5" y="35" width="18" height="30" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.7"/>
                <rect x="127" y="35" width="18" height="30" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.7"/>
                
                {/* Penalty areas */}
                <rect x="5" y="25" width="35" height="50" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.7"/>
                <rect x="110" y="25" width="35" height="50" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.7"/>
                
                {/* Goals plotted with enhanced visualization */}
                {playerGoals.map((goal, index) => {
                  // Convert coordinates to pitch position (assuming x: 0-100, y: 0-100)
                  const x = (goal.x_coordinate / 100) * 140 + 5;
                  const y = (goal.y_coordinate / 100) * 90 + 5;
                  
                  // Size goals based on player's finishing attribute
                  const goalSize = attributes ? 
                    3 + (attributes.finishing / 100) * 2 : 4;
                  
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r={goalSize}
                      fill="#D4AF37"
                      stroke="#FFD700"
                      strokeWidth="1.5"
                      opacity="0.9"
                      style={{
                        filter: 'drop-shadow(0 2px 4px rgba(212, 175, 55, 0.3))',
                      }}
                    />
                  );
                })}
                
                {/* All shots (non-goals) with attribute-based styling */}
                {playerShots.filter(shot => shot.outcome !== 'Goal').map((shot, index) => {
                  const x = (shot.x_coordinate / 100) * 140 + 5;
                  const y = (shot.y_coordinate / 100) * 90 + 5;
                  
                  // Vary shot visualization based on attributes
                  const shotSize = attributes ? 
                    2 + (attributes.positioning / 100) * 1.5 : 2.5;
                  
                  return (
                    <circle
                      key={`shot-${index}`}
                      cx={x}
                      cy={y}
                      r={shotSize}
                      fill="#ef4444"
                      stroke="#ff6b6b"
                      strokeWidth="1"
                      opacity="0.5"
                      style={{
                        filter: 'drop-shadow(0 1px 2px rgba(239, 68, 68, 0.2))',
                      }}
                    />
                  );
                })}
              </svg>
            </div>
          </AspectRatio>

          {/* Enhanced Legend with attribute context */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-club-gold shadow-sm"></div>
              <span className="text-club-light-gray dark:text-club-light-gray light:text-gray-700">Goals ({playerGoals.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 opacity-50"></div>
              <span className="text-club-light-gray dark:text-club-light-gray light:text-gray-700">Shots ({playerShots.filter(s => s.outcome !== 'Goal').length})</span>
            </div>
          </div>

          {/* Enhanced Stats with attribute insights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center pt-4 border-t border-club-gold/10 dark:border-club-gold/10 light:border-gray-200">
            <div className="p-3 rounded-lg border border-club-gold/10 dark:border-club-gold/10 light:border-gray-100 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-50/50">
              <div className="text-base sm:text-lg font-bold text-club-gold dark:text-club-gold light:text-green-600">{playerGoals.length}</div>
              <div className="text-xs text-club-light-gray/70 dark:text-club-light-gray/70 light:text-gray-500">Goals</div>
            </div>
            <div className="p-3 rounded-lg border border-club-gold/10 dark:border-club-gold/10 light:border-gray-100 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-50/50">
              <div className="text-base sm:text-lg font-bold text-club-gold dark:text-club-gold light:text-blue-600">{playerShots.length}</div>
              <div className="text-xs text-club-light-gray/70 dark:text-club-light-gray/70 light:text-gray-500">Total Shots</div>
            </div>
            <div className="p-3 rounded-lg border border-club-gold/10 dark:border-club-gold/10 light:border-gray-100 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-50/50">
              <div className="text-base sm:text-lg font-bold text-club-gold dark:text-club-gold light:text-purple-600">
                {playerShots.length > 0 ? ((playerGoals.length / playerShots.length) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-xs text-club-light-gray/70 dark:text-club-light-gray/70 light:text-gray-500">Conversion</div>
            </div>
            {attributes && (
              <div className="p-3 rounded-lg border border-club-gold/10 dark:border-club-gold/10 light:border-gray-100 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-50/50">
                <div className="text-base sm:text-lg font-bold text-club-gold dark:text-club-gold light:text-orange-600">{shootingEfficiency}</div>
                <div className="text-xs text-club-light-gray/70 dark:text-club-light-gray/70 light:text-gray-500">Shot Quality</div>
              </div>
            )}
          </div>

          {/* Player shooting profile based on attributes */}
          {attributes && (
            <div className="bg-club-black/20 dark:bg-club-black/20 light:bg-gray-50/50 rounded-lg p-4 mt-4 border border-club-gold/10 dark:border-club-gold/10 light:border-gray-100">
              <h4 className="font-semibold text-club-gold dark:text-club-gold light:text-yellow-600 mb-3">Shooting Profile</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-club-light-gray dark:text-club-light-gray light:text-gray-700">Finishing:</span>
                  <span className="font-medium text-club-gold dark:text-club-gold light:text-gray-900">{attributes.finishing}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-club-light-gray dark:text-club-light-gray light:text-gray-700">Positioning:</span>
                  <span className="font-medium text-club-gold dark:text-club-gold light:text-gray-900">{attributes.positioning}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-club-light-gray dark:text-club-light-gray light:text-gray-700">Preferred Foot:</span>
                  <span className="font-medium text-club-gold dark:text-club-gold light:text-gray-900">{attributes.preferred_foot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-club-light-gray dark:text-club-light-gray light:text-gray-700">Weak Foot:</span>
                  <span className="font-medium text-club-gold dark:text-club-gold light:text-gray-900">★{attributes.weak_foot_rating}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
