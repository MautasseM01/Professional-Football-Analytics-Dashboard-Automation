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
  Clock,
  User
} from "lucide-react";

interface PlayerProfileCardProps {
  player: Player;
}

export const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  const { attributes, loading } = usePlayerAttributes(player);
  const { data: disciplinaryData } = usePlayerDisciplinary(player.id);

  if (loading) return <ChartLoadingSkeleton />;

  if (!player) {
    return (
      <Card className="bg-club-black/80 border-club-gold/30 light:bg-white light:border-gray-200">
        <CardContent className="p-6 text-center">
          <User className="w-12 h-12 mx-auto text-club-light-gray/50 light:text-gray-400 mb-4" />
          <p className="text-club-light-gray/70 light:text-gray-600">No player selected</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate overall rating based on position
  const calculateOverallRating = () => {
    if (!attributes) return player.match_rating ? Math.round(player.match_rating * 10) : 0;
    
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

  // Get top 3 attributes
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
    ].filter(attr => attr.value > 0);
    
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

  // Enhanced coaching information
  const getFormIndicator = () => {
    const rating = player.match_rating || 0;
    if (rating >= 7.5) return { color: 'bg-green-500', label: 'Excellent Form', dot: 'bg-green-500' };
    if (rating >= 6.5) return { color: 'bg-blue-500', label: 'Good Form', dot: 'bg-blue-500' };
    if (rating >= 5.0) return { color: 'bg-amber-500', label: 'Average Form', dot: 'bg-amber-500' };
    return { color: 'bg-red-500', label: 'Poor Form', dot: 'bg-red-500' };
  };

  const getContractStatus = () => {
    // Mock contract data - in real app would come from database
    return {
      expiryDate: '2025-06-30',
      status: 'Active',
      daysRemaining: 180
    };
  };

  const getInjuryHistory = () => {
    // Mock injury data - in real app would come from database
    return {
      recentInjuries: 0,
      daysOut: 0,
      riskLevel: 'Low'
    };
  };

  const formIndicator = getFormIndicator();
  const contractStatus = getContractStatus();
  const injuryHistory = getInjuryHistory();

  return (
    <Card className="bg-club-black/80 border-club-gold/30 light:bg-white light:border-gray-200">
      <CardHeader>
        <CardTitle className="text-primary flex items-center justify-between">
          <span>{/* TODO: Add translation */}Player Profile</span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${formIndicator.dot}`} title={formIndicator.label} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Player Avatar and Basic Info */}
          <div className="flex flex-col items-center sm:items-start space-y-3">
            <PlayerAvatar player={player} size="lg" />
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-foreground">
                {player.name || 'Unknown Player'}
              </h3>
              <p className="text-muted-foreground">
                {player.position || 'Unknown Position'} {player.number && `• #${player.number}`}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className={`${getRatingColor(overallRating)} bg-accent/20`}>
                  Overall: {overallRating}
                </Badge>
                {attributes?.preferred_foot && (
                  <Badge variant="outline" className="border-border text-foreground">
                    {attributes.preferred_foot} Footed
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-accent/20 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-primary">
                {player.matches || 0}
              </div>
              <div className="text-xs text-muted-foreground">Matches</div>
            </div>
            
            <div className="text-center p-3 bg-accent/20 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-green-500">
                {player.goals || 0}
              </div>
              <div className="text-xs text-muted-foreground">Goals</div>
            </div>
            
            <div className="text-center p-3 bg-accent/20 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-blue-500">
                {player.assists || 0}
              </div>
              <div className="text-xs text-muted-foreground">Assists</div>
            </div>
            
            <div className="text-center p-3 bg-accent/20 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-purple-500">
                {player.match_rating ? player.match_rating.toFixed(1) : '0.0'}
              </div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
          </div>
        </div>

        {/* Coaching-Specific Information */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Form Indicator */}
            <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
              <Activity className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-medium text-foreground">Current Form</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${formIndicator.dot}`} />
                  <span className="text-xs text-muted-foreground">{formIndicator.label}</span>
                </div>
              </div>
            </div>

            {/* Contract Status */}
            <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-medium text-foreground">Contract</div>
                <div className="text-xs text-muted-foreground">
                  {contractStatus.daysRemaining} days left
                </div>
              </div>
            </div>

            {/* Injury Status */}
            <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-medium text-foreground">Fitness</div>
                <div className="text-xs text-muted-foreground">
                  {injuryHistory.riskLevel} Risk
                </div>
              </div>
            </div>

            {/* Disciplinary Record */}
            <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-medium text-foreground">Discipline</div>
                <div className="text-xs text-muted-foreground">
                  {disciplinaryData?.yellowCards || 0}Y {disciplinaryData?.redCards || 0}R
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Attributes Section */}
        {topAttributes.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="font-semibold text-primary mb-3">
              Top Attributes
            </h4>
            <div className="flex flex-wrap gap-2">
              {topAttributes.map((attr, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="border-border text-foreground"
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
                <span className="text-muted-foreground">Work Rate:</span>
                <span className="font-medium text-foreground">
                  {attributes.work_rate_attacking || 50}/100 ATT | {attributes.work_rate_defensive || 50}/100 DEF
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Skill Moves:</span>
                <span className="font-medium text-foreground">
                  ★{attributes.skill_moves_rating || 3} | Weak Foot: ★{attributes.weak_foot_rating || 3}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Leadership:</span>
                <span className="font-medium text-foreground">
                  {attributes.leadership || 50}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mental Strength:</span>
                <span className="font-medium text-foreground">
                  {attributes.mental_strength || 50}/100
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="mt-6 pt-4 border-t border-border">
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
