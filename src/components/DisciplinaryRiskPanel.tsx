
import { AlertTriangle, Shield, Target, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface DisciplinaryRiskPanelProps {
  riskLevel: 'SAFE' | 'AT RISK' | 'CRITICAL';
  riskColor: string;
  cardsUntilSuspension: number;
  totalCards: number;
  fairPlayRating: number;
  teamAverageFairPlay: number;
  missedMatches: number;
}

export const DisciplinaryRiskPanel = ({
  riskLevel,
  riskColor,
  cardsUntilSuspension,
  totalCards,
  fairPlayRating,
  teamAverageFairPlay,
  missedMatches
}: DisciplinaryRiskPanelProps) => {
  const suspensionProgress = Math.max(0, ((5 - cardsUntilSuspension) / 5) * 100);
  const fairPlayComparison = fairPlayRating - teamAverageFairPlay;
  
  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'CRITICAL':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'AT RISK':
        return <Shield className="w-4 h-4 text-amber-500" />;
      default:
        return <Shield className="w-4 h-4 text-green-500" />;
    }
  };

  const getRiskBadgeColor = () => {
    switch (riskLevel) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'AT RISK':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-green-500/10 text-green-400 border-green-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Risk Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getRiskIcon()}
          <span className="text-club-light-gray text-sm">Current Status</span>
        </div>
        <Badge className={`${getRiskBadgeColor()} text-xs px-2 py-1`}>
          {riskLevel}
        </Badge>
      </div>

      {/* Suspension Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-club-light-gray text-sm">Cards to Suspension</span>
          <span className="text-club-gold font-medium text-sm">
            {cardsUntilSuspension > 0 ? `${cardsUntilSuspension} more` : 'At threshold'}
          </span>
        </div>
        <Progress 
          value={suspensionProgress} 
          className="h-2 bg-club-black"
        />
        <div className="flex justify-between text-xs text-club-light-gray/60">
          <span>0 cards</span>
          <span>5 cards (suspension)</span>
        </div>
      </div>

      {/* Fair Play Rating */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-club-light-gray text-sm">Fair Play Rating</span>
          <div className="flex items-center gap-2">
            <span className="text-club-gold font-medium text-sm">{fairPlayRating}/10</span>
            {fairPlayComparison > 0 ? (
              <TrendingUp className="w-3 h-3 text-green-500" />
            ) : (
              <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />
            )}
          </div>
        </div>
        <div className="text-xs text-club-light-gray/60">
          Team average: {teamAverageFairPlay}/10 
          <span className={fairPlayComparison > 0 ? 'text-green-500' : 'text-red-500'}>
            {' '}({fairPlayComparison > 0 ? '+' : ''}{fairPlayComparison.toFixed(1)})
          </span>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-club-gold/10">
        <div className="text-center">
          <div className="text-lg font-bold text-club-gold">{totalCards}</div>
          <div className="text-xs text-club-light-gray/60">Total Cards</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-club-gold">{missedMatches}</div>
          <div className="text-xs text-club-light-gray/60">Matches Missed</div>
        </div>
      </div>

      {/* Upcoming Risks */}
      {cardsUntilSuspension <= 1 && cardsUntilSuspension > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-1">
            <AlertTriangle className="w-3 h-3" />
            Warning: Next card triggers suspension
          </div>
          <p className="text-xs text-amber-300/80">
            Upcoming key matches: Arsenal (H), Liverpool (A), Champions League QF
          </p>
        </div>
      )}
    </div>
  );
};
