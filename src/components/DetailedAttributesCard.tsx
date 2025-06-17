
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types";
import { usePlayerAttributes } from "@/hooks/use-player-attributes";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";

interface DetailedAttributesCardProps {
  player: Player;
}

interface AttributeBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

const AttributeBar = ({ label, value, maxValue = 100, color = "bg-primary" }: AttributeBarProps) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-club-light-gray light:text-gray-700">{label}</span>
      <span className="font-medium text-club-gold light:text-yellow-600">{value}</span>
    </div>
    <Progress value={(value / maxValue) * 100} className="h-2" />
  </div>
);

const AttributeSection = ({ title, attributes }: { title: string; attributes: Array<{label: string; value: number}> }) => (
  <div className="space-y-3">
    <h4 className="font-semibold text-club-gold light:text-yellow-600 border-b border-club-gold/30 light:border-yellow-600/30 pb-1">
      {title}
    </h4>
    <div className="space-y-2">
      {attributes.map((attr, index) => (
        <AttributeBar key={index} label={attr.label} value={attr.value} />
      ))}
    </div>
  </div>
);

export const DetailedAttributesCard = ({ player }: DetailedAttributesCardProps) => {
  const { attributes, positionalAverage, loading, error } = usePlayerAttributes(player);

  if (loading) return <ChartLoadingSkeleton />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!attributes) return <div className="text-club-light-gray light:text-gray-600">No detailed attributes available</div>;

  const physicalAttributes = [
    { label: "Pace", value: attributes.pace },
    { label: "Speed", value: attributes.speed },
    { label: "Acceleration", value: attributes.acceleration },
    { label: "Agility", value: attributes.agility },
    { label: "Strength", value: attributes.strength },
    { label: "Stamina", value: attributes.stamina },
    { label: "Jumping", value: attributes.jumping },
  ];

  const technicalAttributes = [
    { label: "Finishing", value: attributes.finishing },
    { label: "Heading", value: attributes.heading },
    { label: "Crossing", value: attributes.crossing },
    { label: "Passing", value: attributes.passing },
    { label: "Ball Control", value: attributes.ball_control },
    { label: "Dribbling", value: attributes.dribbling },
    { label: "Tackling", value: attributes.tackling },
    { label: "Marking", value: attributes.marking },
  ];

  const mentalAttributes = [
    { label: "Positioning", value: attributes.positioning },
    { label: "Vision", value: attributes.vision },
    { label: "Decision Making", value: attributes.decision_making },
    { label: "Mental Strength", value: attributes.mental_strength },
    { label: "Leadership", value: attributes.leadership },
    { label: "Communication", value: attributes.communication },
  ];

  const workRateAttributes = [
    { label: "Attacking Work Rate", value: attributes.work_rate_attacking },
    { label: "Defensive Work Rate", value: attributes.work_rate_defensive },
    { label: "Aerial Duels Won", value: attributes.aerial_duels_won },
    { label: "Hold-up Play", value: attributes.holdup_play },
  ];

  const getAttributeColor = (value: number, positionalAvg?: number) => {
    if (!positionalAvg) return "";
    if (value > positionalAvg + 10) return "text-green-500";
    if (value < positionalAvg - 10) return "text-red-500";
    return "";
  };

  return (
    <Card className="bg-club-black/80 border-club-gold/30 light:bg-white light:border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-club-gold light:text-yellow-600">
          <span>Player Attributes</span>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-club-gold/20 text-club-gold light:bg-yellow-600/20 light:text-yellow-700">
              {attributes.preferred_foot} Footed
            </Badge>
            <Badge variant="outline" className="border-club-gold/30 text-club-light-gray light:border-gray-300 light:text-gray-600">
              ★{attributes.skill_moves_rating} Skills
            </Badge>
            <Badge variant="outline" className="border-club-gold/30 text-club-light-gray light:border-gray-300 light:text-gray-600">
              ★{attributes.weak_foot_rating} Weak Foot
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <AttributeSection title="Physical Attributes" attributes={physicalAttributes} />
            <AttributeSection title="Technical Attributes" attributes={technicalAttributes} />
          </div>
          <div className="space-y-6">
            <AttributeSection title="Mental Attributes" attributes={mentalAttributes} />
            <AttributeSection title="Work Rate & Style" attributes={workRateAttributes} />
            
            {positionalAverage && (
              <div className="space-y-3">
                <h4 className="font-semibold text-club-gold light:text-yellow-600 border-b border-club-gold/30 light:border-yellow-600/30 pb-1">
                  Position Comparison ({player.position})
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-club-light-gray light:text-gray-700">Finishing vs Average:</span>
                    <span className={`font-medium ${getAttributeColor(attributes.finishing, positionalAverage.finishing)}`}>
                      {attributes.finishing} ({attributes.finishing > positionalAverage.finishing ? '+' : ''}{attributes.finishing - positionalAverage.finishing})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-club-light-gray light:text-gray-700">Pace vs Average:</span>
                    <span className={`font-medium ${getAttributeColor(attributes.pace, positionalAverage.pace)}`}>
                      {attributes.pace} ({attributes.pace > positionalAverage.pace ? '+' : ''}{attributes.pace - positionalAverage.pace})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-club-light-gray light:text-gray-700">Aerial Duels vs Average:</span>
                    <span className={`font-medium ${getAttributeColor(attributes.aerial_duels_won, positionalAverage.aerial_duels_won)}`}>
                      {attributes.aerial_duels_won} ({attributes.aerial_duels_won > positionalAverage.aerial_duels_won ? '+' : ''}{attributes.aerial_duels_won - positionalAverage.aerial_duels_won})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
