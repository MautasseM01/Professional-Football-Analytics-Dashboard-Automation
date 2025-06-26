
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Calendar,
  FileText,
  Eye,
  Settings,
  Activity
} from 'lucide-react';
import { DevelopmentReportGenerator } from '@/components/development/DevelopmentReportGenerator';
import { BenchmarkDashboard } from '@/components/development/BenchmarkDashboard';
import { TalentIdentificationTools } from '@/components/development/TalentIdentificationTools';
import { WorkflowAutomation } from '@/components/development/WorkflowAutomation';
import { DevelopmentPathwayVisualizer } from '@/components/development/DevelopmentPathwayVisualizer';
import { DevelopmentMilestonesTimeline } from '@/components/development/DevelopmentMilestonesTimeline';
import { PlayerDevelopmentInsights } from '@/components/development/PlayerDevelopmentInsights';
import { useDevelopmentData } from '@/hooks/use-development-data';
import { usePlayerData } from '@/hooks/use-player-data';

export const DevelopmentTrajectories = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { 
    pathways, 
    milestones, 
    assessments, 
    communications, 
    educationalProgress, 
    recommendations,
    loading,
    error 
  } = useDevelopmentData();
  const { players } = usePlayerData();

  const handleGenerateReport = (reportType: string, teamLevel: string) => {
    console.log(`Generating ${reportType} report for ${teamLevel}`);
    // Implementation for report generation would go here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-club-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-club-dark-gray border-red-500/20">
        <CardContent className="p-6 text-center">
          <p className="text-red-400">Error loading development data: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-club-gold">Development Workflow Management</h2>
        <p className="text-club-light-gray/70">
          Comprehensive player development tracking, reporting, and workflow automation
        </p>
      </div>

      {/* Navigation Tabs */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-club-black/40">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black"
              >
                <Target className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black"
              >
                <FileText className="mr-2 h-4 w-4" />
                Reports
              </TabsTrigger>
              <TabsTrigger 
                value="benchmarks" 
                className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Benchmarks
              </TabsTrigger>
              <TabsTrigger 
                value="talent" 
                className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black"
              >
                <Eye className="mr-2 h-4 w-4" />
                Talent ID
              </TabsTrigger>
              <TabsTrigger 
                value="workflows" 
                className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black"
              >
                <Settings className="mr-2 h-4 w-4" />
                Workflows
              </TabsTrigger>
              <TabsTrigger 
                value="insights" 
                className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black"
              >
                <Activity className="mr-2 h-4 w-4" />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DevelopmentPathwayVisualizer players={players} pathways={pathways} />
                <DevelopmentMilestonesTimeline 
                  milestones={milestones} 
                  players={players}
                />
              </div>
            </TabsContent>

            <TabsContent value="reports" className="mt-6">
              <DevelopmentReportGenerator onGenerateReport={handleGenerateReport} />
            </TabsContent>

            <TabsContent value="benchmarks" className="mt-6">
              <BenchmarkDashboard />
            </TabsContent>

            <TabsContent value="talent" className="mt-6">
              <TalentIdentificationTools />
            </TabsContent>

            <TabsContent value="workflows" className="mt-6">
              <WorkflowAutomation />
            </TabsContent>

            <TabsContent value="insights" className="mt-6">
              <PlayerDevelopmentInsights 
                pathways={pathways}
                milestones={milestones}
                assessments={assessments}
                communications={communications}
                educationalProgress={educationalProgress}
                recommendations={recommendations}
                players={players}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
