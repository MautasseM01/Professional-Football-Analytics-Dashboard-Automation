
import { usePlayerData } from "@/hooks/use-player-data";
import { useSquadAvailability } from "@/hooks/use-squad-availability";
import { useDevelopmentProgress } from "@/hooks/use-development-progress";
import { useExportData } from "@/hooks/use-export-data";
import { UserProfile } from "@/types";
import { PlayerStats } from "@/components/PlayerStats";
import { PlayerSelector } from "@/components/PlayerSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";
import { OptimizedAnalystDashboard } from "@/components/analyst/OptimizedAnalystDashboard";
import { 
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface AnalystDashboardProps {
  profile: UserProfile;
}

export const AnalystDashboard = ({ profile }: AnalystDashboardProps) => {
  const { players, selectedPlayer, selectPlayer, loading, error } = usePlayerData();

  // Check if user has analyst access
  const hasAnalystAccess = profile?.role === 'analyst' || 
                          profile?.role === 'admin' || 
                          profile?.role === 'management' ||
                          profile?.role === 'performance_director';

  if (!hasAnalystAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <Card className="bg-club-dark-gray border-club-gold/20 max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-16 w-16 text-club-gold mx-auto mb-4" />
            <h2 className="text-xl font-bold text-club-gold mb-2">Access Restricted</h2>
            <p className="text-club-light-gray/70">
              You need analyst-level permissions to access this dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Optimized Analytics Dashboard */}
      <OptimizedAnalystDashboard profile={profile} />

      {/* Enhanced Player Selector Integration */}
      <div className="bg-club-dark-gray/50 rounded-lg p-4 sm:p-6 border border-club-gold/10">
        <PlayerSelector
          players={players}
          selectedPlayer={selectedPlayer}
          onPlayerSelect={selectPlayer}
          loading={loading}
          error={error}
        />
      </div>

      {/* Enhanced Player Stats Component with Analyst Features */}
      {selectedPlayer && (
        <div className="bg-club-dark-gray/50 rounded-lg p-4 sm:p-6 border border-club-gold/10">
          <PlayerStats 
            player={selectedPlayer} 
            analystMode={true}
          />
        </div>
      )}
    </div>
  );
};
