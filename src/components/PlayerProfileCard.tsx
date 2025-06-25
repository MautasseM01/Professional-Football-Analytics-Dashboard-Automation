import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Player } from "@/types";
import { usePlayerAttributes } from "@/hooks/use-player-attributes";
import { usePlayerDisciplinary } from "@/hooks/use-player-disciplinary";
import { PlayerAvatar } from "./PlayerAvatar";
import { ChartLoadingSkeleton } from "./LoadingStates";
import { 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  FileText,
  Shield,
  Activity,
  Clock
} from "lucide-react";

interface PlayerProfileCardProps {
  player: Player;
}

export const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  const { attributes, loading } = usePlayerAttributes(player);
  const { data: disciplinaryData } = usePlayerDisciplinary(player.id);

  if (loading) return <ChartLoadingSkeleton />;

  // Calculate overall rating based on position using real attributes
  const calculateOverallRating = () => {
    if (!attributes) return 0;
    
    const position = player.position?.toLowerCase() || '';
    
    if (position.includes('goalkeeper') || position.includes('gk')) {
      // Goalkeeper-specific calculation
      return Math.round((
        (attributes.positioning || 50) * 0.3 +
        (attributes.mental_strength || 50) * 0.25 +
        (attributes.decision_making || 50) * 0.25 +
        (attributes.communication || 50) * 0.2
      ));
    } else if (position.includes('defender') || position.includes('cb') || position.includes('lb') || position.includes('rb')) {
      // Defender calculation
      return Math.round((
        (attributes.tackling || 50) * 0.25 +
        (attributes.marking || 50) * 0.25 +
        (attributes.positioning || 50) * 0.2 +
        (attributes.strength || 50) * 0.15 +
        (attributes.passing || 50) * 0.15
      ));
    } else if (position.includes('midfielder') || position.includes('cm') || position.includes('dm') || position.includes('am')) {
      // Midfielder calculation
      return Math.round((
        (attributes.passing || 50) * 0.3 +
        (attributes.vision || 50) * 0.25 +
        (attributes.ball_control || 50) * 0.2 +
        (attributes.decision_making || 50) * 0.15 +
        (attributes.stamina || 50) * 0.1
      ));
    } else {
      // Forward/Attacker calculation
      return Math.round((
        (attributes.finishing || 50) * 0.3 +
        (attributes.pace || 50) * 0.25 +
        (attributes.dribbling || 50) * 0.2 +
        (attributes.positioning || 50) * 0.15 +
        (attributes.ball_control || 50) * 0.1
      ));
    }
  };

  const overallRating = calculateOverallRating();

  // Get top 3 attributes from real data
  const getTopAttributes = () => {
    if (!attributes) return [];
    
    const attributeList = [
      { name: 'Pace', value: attributes.pace || 0 },
      { name: 'Finishing', value: attributes.finishing || 0 },
      { name: 'Passing', value: attributes.passing || 0 },
      { name: 'Dribbling', value: attributes.dribbling || 0 },
      { name: 'Tackling', value: attributes.tackling || 0 },
      { name: 'Positioning', value: attributes.positioning || 0 },
      { name: 'Vision', value: attributes.vision || 0 },
      { name: 'Strength', value: attributes.strength || 0 },
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

  // Form indicator based on actual match rating
  const getFormIndicator = () => {
    const rating = player.match_rating || 0;
    if (rating >= 7.5) return { color: 'bg-green-500', label: 'Excellent Form' };
    if (rating >= 6.5) return { color: 'bg-amber-500', label: 'Average Form' };
    return { color: 'bg-red-500', label: 'Poor Form' };
  };

  const formIndicator = getFormIndicator();

  return (
    <Card className="bg-club-black/80 border-club-gold/30 light:bg-white light:border-gray-200">
      <CardHeader>
        <CardTitle className="text-club-gold light:text-yellow-600 flex items-center justify-between">
          <span>Player Profile</span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${formIndicator.color}`} title={formIndicator.label} />
          </div>
        </CardTitle>
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
                    {attributes.preferred_foot || 'Right'} Footed
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid - Using Real Database Fields */}
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

        {/* Player Information Based on Real Database Fields */}
        <div className="mt-6 pt-4 border-t border-club-gold/30 light:border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Form Indicator */}
            <div className="flex items-center gap-3 p-3 bg-club-black/40 light:bg-gray-50 rounded-lg">
              <Activity className="w-5 h-5 text-club-gold light:text-yellow-600" />
              <div>
                <div className="text-sm font-medium text-club-light-gray light:text-gray-900">Current Form</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${formIndicator.color}`} />
                  <span className="text-xs text-club-light-gray/70 light:text-gray-600">{formIndicator.label}</span>
                </div>
              </div>
            </div>

            {/* Minutes Played */}
            <div className="flex items-center gap-3 p-3 bg-club-black/40 light:bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-club-gold light:text-yellow-600" />
              <div>
                <div className="text-sm font-medium text-club-light-gray light:text-gray-900">Minutes</div>
                <div className="text-xs text-club-light-gray/70 light:text-gray-600">
                  {player.minutes_played || 0} mins
                </div>
              </div>
            </div>

            {/* Last Match */}
            <div className="flex items-center gap-3 p-3 bg-club-black/40 light:bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-club-gold light:text-yellow-600" />
              <div>
                <div className="text-sm font-medium text-club-light-gray light:text-gray-900">Last Match</div>
                <div className="text-xs text-club-light-gray/70 light:text-gray-600">
                  {player.last_match_date || 'N/A'}
                </div>
              </div>
            </div>

            {/* Disciplinary Record */}
            <div className="flex items-center gap-3 p-3 bg-club-black/40 light:bg-gray-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-club-gold light:text-yellow-600" />
              <div>
                <div className="text-sm font-medium text-club-light-gray light:text-gray-900">Discipline</div>
                <div className="text-xs text-club-light-gray/70 light:text-gray-600">
                  Clean Record
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Attributes Section - Using Real Data */}
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

        {/* Player Style Information - Using Real Database Fields */}
        {attributes && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-club-light-gray light:text-gray-700">Work Rate:</span>
                <span className="font-medium text-club-light-gray light:text-gray-900">
                  {attributes.work_rate_attacking || 50}/100 ATT | {attributes.work_rate_defensive || 50}/100 DEF
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-club-light-gray light:text-gray-700">Skill Moves:</span>
                <span className="font-medium text-club-light-gray light:text-gray-900">
                  ★{attributes.skill_moves_rating || 3} | Weak Foot: ★{attributes.weak_foot_rating || 3}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-club-light-gray light:text-gray-700">Leadership:</span>
                <span className="font-medium text-club-light-gray light:text-gray-900">
                  {attributes.leadership || 50}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-club-light-gray light:text-gray-700">Mental Strength:</span>
                <span className="font-medium text-club-light-gray light:text-gray-900">
                  {attributes.mental_strength || 50}/100
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Action Buttons - Simplified */}
        <div className="mt-6 pt-4 border-t border-club-gold/30 light:border-gray-200">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              View Schedule
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Performance Trends
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Training History
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
