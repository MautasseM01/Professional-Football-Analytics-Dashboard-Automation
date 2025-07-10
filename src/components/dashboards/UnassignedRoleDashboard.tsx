
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/types";
import { AlertCircle, Mail, User2, HelpCircle, Clock, Users, FileText, Shield } from "lucide-react";
import { ResponsiveGrid } from "../ResponsiveLayout";
import { useLanguage } from "@/contexts/LanguageContext";

interface UnassignedRoleDashboardProps {
  profile: UserProfile;
}

export const UnassignedRoleDashboard = ({ profile }: UnassignedRoleDashboardProps) => {
  const { t } = useLanguage();

  const roleTypes = [
    { 
      key: 'player',
      icon: User2,
      title: t('role.player'),
      description: t('unassigned.playerRole')
    },
    { 
      key: 'coach',
      icon: Users,
      title: t('role.coach'),
      description: t('unassigned.coachRole')
    },
    { 
      key: 'analyst',
      icon: FileText,
      title: t('role.analyst'),
      description: t('unassigned.analystRole')
    },
    { 
      key: 'director',
      icon: Shield,
      title: t('role.performanceDirector'),
      description: t('unassigned.directorRole')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <div className="container max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Section */}
        <Card className="bg-gradient-to-r from-primary/10 via-background to-primary/5 border-primary/20 shadow-lg">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="p-4 bg-primary/20 rounded-2xl flex-shrink-0">
                <User2 className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
              </div>
              <div className="text-center sm:text-left space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {t('unassigned.welcome')}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {t('unassigned.accountCreated')}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                  <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                    <Clock className="h-3 w-3 mr-1" />
                    {t('unassigned.statusPending')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <ResponsiveGrid minCardWidth="320px" className="grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Alert */}
          <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10 border-amber-200/50 dark:border-amber-800/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                    {t('unassigned.roleAssignmentPending')}
                  </h3>
                  <p className="text-amber-700/80 dark:text-amber-300/80 text-sm leading-relaxed">
                    {t('unassigned.accessLimited')}
                  </p>
                  <div className="pt-2">
                    <p className="text-xs text-amber-600/70 dark:text-amber-400/70 font-medium">
                      {t('unassigned.estimatedTime')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-br from-background to-secondary/20 border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-primary flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                {t('unassigned.nextStepsTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[t('unassigned.step1'), t('unassigned.step2'), t('unassigned.step3')].map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed pt-0.5">
                    {step}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </ResponsiveGrid>

        {/* Available Roles */}
        <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/10">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t('unassigned.roleTypes')}
            </CardTitle>
            <CardDescription>
              Voici un aperçu des différents types de rôles disponibles dans le système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roleTypes.map((role) => {
                const IconComponent = role.icon;
                return (
                  <div key={role.key} className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium text-foreground">{role.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <ResponsiveGrid minCardWidth="280px" className="grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            size="lg" 
            className="h-14 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200" 
            asChild
          >
            <a href="mailto:admin@strikerinsights.com" className="flex items-center gap-3">
              <Mail className="h-5 w-5" />
              <span className="font-medium">{t('unassigned.contactAdmin')}</span>
            </a>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="h-14 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-200"
          >
            <FileText className="mr-3 h-5 w-5" />
            <span className="font-medium">{t('unassigned.viewDocs')}</span>
          </Button>
        </ResponsiveGrid>

        {/* Footer Help */}
        <Card className="bg-muted/30 border-muted-foreground/10">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('unassigned.needHelp')}{' '}
              <a 
                href="mailto:admin@strikerinsights.com" 
                className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
              >
                admin@strikerinsights.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
