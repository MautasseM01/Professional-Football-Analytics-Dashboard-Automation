
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";
import { Award, Bell, Users, FileBarChart, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CoachDashboardProps {
  profile: UserProfile;
}

export const CoachDashboard = ({ profile }: CoachDashboardProps) => {
  const teamMetrics = {
    recentMatches: [
      { opponent: "FC Barcelona", result: "W", score: "2-1" },
      { opponent: "Real Madrid", result: "D", score: "0-0" },
      { opponent: "Atletico Madrid", result: "L", score: "1-2" }
    ],
    nextMatch: { opponent: "Valencia", date: "May 25, 2025", location: "Home" },
    stats: {
      goalsScored: 12,
      goalsConceded: 8,
      possession: 53,
      shots: 45
    }
  };

  const playerAlerts = [
    { player: "Marcus Johnson", issue: "High training load", severity: "warning" },
    { player: "Tom Williams", issue: "Decreased sprint distance", severity: "danger" },
    { player: "Alex Garcia", issue: "Improved passing accuracy", severity: "success" }
  ];

  const opponentSnapshot = {
    name: "Valencia",
    formation: "4-3-3",
    keyPlayers: ["Carlos Soler", "José Gayà", "Gonçalo Guedes"],
    weaknesses: ["Set piece defense", "Counter-attacks against"]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-club-gold">
        Welcome back, Coach {profile.full_name?.split(' ')[0] || ''}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Dashboard */}
        <Card className="bg-club-dark-gray border-club-gold/20 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold">
              <Award className="mr-2 h-5 w-5" />
              Team Dashboard
            </CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Recent performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-club-light-gray mb-2">Recent Results</h4>
              <div className="space-y-2">
                {teamMetrics.recentMatches.map((match, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-club-black/40 rounded">
                    <span>{match.opponent}</span>
                    <div className="flex items-center gap-2">
                      <Badge className={`${
                        match.result === 'W' ? 'bg-green-600/80' : 
                        match.result === 'D' ? 'bg-yellow-600/80' : 'bg-red-600/80'
                      }`}>
                        {match.result}
                      </Badge>
                      <span>{match.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-club-light-gray mb-2">Next Match</h4>
              <div className="p-3 bg-club-black/40 rounded">
                <p className="font-medium">{teamMetrics.nextMatch.opponent}</p>
                <div className="flex justify-between text-sm text-club-light-gray/70">
                  <span>{teamMetrics.nextMatch.date}</span>
                  <span>{teamMetrics.nextMatch.location}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-club-light-gray mb-2">Team Stats</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-club-black/40 rounded text-center">
                  <div className="text-lg font-bold text-club-gold">{teamMetrics.stats.goalsScored}</div>
                  <div className="text-xs text-club-light-gray/70">Goals Scored</div>
                </div>
                <div className="p-2 bg-club-black/40 rounded text-center">
                  <div className="text-lg font-bold text-club-gold">{teamMetrics.stats.goalsConceded}</div>
                  <div className="text-xs text-club-light-gray/70">Goals Conceded</div>
                </div>
                <div className="p-2 bg-club-black/40 rounded text-center">
                  <div className="text-lg font-bold text-club-gold">{teamMetrics.stats.possession}%</div>
                  <div className="text-xs text-club-light-gray/70">Possession</div>
                </div>
                <div className="p-2 bg-club-black/40 rounded text-center">
                  <div className="text-lg font-bold text-club-gold">{teamMetrics.stats.shots}</div>
                  <div className="text-xs text-club-light-gray/70">Shots</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Player Alerts */}
        <Card className="bg-club-dark-gray border-club-gold/20 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold">
              <Bell className="mr-2 h-5 w-5" />
              Player Alerts
            </CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Performance changes and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {playerAlerts.map((alert, index) => (
                <li key={index} className="p-3 bg-club-black/40 rounded-md border-l-4 border-l-2 flex justify-between items-center gap-2"
                  style={{
                    borderLeftColor: 
                      alert.severity === 'danger' ? 'rgb(220, 38, 38)' : 
                      alert.severity === 'warning' ? 'rgb(217, 119, 6)' : 
                      'rgb(22, 163, 74)'
                  }}
                >
                  <div>
                    <p className="font-medium text-club-light-gray">{alert.player}</p>
                    <p className="text-sm text-club-light-gray/70">{alert.issue}</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs border-club-gold/20 hover:bg-club-gold/10">
                    View
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Opponent Snapshot & Quick Links */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-club-dark-gray border-club-gold/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-club-gold">
                <Shield className="mr-2 h-5 w-5" />
                Opponent Snapshot
              </CardTitle>
              <CardDescription className="text-club-light-gray/70">
                {opponentSnapshot.name} - Next match
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-club-light-gray">Formation</h4>
                <p className="text-club-light-gray/90 bg-club-black/40 p-2 rounded mt-1">{opponentSnapshot.formation}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-club-light-gray">Key Players</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {opponentSnapshot.keyPlayers.map((player, index) => (
                    <Badge key={index} variant="outline" className="border-club-gold/30 text-club-light-gray">
                      {player}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-club-light-gray">Weaknesses</h4>
                <ul className="list-disc list-inside text-sm text-club-light-gray/90 bg-club-black/40 p-2 rounded mt-1">
                  {opponentSnapshot.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-club-dark-gray border-club-gold/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-club-gold">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10 justify-start">
                <Users className="mr-2 h-4 w-4" />
                Squad Management
              </Button>
              <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10 justify-start">
                <FileBarChart className="mr-2 h-4 w-4" />
                Tactical Planning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
