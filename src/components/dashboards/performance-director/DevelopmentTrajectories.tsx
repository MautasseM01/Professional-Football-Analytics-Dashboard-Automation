import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TouchFeedbackButton } from '@/components/TouchFeedbackButton';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Calendar,
  FileText,
  Eye,
  Settings,
  Activity,
  Presentation,
  Monitor
} from 'lucide-react';
import { DevelopmentReportGenerator } from '@/components/development/DevelopmentReportGenerator';
import { BenchmarkDashboard } from '@/components/development/BenchmarkDashboard';
import { TalentIdentificationTools } from '@/components/development/TalentIdentificationTools';
import { WorkflowAutomation } from '@/components/development/WorkflowAutomation';
import { DevelopmentPathwayVisualizer } from '@/components/development/DevelopmentPathwayVisualizer';
import { DevelopmentMilestonesTimeline } from '@/components/development/DevelopmentMilestonesTimeline';
import { PlayerDevelopmentInsights } from '@/components/development/PlayerDevelopmentInsights';
import { ExecutiveSummaryMode } from './ExecutiveSummaryMode';
import { TabletPresentationMode } from './TabletPresentationMode';
import { EnhancedPlayerPerformanceMonitor } from './EnhancedPlayerPerformanceMonitor';
import { useDevelopmentData } from '@/hooks/use-development-data';
import { usePlayerData } from '@/hooks/use-player-data';

export const DevelopmentTrajectories = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [executiveMode, setExecutiveMode] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  
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
  };

  if (executiveMode) {
    return (
      <ExecutiveSummaryMode 
        onClose={() => setExecutiveMode(false)}
        onPresentationMode={() => {
          setExecutiveMode(false);
          setPresentationMode(true);
        }}
      />
    );
  }

  if (presentationMode) {
    return (
      <TabletPresentationMode 
        onExit={() => setPresentationMode(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border-destructive/20">
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Error loading development data: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">Development Workflow Management</h2>
            <p className="text-muted-foreground">
              Comprehensive player development tracking, reporting, and workflow automation
            </p>
          </div>
          
          {/* Executive Mode Controls */}
          <div className="flex gap-2">
            <TouchFeedbackButton
              variant="outline"
              onClick={() => setExecutiveMode(true)}
              className="border-border hover:bg-muted min-h-[var(--touch-target-min)]"
            >
              <Monitor className="mr-2 h-4 w-4" />
              Executive Mode
            </TouchFeedbackButton>
            <TouchFeedbackButton
              variant="outline"
              onClick={() => setPresentationMode(true)}
              className="border-border hover:bg-muted min-h-[var(--touch-target-min)]"
            >
              <Presentation className="mr-2 h-4 w-4" />
              Present
            </TouchFeedbackButton>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-muted/40">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-h-[var(--touch-target-min)]"
              >
                <Target className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-h-[var(--touch-target-min)]"
              >
                <FileText className="mr-2 h-4 w-4" />
                Reports
              </TabsTrigger>
              <TabsTrigger 
                value="benchmarks" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-h-[var(--touch-target-min)]"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Benchmarks
              </TabsTrigger>
              <TabsTrigger 
                value="talent" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-h-[var(--touch-target-min)]"
              >
                <Eye className="mr-2 h-4 w-4" />
                Talent ID
              </TabsTrigger>
              <TabsTrigger 
                value="workflows" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-h-[var(--touch-target-min)]"
              >
                <Settings className="mr-2 h-4 w-4" />
                Workflows
              </TabsTrigger>
              <TabsTrigger 
                value="insights" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-h-[var(--touch-target-min)]"
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
              <EnhancedPlayerPerformanceMonitor />
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
