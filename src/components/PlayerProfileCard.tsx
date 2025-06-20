import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types";
import { usePlayerAttributes } from "@/hooks/use-player-attributes";
import { PlayerAvatar } from "./PlayerAvatar";
import { ChartLoadingSkeleton } from "./LoadingStates";

interface PlayerProfileCardProps {
  player: Player;
}

export const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  const { attributes, loading } = usePlayerAttributes(player);

  if (loading) return <ChartLoadingSkeleton />;

  // Calculate overall rating based on position
  const calculateOverallRating = () => {
    if (!attributes) return 0;
    
    const position = player.position?.toLowerCase() || '';
    
    if (position.includes('goalkeeper') || position.includes('gk')) {
      // Goalkeeper-specific calculation
      return Math.round((
        attributes.positioning * 0.3 +
        attributes.mental_strength * 0.25 +
        attributes.decision_making * 0.25 +
        attributes.communication * 0.2
      ));
    } else if (position.includes('defender') || position.includes('cb') || position.includes('lb') || position.includes('rb')) {
      // Defender calculation
      return Math.round((
        attributes.tackling * 0.25 +
        attributes.marking * 0.25 +
        attributes.positioning * 0.2 +
        attributes.strength * 0.15 +
        attributes.passing * 0.15
      ));
    } else if (position.includes('midfielder') || position.includes('cm') || position.includes('dm') || position.includes('am')) {
      // Midfielder calculation
      return Math.round((
        attributes.passing * 0.3 +
        attributes.vision * 0.25 +
        attributes.ball_control * 0.2 +
        attributes.decision_making * 0.15 +
        attributes.stamina * 0.1
      ));
    } else {
      // Forward/Attacker calculation
      return Math.round((
        attributes.finishing * 0.3 +
        attributes.pace * 0.25 +
        attributes.dribbling * 0.2 +
        attributes.positioning * 0.15 +
        attributes.ball_control * 0.1
      ));
    }
  };

  const overallRating = calculateOverallRating();

  // Get top 3 attributes
  const getTopAttributes = () => {
    if (!attributes) return [];
    
    const attributeList = [
      { name: 'Pace', value: attributes.pace },
      { name: 'Finishing', value: attributes.finishing },
      { name: 'Passing', value: attributes.passing },
      { name: 'Dribbling', value: attributes.dribbling },
      { name: 'Tackling', value: attributes.tackling },
      { name: 'Positioning', value: attributes.positioning },
      { name: 'Vision', value: attributes.vision },
      { name: 'Strength', value: attributes.strength },
    ];
    
    return attributeList
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
  };

  const topAttributes = getTopAttributes();

  const getRatingColor = (rating: number) => {
    if (rating >= 85) return "text-green-500";
    if (rating >= 75) return "text-blue-500";
    if (rating >= 65) return "text-yellow-500";
    return "text-gray-500";
  };

  return (
    <Card className="bg-club-black/80 border-club-gold/30 light:bg-white light:border-gray-200">
      <CardHeader>
        <CardTitle className="text-club-gold light:text-yellow-600">Player Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Player Avatar and Basic Info */}
          <div className="flex flex-col items-center sm:items-start space-y-3">
            <PlayerAvatar player={player} size="lg" />
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-club-light-gray light:text-gray-900">
                {player.name}
              </h3>
              <p className="text-club-light-gray/80 light:text-gray-600">
                {player.position} {player.number && `• #${player.number}`}
              </p>
              {attributes && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className={`${getRatingColor(overallRating)} bg-club-gold/20 light:bg-yellow-600/20`}>
                    Overall: {overallRating}
                  </Badge>
                  <Badge variant="outline" className="border-club-gold/30 text-club-light-gray light:border-gray-300 light:text-gray-600">
                    {attributes.preferred_foot} Footed
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-club-black/40 light:bg-gray-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-club-gold light:text-yellow-600">
                {player.matches || 0}
              </div>
              <div className="text-xs text-club-light-gray/80 light:text-gray-600">Matches</div>
            </div>
            
            <div className="text-center p-3 bg-club-black/40 light:bg-gray-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-green-500">
                {player.goals || 0}
              </div>
              <div className="text-xs text-club-light-gray/80 light:text-gray-600">Goals</div>
            </div>
            
            <div className="text-center p-3 bg-club-black/40 light:bg-gray-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-blue-500">
                {player.assists || 0}
              </div>
              <div className="text-xs text-club-light-gray/80 light:text-gray-600">Assists</div>
            </div>
            
            <div className="text-center p-3 bg-club-black/40 light:bg-gray-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-purple-500">
                {player.match_rating ? player.match_rating.toFixed(1) : '0.0'}
              </div>
              <div className="text-xs text-club-light-gray/80 light:text-gray-600">Rating</div>
            </div>
          </div>
        </div>

        {/* Top Attributes Section */}
        {attributes && topAttributes.length > 0 && (
          <div className="mt-6 pt-4 border-t border-club-gold/30 light:border-gray-200">
            <h4 className="font-semibold text-club-gold light:text-yellow-600 mb-3">
              Top Attributes
            </h4>
            <div className="flex flex-wrap gap-2">
              {topAttributes.map((attr, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="border-club-gold/30 text-club-light-gray light:border-gray-300 light:text-gray-600"
                >
                  {attr.name}: {attr.value}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Player Style Information */}
        {attributes && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-club-light-gray light:text-gray-700">Work Rate:</span>
                <span className="font-medium text-club-light-gray light:text-gray-900">
                  {attributes.work_rate_attacking}/100 ATT | {attributes.work_rate_defensive}/100 DEF
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-club-light-gray light:text-gray-700">Skill Moves:</span>
                <span className="font-medium text-club-light-gray light:text-gray-900">
                  ★{attributes.skill_moves_rating} | Weak Foot: ★{attributes.weak_foot_rating}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-club-light-gray light:text-gray-700">Leadership:</span>
                <span className="font-medium text-club-light-gray light:text-gray-900">
                  {attributes.leadership}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-club-light-gray light:text-gray-700">Mental Strength:</span>
                <span className="font-medium text-club-light-gray light:text-gray-900">
                  {attributes.mental_strength}/100
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
