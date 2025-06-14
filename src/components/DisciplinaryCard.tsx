
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
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
      <Card className="
        border-club-gold/20 bg-club-black 
        transition-all duration-300 ease-in-out
        hover:border-club-gold/40 hover:shadow-lg 
        hover:scale-[1.02] active:scale-[0.98]
        group h-full
      ">
        <CardContent className="p-4 sm:p-5 lg:p-6 h-full flex flex-col justify-between min-h-[140px]">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm text-gray-300 font-medium leading-tight min-w-0 flex-1">
                Disciplinary Record
              </div>
              <div className="text-club-gold/50 flex-shrink-0 group-hover:text-club-gold transition-colors duration-300">
                <div className="w-4 h-4 sm:w-5 sm:h-5">
                  <AlertTriangle />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <Skeleton className="h-8 w-16 bg-club-gold/10" />
              <Skeleton className="h-4 w-24 bg-club-gold/10" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!disciplinaryData) {
    return (
      <Card className="
        border-club-gold/20 bg-club-black 
        transition-all duration-300 ease-in-out
        hover:border-club-gold/40 hover:shadow-lg 
        hover:scale-[1.02] active:scale-[0.98]
        group h-full
      ">
        <CardContent className="p-4 sm:p-5 lg:p-6 h-full flex flex-col justify-between min-h-[140px]">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm text-gray-300 font-medium leading-tight min-w-0 flex-1">
                Disciplinary Record
              </div>
              <div className="text-club-gold/50 flex-shrink-0 group-hover:text-club-gold transition-colors duration-300">
                <div className="w-4 h-4 sm:w-5 sm:h-5">
                  <AlertTriangle />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-club-gold break-words leading-tight group-hover:text-club-gold/90 transition-colors duration-300">
                0
              </div>
              <div className="text-xs text-green-500 break-words leading-tight font-semibold">
                Clean Record (SAFE)
              </div>
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
    <Card className="
      border-club-gold/20 bg-club-black 
      transition-all duration-300 ease-in-out
      hover:border-club-gold/40 hover:shadow-lg 
      hover:scale-[1.02] active:scale-[0.98]
      group h-full
    ">
      <CardContent className="p-4 sm:p-5 lg:p-6 h-full flex flex-col justify-between min-h-[140px]">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm text-gray-300 font-medium leading-tight min-w-0 flex-1">
              Disciplinary Record
            </div>
            <div className="text-club-gold/50 flex-shrink-0 group-hover:text-club-gold transition-colors duration-300">
              <div className="w-4 h-4 sm:w-5 sm:h-5">
                <AlertTriangle />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-club-gold break-words leading-tight group-hover:text-club-gold/90 transition-colors duration-300">
              {disciplinaryData.totalCards}
            </div>
            <div className="text-xs text-gray-400 break-words leading-tight">
              {disciplinaryData.totalCards === 0 ? (
                <span className="text-green-500 font-semibold">Clean Record (SAFE)</span>
              ) : (
                <div className="flex items-center gap-1 flex-wrap">
                  {/* Yellow Cards */}
                  {yellowCardsArray.map((_, index) => (
                    <CardIcon key={`yellow-${index}`} type="yellow" />
                  ))}
                  
                  {/* Red Cards */}
                  {redCardsArray.map((_, index) => (
                    <CardIcon key={`red-${index}`} type="red" />
                  ))}
                  
                  <span className={`ml-2 text-xs font-semibold ${disciplinaryData.riskColor}`}>
                    {disciplinaryData.riskLevel}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
