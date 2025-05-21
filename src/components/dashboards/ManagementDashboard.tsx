
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";
import { Trophy, DollarSign, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ManagementDashboardProps {
  profile: UserProfile;
}

export const ManagementDashboard = ({ profile }: ManagementDashboardProps) => {
  const teamPerformance = {
    leaguePosition: 4,
    points: 67,
    form: ["W", "W", "L", "D", "W"],
    goalsScored: 58,
    goalsConceded: 31,
    seasonObjectives: [
      { objective: "Top 4 Finish", status: "on-track" },
      { objective: "Champions League Quarterfinals", status: "achieved" },
      { objective: "Domestic Cup Semifinal", status: "at-risk" }
    ]
  };

  const squadInvestment = {
    totalValueEur: 423,
    valueChange: 17,
    contractsExpiring: 3,
    keyStats: [
      { label: "Avg Age", value: "24.7" },
      { label: "Academy Products", value: "6" },
      { label: "New Signings", value: "3" }
    ]
  };

  const riskDashboard = [
    { area: "Goalkeeper Depth", level: "high", description: "Only one experienced GK" },
    { area: "CM Workload", level: "medium", description: "High minutes in midfield" },
    { area: "Striker Dependency", level: "medium", description: "Over-reliance on single forward" },
    { area: "RB Position", level: "low", description: "Multiple viable options" }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-club-gold">
        Welcome back, {profile.full_name || "Director"}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Performance Summary */}
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold">
              <Trophy className="mr-2 h-5 w-5" />
              Team Performance Summary
            </CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Current season status and objectives
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Key metrics */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-club-black/40 rounded py-3 px-2">
                <div className="text-xl font-bold text-club-gold">{teamPerformance.leaguePosition}th</div>
                <div className="text-xs text-club-light-gray/70">Position</div>
              </div>
              <div className="bg-club-black/40 rounded py-3 px-2">
                <div className="text-xl font-bold text-club-gold">{teamPerformance.points}</div>
                <div className="text-xs text-club-light-gray/70">Points</div>
              </div>
              <div className="bg-club-black/40 rounded py-3 px-2">
                <div className="text-club-gold flex justify-center gap-1">
                  {teamPerformance.form.map((result, i) => (
                    <span key={i} className={
                      `text-xs font-bold px-1 rounded 
                      ${result === 'W' ? 'bg-green-600/80' : 
                        result === 'D' ? 'bg-amber-600/80' : 
                        'bg-red-600/80'}`
                    }>
                      {result}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-club-light-gray/70 mt-1">Form</div>
              </div>
            </div>
            
            {/* Goals */}
            <div className="flex justify-between px-2 py-3 bg-club-black/40 rounded">
              <div className="text-center">
                <div className="text-lg font-bold text-club-gold">{teamPerformance.goalsScored}</div>
                <div className="text-xs text-club-light-gray/70">Goals Scored</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-club-gold">{teamPerformance.goalsConceded}</div>
                <div className="text-xs text-club-light-gray/70">Goals Conceded</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-club-gold">+{teamPerformance.goalsScored - teamPerformance.goalsConceded}</div>
                <div className="text-xs text-club-light-gray/70">Goal Difference</div>
              </div>
            </div>
            
            {/* Season objectives */}
            <div>
              <h4 className="text-sm font-medium text-club-light-gray mb-2">Season Objectives</h4>
              <ul className="space-y-2">
                {teamPerformance.seasonObjectives.map((objective, index) => (
                  <li key={index} className="flex justify-between items-center bg-club-black/40 p-2 rounded">
                    <span className="text-club-light-gray">{objective.objective}</span>
                    <Badge className={
                      objective.status === 'achieved' ? 'bg-green-600/80' :
                      objective.status === 'on-track' ? 'bg-amber-600/80' :
                      'bg-red-600/80'
                    }>
                      {objective.status === 'achieved' ? 'Achieved' :
                       objective.status === 'on-track' ? 'On Track' :
                       'At Risk'}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Squad Investment Overview */}
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold">
              <DollarSign className="mr-2 h-5 w-5" />
              Squad Investment Overview
            </CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Financial and contract status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Squad value */}
            <div className="bg-club-black/40 rounded p-3 flex justify-between items-center">
              <div>
                <div className="text-sm text-club-light-gray/70">Squad Value</div>
                <div className="font-bold text-xl text-club-gold">€{squadInvestment.totalValueEur}M</div>
              </div>
              <Badge className={
                squadInvestment.valueChange >= 0 ? 'bg-green-600/80' : 'bg-red-600/80'
              }>
                {squadInvestment.valueChange >= 0 ? '+' : ''}{squadInvestment.valueChange}% YoY
              </Badge>
            </div>
            
            {/* Key squad stats */}
            <div className="grid grid-cols-3 gap-2">
              {squadInvestment.keyStats.map((stat, index) => (
                <div key={index} className="bg-club-black/40 p-2 rounded text-center">
                  <div className="text-club-gold font-bold">{stat.value}</div>
                  <div className="text-xs text-club-light-gray/70">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Contract status */}
            <div className="bg-club-black/40 rounded p-3">
              <div className="flex justify-between mb-2">
                <h4 className="text-sm font-medium text-club-light-gray">Contract Status</h4>
                <Badge variant="outline" className="border-amber-500/50 text-amber-400">
                  {squadInvestment.contractsExpiring} Expiring
                </Badge>
              </div>
              <Button variant="outline" size="sm" className="border-club-gold/20 hover:bg-club-gold/10 w-full">
                View Contract Details
              </Button>
            </div>
            
            <div className="text-center">
              <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10">
                View Full Financial Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Risk Dashboard */}
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Risk Dashboard
            </CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Key risk indicators and potential issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {riskDashboard.map((risk, index) => (
                <li key={index} className="bg-club-black/40 p-3 rounded-md border-l-4"
                  style={{
                    borderLeftColor: risk.level === 'high' ? 'rgb(220, 38, 38)' : 
                                    risk.level === 'medium' ? 'rgb(217, 119, 6)' : 
                                    'rgb(22, 163, 74)'
                  }}>
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium text-club-light-gray">{risk.area}</h4>
                    <Badge className={
                      risk.level === 'high' ? 'bg-red-600/80' :
                      risk.level === 'medium' ? 'bg-amber-600/80' :
                      'bg-green-600/80'
                    }>
                      {risk.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-club-light-gray/70">{risk.description}</p>
                </li>
              ))}
            </ul>
            
            <div className="text-center mt-4">
              <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10">
                View Detailed Risk Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
