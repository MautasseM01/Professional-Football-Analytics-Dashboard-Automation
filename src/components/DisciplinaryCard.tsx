
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { usePlayerDisciplinary } from "@/hooks/use-player-disciplinary";
import { Skeleton } from "@/components/ui/skeleton";

interface DisciplinaryCardProps {
  playerId: number | null;
}

export const DisciplinaryCard = ({ playerId }: DisciplinaryCardProps) => {
  const { data: disciplinaryData, isLoading } = usePlayerDisciplinary(playerId);

  if (isLoading) {
    return (
      <Card className="border-club-gold/20 bg-club-dark-gray">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-club-light-gray/70 flex items-center">Disciplinary Record</p>
              <Skeleton className="h-8 w-16 bg-club-gold/10 mt-1" />
              <Skeleton className="h-4 w-24 bg-club-gold/10 mt-2" />
            </div>
            <AlertTriangle size={24} className="text-club-gold/30" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!disciplinaryData) {
    return (
      <Card className="border-club-gold/20 bg-club-dark-gray">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-club-light-gray/70 flex items-center">Disciplinary Record</p>
              <p className="text-2xl font-bold text-club-gold">0</p>
              <p className="text-xs text-club-light-gray/60 mt-1">No cards</p>
            </div>
            <AlertTriangle size={24} className="text-club-gold/30" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-club-gold/20 bg-club-dark-gray">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-club-light-gray/70 flex items-center">Disciplinary Record</p>
            <p className="text-2xl font-bold text-club-gold">{disciplinaryData.totalCards}</p>
            <p className="text-xs text-club-light-gray/60 mt-1">
              {disciplinaryData.yellowCards}Y, {disciplinaryData.redCards}R
            </p>
            <p className={`text-xs font-semibold mt-1 ${disciplinaryData.riskColor}`}>
              {disciplinaryData.riskLevel}
            </p>
          </div>
          <AlertTriangle size={24} className="text-club-gold/30" />
        </div>
      </CardContent>
    </Card>
  );
};
