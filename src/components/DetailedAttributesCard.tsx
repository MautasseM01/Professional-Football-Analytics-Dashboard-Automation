
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types";
import { usePlayerAttributes } from "@/hooks/use-player-attributes";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, User, Zap, Brain, Shield, Star } from "lucide-react";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { ErrorFallback } from "@/components/ErrorStates/ErrorFallback";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";

interface DetailedAttributesCardProps {
  player: Player;
}

export const DetailedAttributesCard = ({ player }: DetailedAttributesCardProps) => {
  const { attributes, positionalAverage, loading, error } = usePlayerAttributes(player);
  const { theme } = useTheme();

  if (loading) {
    return <ChartLoadingSkeleton />;
  }

  if (error) {
    return (
      <Card className={cn(
        "border-club-gold/20",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardContent className="p-6">
          <ErrorFallback 
            title="Attributes data error"
            description={`Failed to load player attributes: ${error}`}
          />
        </CardContent>
      </Card>
    );
  }

  if (!attributes) {
    return (
      <Card className={cn(
        "border-club-gold/20",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardContent className="p-6">
          <ErrorFallback 
            title="No attributes data"
            description="Player attributes are not available"
          />
        </CardContent>
      </Card>
    );
  }

  // Prepare radar chart data
  const radarData = [
    { attribute: "Pace", player: attributes.pace, average: positionalAverage?.pace || 50 },
    { attribute: "Finishing", player: attributes.finishing, average: positionalAverage?.finishing || 50 },
    { attribute: "Passing", player: attributes.passing, average: 50 },
    { attribute: "Dribbling", player: attributes.dribbling, average: 50 },
    { attribute: "Tackling", player: attributes.tackling, average: 50 },
    { attribute: "Strength", player: attributes.strength, average: 50 },
    { attribute: "Vision", player: attributes.vision, average: 50 },
    { attribute: "Mental", player: attributes.mental_strength, average: 50 }
  ];

  const getAttributeColor = (value: number) => {
    if (value >= 80) return "text-green-500";
    if (value >= 70) return "text-club-gold";
    if (value >= 60) return "text-blue-400";
    if (value >= 50) return "text-gray-400";
    return "text-red-400";
  };

  const getAttributeBadge = (value: number) => {
    if (value >= 80) return "Excellent";
    if (value >= 70) return "Good";
    if (value >= 60) return "Average";
    if (value >= 50) return "Below Average";
    return "Poor";
  };

  return (
    <Card className={cn(
      "border-club-gold/20 transition-all duration-300",
      theme === 'dark' 
        ? "bg-club-dark-gray hover:bg-club-dark-gray/80" 
        : "bg-white hover:bg-gray-50"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-club-gold">
          <User className="w-5 h-5" />
          Player Attributes
        </CardTitle>
        <CardDescription className="text-club-light-gray/70 light:text-gray-600">
          Comprehensive skill assessment and comparison
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Radar Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <PolarAngleAxis 
                dataKey="attribute" 
                tick={{ 
                  fontSize: 12, 
                  fill: theme === 'dark' ? '#d1d5db' : '#374151' 
                }} 
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ 
                  fontSize: 10, 
                  fill: theme === 'dark' ? '#9ca3af' : '#6b7280' 
                }} 
              />
              <Radar
                name="Player"
                dataKey="player"
                stroke="#D4AF37"
                fill="#D4AF37"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              {positionalAverage && (
                <Radar
                  name="Position Average"
                  dataKey="average"
                  stroke="#9ca3af"
                  fill="#9ca3af"
                  fillOpacity={0.1}
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
              )}
              <Legend 
                wrapperStyle={{ 
                  fontSize: '12px', 
                  color: theme === 'dark' ? '#d1d5db' : '#374151' 
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Attributes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Physical Attributes */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-club-light-gray light:text-gray-900 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Physical
            </h3>
            <div className="space-y-2">
              {[
                { label: "Pace", value: attributes.pace },
                { label: "Acceleration", value: attributes.acceleration },
                { label: "Strength", value: attributes.strength },
                { label: "Stamina", value: attributes.stamina },
                { label: "Agility", value: attributes.agility },
                { label: "Jumping", value: attributes.jumping }
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-club-light-gray/80 light:text-gray-700">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${getAttributeColor(value)}`}>
                      {value}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {getAttributeBadge(value)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Attributes */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-club-light-gray light:text-gray-900 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Technical
            </h3>
            <div className="space-y-2">
              {[
                { label: "Finishing", value: attributes.finishing },
                { label: "Passing", value: attributes.passing },
                { label: "Ball Control", value: attributes.ball_control },
                { label: "Dribbling", value: attributes.dribbling },
                { label: "Crossing", value: attributes.crossing },
                { label: "Vision", value: attributes.vision }
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-club-light-gray/80 light:text-gray-700">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${getAttributeColor(value)}`}>
                      {value}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {getAttributeBadge(value)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mental & Defensive */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-club-light-gray light:text-gray-900 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Mental & Defensive
            </h3>
            <div className="space-y-2">
              {[
                { label: "Decision Making", value: attributes.decision_making },
                { label: "Mental Strength", value: attributes.mental_strength },
                { label: "Leadership", value: attributes.leadership },
                { label: "Tackling", value: attributes.tackling },
                { label: "Marking", value: attributes.marking },
                { label: "Positioning", value: attributes.positioning }
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-club-light-gray/80 light:text-gray-700">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${getAttributeColor(value)}`}>
                      {value}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {getAttributeBadge(value)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-club-gold/20">
          <div className="flex items-center gap-2">
            <span className="text-sm text-club-light-gray/70 light:text-gray-600">Preferred Foot:</span>
            <Badge variant="outline">{attributes.preferred_foot}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-club-light-gray/70 light:text-gray-600">Weak Foot:</span>
            <Badge variant="outline">{attributes.weak_foot_rating}/5</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-club-light-gray/70 light:text-gray-600">Skill Moves:</span>
            <Badge variant="outline">{attributes.skill_moves_rating}/5</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
