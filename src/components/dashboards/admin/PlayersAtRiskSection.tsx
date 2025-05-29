
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { PlayerAtRisk } from "@/hooks/use-players-at-risk";

interface PlayersAtRiskSectionProps {
  playersAtRisk: PlayerAtRisk[] | undefined;
  isLoading: boolean;
}

export const PlayersAtRiskSection = ({ playersAtRisk, isLoading }: PlayersAtRiskSectionProps) => {
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'suspended'>('all');

  // Filter players based on selected filter
  const filteredPlayers = playersAtRisk?.filter(player => {
    if (riskFilter === 'high') return player.riskLevel === 'HIGH';
    if (riskFilter === 'suspended') return !player.isEligible;
    return true;
  }) || [];

  // Get risk badge styling
  const getRiskBadgeStyle = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return 'bg-red-600/80 text-white';
      case 'MEDIUM': return 'bg-yellow-600/80 text-white';
      case 'LOW': return 'bg-green-600/80 text-white';
      default: return 'bg-gray-600/80 text-white';
    }
  };

  // Get status badge styling
  const getStatusBadgeStyle = (isEligible: boolean) => {
    return isEligible ? 'bg-green-600/80 text-white' : 'bg-red-600/80 text-white';
  };

  return (
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-club-gold flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Players at Risk
            </CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Players requiring immediate attention for compliance
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={riskFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRiskFilter('all')}
              className="border-club-gold/20 hover:bg-club-gold/10"
            >
              All ({playersAtRisk?.length || 0})
            </Button>
            <Button
              variant={riskFilter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRiskFilter('high')}
              className="border-club-gold/20 hover:bg-club-gold/10"
            >
              High Risk ({playersAtRisk?.filter(p => p.riskLevel === 'HIGH').length || 0})
            </Button>
            <Button
              variant={riskFilter === 'suspended' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRiskFilter('suspended')}
              className="border-club-gold/20 hover:bg-club-gold/10"
            >
              Suspended ({playersAtRisk?.filter(p => !p.isEligible).length || 0})
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full bg-club-gold/10" />
            <Skeleton className="h-8 w-full bg-club-gold/10" />
            <Skeleton className="h-8 w-full bg-club-gold/10" />
            <Skeleton className="h-8 w-full bg-club-gold/10" />
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="text-center py-8 text-club-light-gray/70">
            <AlertTriangle className="mx-auto h-12 w-12 text-club-gold/30 mb-4" />
            <p>No players found matching the selected filter.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-club-gold/20 hover:bg-club-gold/5">
                <TableHead className="text-club-light-gray">Player Name</TableHead>
                <TableHead className="text-club-light-gray">Risk Level</TableHead>
                <TableHead className="text-club-light-gray">Reason</TableHead>
                <TableHead className="text-club-light-gray">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.map((player) => (
                <TableRow key={player.id} className="border-club-gold/20 hover:bg-club-gold/5">
                  <TableCell className="text-club-light-gray font-medium">
                    {player.name}
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskBadgeStyle(player.riskLevel)}>
                      {player.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-club-light-gray">
                    {player.reason}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeStyle(player.isEligible)}>
                      {player.isEligible ? 'Eligible' : 'Ineligible'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
