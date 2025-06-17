
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Player } from "@/types";
import { usePlayerAttributes } from "@/hooks/use-player-attributes";
import { Badge } from "@/components/ui/badge";
import { Target, Zap, Shield, Activity, Brain, Users, Loader } from "lucide-react";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { ErrorFallback } from "@/components/ErrorStates/ErrorFallback";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface DetailedAttributesCardProps {
  player: Player;
}

export const DetailedAttributesCard = ({ player }: DetailedAttributesCardProps) => {
  const { attributes, loading, error } = usePlayerAttributes(player);
  const { theme } = useTheme();

  if (loading) {
    return (
      <Card className={cn(
        "border-club-gold/20",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-club-gold">
            <Target className="w-5 h-5" />
            Detailed Player Attributes
          </CardTitle>
          <CardDescription className="text-club-light-gray/70 light:text-gray-600">
            Comprehensive breakdown of player skills and abilities
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-2">
            <Loader className="h-8 w-8 text-club-gold animate-spin" />
            <p className="text-sm text-club-light-gray">Loading player attributes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn(
        "border-club-gold/20",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-club-gold">
            <Target className="w-5 h-5" />
            Detailed Player Attributes
          </CardTitle>
        </CardHeader>
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-club-gold">
            <Target className="w-5 h-5" />
            Detailed Player Attributes
          </CardTitle>
          <CardDescription className="text-club-light-gray/70 light:text-gray-600">
            Comprehensive breakdown of player skills and abilities
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <Target className="w-12 h-12 mx-auto text-club-light-gray/40 light:text-gray-400" />
            <div>
              <p className="text-club-light-gray light:text-gray-700">No attributes data available</p>
              <p className="text-sm text-club-light-gray/60 light:text-gray-500 mt-1">
                Player attributes have not been recorded yet
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const attributeCategories = [
    {
      title: "Physical",
      icon: Activity,
      color: "text-green-500",
      attributes: [
        { name: "Pace", value: attributes.pace },
        { name: "Speed", value: attributes.speed },
        { name: "Acceleration", value: attributes.acceleration },
        { name: "Agility", value: attributes.agility },
        { name: "Strength", value: attributes.strength },
        { name: "Stamina", value: attributes.stamina },
        { name: "Jumping", value: attributes.jumping }
      ]
    },
    {
      title: "Technical",
      icon: Target,
      color: "text-blue-500",
      attributes: [
        { name: "Finishing", value: attributes.finishing },
        { name: "Ball Control", value: attributes.ball_control },
        { name: "Dribbling", value: attributes.dribbling },
        { name: "Crossing", value: attributes.crossing },
        { name: "Passing", value: attributes.passing },
        { name: "Heading", value: attributes.heading }
      ]
    },
    {
      title: "Mental",
      icon: Brain,
      color: "text-purple-500",
      attributes: [
        { name: "Vision", value: attributes.vision },
        { name: "Positioning", value: attributes.positioning },
        { name: "Decision Making", value: attributes.decision_making },
        { name: "Mental Strength", value: attributes.mental_strength },
        { name: "Leadership", value: attributes.leadership },
        { name: "Communication", value: attributes.communication }
      ]
    },
    {
      title: "Defensive",
      icon: Shield,
      color: "text-red-500",
      attributes: [
        { name: "Tackling", value: attributes.tackling },
        { name: "Marking", value: attributes.marking },
        { name: "Defensive Work Rate", value: attributes.work_rate_defensive },
        { name: "Aerial Duels", value: attributes.aerial_duels_won }
      ]
    }
  ];

  const getAttributeColor = (value: number) => {
    if (value >= 80) return "text-green-500";
    if (value >= 70) return "text-blue-500";
    if (value >= 60) return "text-yellow-500";
    if (value >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 70) return "bg-blue-500";
    if (value >= 60) return "bg-yellow-500";
    if (value >= 50) return "bg-orange-500";
    return "bg-red-500";
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
          <Target className="w-5 h-5" />
          Detailed Player Attributes
        </CardTitle>
        <CardDescription className="text-club-light-gray/70 light:text-gray-600">
          Comprehensive breakdown of player skills and abilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Player Specifics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Badge variant="outline" className="mb-2">Preferred Foot</Badge>
            <p className="font-semibold text-club-light-gray light:text-gray-900">{attributes.preferred_foot}</p>
          </div>
          <div className="text-center">
            <Badge variant="outline" className="mb-2">Weak Foot</Badge>
            <p className="font-semibold text-club-light-gray light:text-gray-900">{attributes.weak_foot_rating}★</p>
          </div>
          <div className="text-center">
            <Badge variant="outline" className="mb-2">Skill Moves</Badge>
            <p className="font-semibold text-club-light-gray light:text-gray-900">{attributes.skill_moves_rating}★</p>
          </div>
          <div className="text-center">
            <Badge variant="outline" className="mb-2">Work Rate</Badge>
            <p className="font-semibold text-club-light-gray light:text-gray-900 text-xs">
              {attributes.work_rate_attacking}/10 ATT<br/>
              {attributes.work_rate_defensive}/10 DEF
            </p>
          </div>
        </div>

        {/* Attribute Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {attributeCategories.map((category) => (
            <div key={category.title} className="space-y-4">
              <h3 className={`text-lg font-semibold flex items-center gap-2 ${category.color}`}>
                <category.icon className="w-5 h-5" />
                {category.title}
              </h3>
              <div className="space-y-3">
                {category.attributes.map((attr) => (
                  <div key={attr.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-club-light-gray light:text-gray-700">
                        {attr.name}
                      </span>
                      <span className={`text-sm font-bold ${getAttributeColor(attr.value)}`}>
                        {attr.value}
                      </span>
                    </div>
                    <Progress 
                      value={attr.value} 
                      className="h-2"
                      style={{
                        '--progress-background': getProgressColor(attr.value)
                      } as React.CSSProperties}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Special Attributes */}
        <div className="border-t border-club-gold/20 pt-6">
          <h3 className="text-lg font-semibold text-club-gold flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5" />
            Specialized Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-club-light-gray light:text-gray-700">
                  Hold-up Play
                </span>
                <span className={`text-sm font-bold ${getAttributeColor(attributes.holdup_play)}`}>
                  {attributes.holdup_play}
                </span>
              </div>
              <Progress value={attributes.holdup_play} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-club-light-gray light:text-gray-700">
                  Attacking Work Rate
                </span>
                <span className={`text-sm font-bold ${getAttributeColor(attributes.work_rate_attacking)}`}>
                  {attributes.work_rate_attacking}
                </span>
              </div>
              <Progress value={attributes.work_rate_attacking} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
