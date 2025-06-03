
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Check } from "lucide-react";
import { usePlayerDisciplinary } from "@/hooks/use-player-disciplinary";
import { Skeleton } from "@/components/ui/skeleton";

interface DisciplinaryCardProps {
  playerId: number | null;
}

const CardIcon = ({ type }: { type: 'yellow' | 'red' }) => {
  const bgColor = type === 'yellow' ? 'bg-[#FCD34D]' : 'bg-[#EF4444]';
  const letter = type === 'yellow' ? 'Y' : 'R';
  
  return (
    <div className={`${bgColor} text-black text-xs font-bold w-6 h-8 rounded-sm flex items-center justify-center shadow-sm border border-gray-300`}>
      {letter}
    </div>
  );
};

export const DisciplinaryCard = ({ playerId }: DisciplinaryCardProps) => {
  const { data: disciplinaryData, isLoading } = usePlayerDisciplinary(playerId);

  if (isLoading) {
    return (
      <Card className="border-club-gold/20 bg-club-dark-gray">
        <CardContent className="h-[140px] p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between h-full">
            <div className="min-w-0 flex-1 space-y-3 flex flex-col justify-center">
              <div className="text-xs sm:text-sm text-club-light-gray/70 font-medium leading-tight">
                Disciplinary Record
              </div>
              <div className="space-y-1">
                <Skeleton className="h-8 w-16 bg-club-gold/10" />
                <Skeleton className="h-4 w-24 bg-club-gold/10" />
              </div>
            </div>
            <div className="text-club-gold/30 ml-4 flex-shrink-0 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!disciplinaryData) {
    return (
      <Card className="border-club-gold/20 bg-club-dark-gray">
        <CardContent className="h-[140px] p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between h-full">
            <div className="min-w-0 flex-1 space-y-3 flex flex-col justify-center">
              <div className="text-xs sm:text-sm text-club-light-gray/70 font-medium leading-tight">
                Disciplinary Record
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-club-gold break-words leading-tight">
                  0
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-xs sm:text-sm text-green-500">Clean Record</span>
                </div>
              </div>
            </div>
            <div className="text-club-gold/30 ml-4 flex-shrink-0 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Create arrays of cards to display
  const yellowCardsArray = Array.from({ length: disciplinaryData.yellowCards }, (_, i) => i);
  const redCardsArray = Array.from({ length: disciplinaryData.redCards }, (_, i) => i);

  return (
    <Card className="border-club-gold/20 bg-club-dark-gray">
      <CardContent className="h-[140px] p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between h-full">
          <div className="min-w-0 flex-1 space-y-3 flex flex-col justify-center">
            <div className="text-xs sm:text-sm text-club-light-gray/70 font-medium leading-tight">
              Disciplinary Record
            </div>
            <div className="space-y-2">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-club-gold break-words leading-tight">
                {disciplinaryData.totalCards}
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {/* Yellow Cards */}
                {yellowCardsArray.map((_, index) => (
                  <CardIcon key={`yellow-${index}`} type="yellow" />
                ))}
                
                {/* Red Cards */}
                {redCardsArray.map((_, index) => (
                  <CardIcon key={`red-${index}`} type="red" />
                ))}
                
                {/* Show clean record if no cards */}
                {disciplinaryData.totalCards === 0 && (
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-xs sm:text-sm text-green-500">Clean Record</span>
                  </div>
                )}
              </div>
              <div className={`text-xs font-semibold ${disciplinaryData.riskColor}`}>
                {disciplinaryData.riskLevel}
              </div>
            </div>
          </div>
          <div className="text-club-gold/30 ml-4 flex-shrink-0 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
