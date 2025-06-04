
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Shield, AlertCircle } from "lucide-react";
import { useState } from "react";
import { PlayerAtRisk } from "@/hooks/use-players-at-risk";

interface PlayersAtRiskSectionProps {
  playersAtRisk: PlayerAtRisk[] | undefined;
  isLoading: boolean;
}

export const PlayersAtRiskSection = ({ playersAtRisk, isLoading }: PlayersAtRiskSectionProps) => {
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'suspended' | 'warning'>('all');

  // Filter players based on selected filter
  const filteredPlayers = playersAtRisk?.filter(player => {
    if (riskFilter === 'high') return player.riskLevel === 'HIGH';
    if (riskFilter === 'suspended') return player.riskLevel === 'SUSPENDED';
    if (riskFilter === 'warning') return player.riskLevel === 'WARNING';
    return true;
  }) || [];

  // Get risk badge styling and icon
  const getRiskInfo = (riskLevel: string) => {
    switch (riskLevel) {
      case 'SUSPENDED': 
        return { 
          className: 'bg-red-600/90 text-white border-red-600', 
          icon: <Shield className="w-3 h-3" />
        };
      case 'HIGH': 
        return { 
          className: 'bg-amber-600/90 text-white border-amber-600', 
          icon: <AlertTriangle className="w-3 h-3" />
        };
      case 'WARNING': 
        return { 
          className: 'bg-yellow-600/90 text-black border-yellow-600', 
          icon: <AlertCircle className="w-3 h-3" />
        };
      default: 
        return { 
          className: 'bg-gray-600/90 text-white border-gray-600', 
          icon: <AlertCircle className="w-3 h-3" />
        };
    }
  };

  // Count players by risk level
  const riskCounts = {
    total: playersAtRisk?.length || 0,
    high: playersAtRisk?.filter(p => p.riskLevel === 'HIGH').length || 0,
    suspended: playersAtRisk?.filter(p => p.riskLevel === 'SUSPENDED').length || 0,
    warning: playersAtRisk?.filter(p => p.riskLevel === 'WARNING').length || 0
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader className="p-3 xs:p-4 sm:p-6">
        <div className="flex flex-col gap-3 xs:gap-4">
          <div>
            <CardTitle className="text-club-gold flex items-center text-base xs:text-lg sm:text-xl">
              <AlertTriangle className="mr-2 h-4 w-4 xs:h-5 xs:w-5" />
              Players at Risk
            </CardTitle>
            <CardDescription className="text-club-light-gray/70 text-xs xs:text-sm mt-1">
              Players requiring immediate attention for disciplinary compliance
            </CardDescription>
          </div>
          <div className="grid grid-cols-2 xs:flex xs:flex-wrap gap-1 xs:gap-2">
            <Button
              variant={riskFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRiskFilter('all')}
              className="border-club-gold/20 hover:bg-club-gold/10 text-xs h-8 px-2 xs:px-3"
            >
              All ({riskCounts.total})
            </Button>
            <Button
              variant={riskFilter === 'suspended' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRiskFilter('suspended')}
              className="border-club-gold/20 hover:bg-club-gold/10 text-xs h-8 px-2 xs:px-3"
            >
              Suspended ({riskCounts.suspended})
            </Button>
            <Button
              variant={riskFilter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRiskFilter('high')}
              className="border-club-gold/20 hover:bg-club-gold/10 text-xs h-8 px-2 xs:px-3"
            >
              High Risk ({riskCounts.high})
            </Button>
            <Button
              variant={riskFilter === 'warning' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRiskFilter('warning')}
              className="border-club-gold/20 hover:bg-club-gold/10 text-xs h-8 px-2 xs:px-3"
            >
              Warning ({riskCounts.warning})
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 xs:p-4 sm:p-6 pt-0">
        {isLoading ? (
          <div className="grid gap-3 xs:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full bg-club-gold/10" />
            ))}
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="text-center py-6 xs:py-8 text-club-light-gray/70">
            <AlertTriangle className="mx-auto h-10 w-10 xs:h-12 xs:w-12 text-club-gold/30 mb-3 xs:mb-4" />
            <p className="text-sm xs:text-base lg:text-lg mb-2">
              {riskFilter === 'all' 
                ? 'No players currently at risk' 
                : `No players found in ${riskFilter} category`
              }
            </p>
            <p className="text-xs xs:text-sm">
              {riskFilter === 'all' 
                ? 'All players are maintaining good disciplinary records.' 
                : 'Try selecting a different filter to view other risk categories.'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-3 xs:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlayers.map((player) => {
              const riskInfo = getRiskInfo(player.riskLevel);
              
              return (
                <Card key={player.id} className="bg-club-black/50 border-club-gold/20 hover:border-club-gold/40 transition-colors">
                  <CardContent className="p-3 xs:p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0 mr-2">
                        <h3 className="font-semibold text-club-light-gray truncate text-sm xs:text-base">
                          {player.name}
                        </h3>
                        <p className="text-xs xs:text-sm text-club-light-gray/70">
                          {player.position}
                        </p>
                      </div>
                      <Badge className={`${riskInfo.className} flex items-center gap-1 text-xs font-medium flex-shrink-0`}>
                        {riskInfo.icon}
                        <span className="hidden xs:inline">{player.riskLevel}</span>
                        <span className="xs:hidden">{player.riskLevel.slice(0, 3)}</span>
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 xs:space-y-2">
                      <div className="flex justify-between text-xs xs:text-sm">
                        <span className="text-club-light-gray/80">Yellow Cards:</span>
                        <span className="font-medium text-yellow-400">{player.yellowCards}</span>
                      </div>
                      
                      {player.redCards > 0 && (
                        <div className="flex justify-between text-xs xs:text-sm">
                          <span className="text-club-light-gray/80">Red Cards:</span>
                          <span className="font-medium text-red-400">{player.redCards}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-xs xs:text-sm">
                        <span className="text-club-light-gray/80">Last Card:</span>
                        <span className="text-club-light-gray/60">
                          {formatDate(player.lastCardDate)}
                        </span>
                      </div>
                      
                      {player.suspensionUntil && (
                        <div className="flex justify-between text-xs xs:text-sm">
                          <span className="text-club-light-gray/80">Suspended Until:</span>
                          <span className="text-red-400 font-medium">
                            {formatDate(player.suspensionUntil)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 xs:mt-3 pt-2 xs:pt-3 border-t border-club-gold/20">
                      <p className="text-xs text-club-light-gray/70 leading-relaxed">
                        {player.reason}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
