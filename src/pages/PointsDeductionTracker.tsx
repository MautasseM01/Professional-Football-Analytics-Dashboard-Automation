
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Download, TrendingDown, TrendingUp, Shield, FileText } from 'lucide-react';
import { ResponsiveGrid } from '@/components/ResponsiveLayout';
import { SeasonOverviewCard } from '@/components/points-deduction/SeasonOverviewCard';
import { DeductionsHistoryTable } from '@/components/points-deduction/DeductionsHistoryTable';
import { ImpactVisualization } from '@/components/points-deduction/ImpactVisualization';
import { PreventionChecklist } from '@/components/points-deduction/PreventionChecklist';

const PointsDeductionTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - this would come from the team_admin_status table
  const currentSeason = {
    pointsEarned: 45,
    pointsDeducted: 6,
    netPoints: 39,
    currentPosition: 8,
    positionWithoutPenalty: 6,
    season: '2024-25'
  };

  const handleExportCSV = () => {
    // Implementation for CSV export
    console.log('Exporting to CSV...');
  };

  return (
    <DashboardLayout 
      title="Pénalités Administratives et Déductions de Points" 
      description="Suivez et analysez l'impact des pénalités administratives sur les performances de l'équipe"
    >
      <div className="space-y-6 p-4 sm:p-6">
        
        {/* Alert Banner */}
        <Card className="bg-yellow-900/20 border-yellow-600/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <div>
                <p className="text-yellow-400 font-medium">Déduction de Points Active</p>
                <p className="text-yellow-300/80 text-sm">Saison actuelle : 6 points déduits. Statut recours : Sous examen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Season Overview */}
        <SeasonOverviewCard data={currentSeason} />

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Rechercher déductions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-club-dark-gray border-club-gold/20"
            />
          </div>
          <Button 
            onClick={handleExportCSV}
            className="bg-club-gold text-club-black hover:bg-club-gold/90"
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
        </div>

        {/* Deductions History */}
        <DeductionsHistoryTable searchTerm={searchTerm} />

        {/* Impact Visualization and Prevention Checklist */}
        <ResponsiveGrid className="grid-cols-1 lg:grid-cols-2">
          <ImpactVisualization />
          <PreventionChecklist />
        </ResponsiveGrid>

      </div>
    </DashboardLayout>
  );
};

export default PointsDeductionTracker;
