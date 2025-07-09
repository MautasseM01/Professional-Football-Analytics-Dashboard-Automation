
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";
import { Trophy, DollarSign, AlertTriangle, Users, Target, BarChart3, TrendingUp, Shield, FileText, Award, PieChart, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";

interface ManagementDashboardProps {
  profile: UserProfile;
}

export const ManagementDashboard = ({ profile }: ManagementDashboardProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Executive Header with Strategic Overview */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-primary">
          {t('management.dashboard')}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('management.oversight')}
        </p>
      </div>

      {/* Strategic KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* League Performance */}
        <Card className="bg-card border border-border hover:bg-card/80 transition-all duration-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Trophy className="h-5 w-5 text-primary" />
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <CardTitle className="text-primary text-base">
              {t('management.performance')}
            </CardTitle>
            <CardDescription className="text-xs">
              {t('management.standings')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">6th</div>
              <div className="text-xs text-muted-foreground">{t('management.leaguePosition')}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-secondary/50 rounded-lg py-2 px-1 transition-colors group-hover:bg-secondary/70">
                <div className="text-lg font-bold text-primary">28</div>
                <div className="text-xs text-muted-foreground">{t('management.points')}</div>
              </div>
              <div className="bg-secondary/50 rounded-lg py-2 px-1 transition-colors group-hover:bg-secondary/70">
                <div className="text-lg font-bold text-green-500">+6</div>
                <div className="text-xs text-muted-foreground">{t('management.goalDiff')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card className="bg-card border border-border hover:bg-card/80 transition-all duration-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <DollarSign className="h-5 w-5 text-primary" />
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <CardTitle className="text-primary text-base">
              {t('management.squadValue')}
            </CardTitle>
            <CardDescription className="text-xs">
              {t('management.totalInvestment')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">€150K</div>
              <div className="text-xs text-muted-foreground">{t('squad.value')}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-secondary/50 rounded-lg py-2 px-1 transition-colors group-hover:bg-secondary/70">
                <div className="text-lg font-bold text-green-500">+8%</div>
                <div className="text-xs text-muted-foreground">{t('management.yoyGrowth')}</div>
              </div>
              <div className="bg-secondary/50 rounded-lg py-2 px-1 transition-colors group-hover:bg-secondary/70">
                <div className="text-lg font-bold text-yellow-500">5</div>
                <div className="text-xs text-muted-foreground">{t('management.expiring')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Management */}
        <Card className="bg-card border border-border hover:bg-card/80 transition-all duration-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Shield className="h-5 w-5 text-primary" />
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </div>
            <CardTitle className="text-primary text-base">
              {t('management.riskOverview')}
            </CardTitle>
            <CardDescription className="text-xs">
              {t('management.adminStatus')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">3</div>
              <div className="text-xs text-muted-foreground">{t('management.activeRisks')}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-secondary/50 rounded-lg py-2 px-1 transition-colors group-hover:bg-secondary/70">
                <div className="text-lg font-bold text-destructive">1</div>
                <div className="text-xs text-muted-foreground">{t('management.highRisk')}</div>
              </div>
              <div className="bg-secondary/50 rounded-lg py-2 px-1 transition-colors group-hover:bg-secondary/70">
                <div className="text-lg font-bold text-yellow-500">2</div>
                <div className="text-xs text-muted-foreground">{t('management.mediumRisk')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategic Health */}
        <Card className="bg-card border border-border hover:bg-card/80 transition-all duration-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Award className="h-5 w-5 text-primary" />
              <Monitor className="h-4 w-4 text-blue-500" />
            </div>
            <CardTitle className="text-primary text-base">
              Strategic Health
            </CardTitle>
            <CardDescription className="text-xs">
              Overall club performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Performance Index</span>
                <span className="font-medium text-primary">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-secondary/50 rounded-lg py-2 px-1 transition-colors group-hover:bg-secondary/70">
                <div className="text-lg font-bold text-green-500">85%</div>
                <div className="text-xs text-muted-foreground">Objectives</div>
              </div>
              <div className="bg-secondary/50 rounded-lg py-2 px-1 transition-colors group-hover:bg-secondary/70">
                <div className="text-lg font-bold text-blue-500">92%</div>
                <div className="text-xs text-muted-foreground">Compliance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Management Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Season Objectives & Progress */}
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Target className="mr-2 h-5 w-5" />
              {t('management.seasonObjectives')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-secondary/30 p-4 rounded-lg border-l-4 border-l-green-500">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-foreground">{t('management.midTable')}</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-500 border-green-500/30">
                    {t('management.onTrack')}
                  </Badge>
                </div>
                <Progress value={65} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">65% complete - 6th position target</p>
              </div>
              
              <div className="bg-secondary/30 p-4 rounded-lg border-l-4 border-l-green-500">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-foreground">{t('management.cupQuarter')}</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-500 border-green-500/30">
                    {t('management.achieved')}
                  </Badge>
                </div>
                <Progress value={100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Objective achieved - Quarter final reached</p>
              </div>
              
              <div className="bg-secondary/30 p-4 rounded-lg border-l-4 border-l-yellow-500">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-foreground">{t('management.youthProgram')}</span>
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                    {t('management.onTrack')}
                  </Badge>
                </div>
                <Progress value={72} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">72% complete - Development milestones on track</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Executive Actions & Tools */}
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <BarChart3 className="mr-2 h-5 w-5" />
              {t('management.actions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <TouchFeedbackButton 
                variant="outline" 
                className="h-12 bg-secondary/50 border-border hover:bg-secondary/70 justify-start"
                hapticType="light"
              >
                <FileText className="mr-3 h-4 w-4 text-primary" />
                <div className="text-left">
                  <div className="font-medium">{t('management.financialReport')}</div>
                  <div className="text-xs text-muted-foreground">View Q2 financial analysis</div>
                </div>
              </TouchFeedbackButton>
              
              <TouchFeedbackButton 
                variant="outline" 
                className="h-12 bg-secondary/50 border-border hover:bg-secondary/70 justify-start"
                hapticType="light"
              >
                <Users className="mr-3 h-4 w-4 text-primary" />
                <div className="text-left">
                  <div className="font-medium">{t('management.contractManagement')}</div>
                  <div className="text-xs text-muted-foreground">5 contracts expiring soon</div>
                </div>
              </TouchFeedbackButton>
              
              <TouchFeedbackButton 
                variant="outline" 
                className="h-12 bg-secondary/50 border-border hover:bg-secondary/70 justify-start"
                hapticType="light"
              >
                <PieChart className="mr-3 h-4 w-4 text-primary" />
                <div className="text-left">
                  <div className="font-medium">{t('management.adminDashboard')}</div>
                  <div className="text-xs text-muted-foreground">System administration tools</div>
                </div>
              </TouchFeedbackButton>
              
              <TouchFeedbackButton 
                variant="outline" 
                className="h-12 bg-secondary/50 border-border hover:bg-secondary/70 justify-start"
                hapticType="light"
              >
                <TrendingUp className="mr-3 h-4 w-4 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Strategic Analytics</div>
                  <div className="text-xs text-muted-foreground">Performance insights & trends</div>
                </div>
              </TouchFeedbackButton>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-primary">Squad Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available</span>
                <span className="font-medium text-green-500">22/25</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Injured</span>
                <span className="font-medium text-destructive">2</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Suspended</span>
                <span className="font-medium text-yellow-500">1</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-primary">Financial Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Budget Used</span>
                <span className="font-medium text-yellow-500">68%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-medium text-green-500">+12%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expenses</span>
                <span className="font-medium text-primary">€45K</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-primary">Development Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Academy</span>
                <span className="font-medium text-green-500">85%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Youth Teams</span>
                <span className="font-medium text-blue-500">92%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progression</span>
                <span className="font-medium text-primary">3 promoted</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
