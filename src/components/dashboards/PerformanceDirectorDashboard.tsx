import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";
import { HeartPulse, TrendingUp, BarChart3, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PerformanceTrendsCard } from "../PerformanceTrendsCard";

interface PerformanceDirectorDashboardProps {
  profile: UserProfile;
}

export const PerformanceDirectorDashboard = ({ profile }: PerformanceDirectorDashboardProps) => {
  // Sample player data for performance trends
  const samplePlayer = {
    id: 1,
    name: "Key Player Analysis",
    position: "Midfielder",
    matches: 15,
    distance: 11.2,
    passes_attempted: 89,
    passes_completed: 76,
    shots_total: 3,
    shots_on_target: 2,
    tackles_attempted: 5,
    tackles_won: 3,
    sprintDistance: 2.8,
    maxSpeed: 32.1,
    passCompletionPct: 85,
    number: 10,
    heatmapUrl: "/placeholder-heatmap.jpg",
    reportUrl: "/placeholder-report.pdf"
  };

  const squadAvailability = [
    { status: "Available", count: 18, color: "bg-green-600/80" },
    { status: "Light Training", count: 3, color: "bg-amber-600/80" },
    { status: "Injured", count: 4, color: "bg-red-600/80" },
    { status: "Return <7 Days", count: 2, color: "bg-blue-600/80" }
  ];

  const injuredPlayers = [
    { name: "Alex Garcia", injury: "Hamstring", returnDate: "June 10" },
    { name: "Carlos Perez", injury: "ACL", returnDate: "August 15" },
    { name: "James Wilson", injury: "Ankle", returnDate: "May 28" },
    { name: "Robert Johnson", injury: "Concussion", returnDate: "June 2" }
  ];

  const developmentTrackers = [
    { group: "First Team", targetMet: 78, onTrack: 15, concern: 7 },
    { group: "U23s", targetMet: 65, onTrack: 20, concern: 15 },
    { group: "Academy", targetMet: 72, onTrack: 18, concern: 10 }
  ];

  const benchmarkComparisons = [
    { metric: "Distance Covered", teamValue: 112, leagueAvg: 108, target: 110, unit: "km" },
    { metric: "Sprint Distance", teamValue: 19.3, leagueAvg: 20.1, target: 21, unit: "km" },
    { metric: "Pass Completion", teamValue: 81, leagueAvg: 78, target: 80, unit: "%" },
    { metric: "Chances Created", teamValue: 9, leagueAvg: 11, target: 12, unit: "" }
  ];

  const talentWatchlist = [
    { name: "Marco Silva", club: "Sporting CP", position: "CM", rating: 8.5 },
    { name: "Luka Horvat", club: "Dinamo Zagreb", position: "RW", rating: 8.2 },
    { name: "Thomas Berg", club: "Ajax", position: "CB", rating: 7.9 }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-club-gold">
        Welcome back, {profile.full_name || "Performance Director"}
      </h1>
      
      {/* Enhanced Performance Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <PerformanceTrendsCard player={samplePlayer} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Squad Availability */}
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold">
              <HeartPulse className="mr-2 h-5 w-5" />
              Squad Availability
            </CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Player fitness and injury status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {squadAvailability.map((item, index) => (
                <div key={index} className="bg-club-black/40 rounded p-2 text-center">
                  <div className="text-lg font-bold text-club-gold">{item.count}</div>
                  <div className="text-xs text-club-light-gray/70">{item.status}</div>
                  <div className={`h-1 mt-1 rounded ${item.color}`}></div>
                </div>
              ))}
            </div>
            
            {/* Injured players */}
            <div>
              <h4 className="text-sm font-medium text-club-light-gray mb-2">Injury List</h4>
              <div className="space-y-2">
                {injuredPlayers.map((player, index) => (
                  <div key={index} className="bg-club-black/40 p-2 rounded flex justify-between">
                    <div>
                      <p className="text-club-light-gray font-medium">{player.name}</p>
                      <p className="text-xs text-club-light-gray/70">{player.injury}</p>
                    </div>
                    <Badge variant="outline" className="border-club-gold/30 text-club-light-gray self-center">
                      Return: {player.returnDate}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Player Development Tracker */}
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold">
              <TrendingUp className="mr-2 h-5 w-5" />
              Player Development Tracker
            </CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Progress against development goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {developmentTrackers.map((tracker, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-club-light-gray">{tracker.group}</h4>
                    <Badge variant="outline" className="border-club-gold/30 text-club-gold bg-club-gold/10">
                      {tracker.targetMet}% On Target
                    </Badge>
                  </div>
                  
                  <div className="flex gap-1 h-2">
                    <div className="bg-green-600 rounded-l h-full" style={{width: `${tracker.targetMet}%`}}></div>
                    <div className="bg-amber-500 h-full" style={{width: `${tracker.onTrack}%`}}></div>
                    <div className="bg-red-500 rounded-r h-full" style={{width: `${tracker.concern}%`}}></div>
                  </div>
                  
                  <div className="flex text-xs text-club-light-gray/70 justify-between">
                    <span>Target Met: {tracker.targetMet}%</span>
                    <span>On Track: {tracker.onTrack}%</span>
                    <span>Concern: {tracker.concern}%</span>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4 border-club-gold/20 hover:bg-club-gold/10">
              View Full Development Report
            </Button>
          </CardContent>
        </Card>

        {/* Performance Benchmarks & Talent ID */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-club-dark-gray border-club-gold/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-club-gold">
                <BarChart3 className="mr-2 h-5 w-5" />
                Performance Benchmarks
              </CardTitle>
              <CardDescription className="text-club-light-gray/70">
                Comparison vs. league averages and targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {benchmarkComparisons.map((benchmark, index) => (
                  <li key={index} className="bg-club-black/40 p-2 rounded">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-club-light-gray">{benchmark.metric}</span>
                      <span className="text-club-gold font-medium">
                        {benchmark.teamValue}{benchmark.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-club-light-gray/70">League: {benchmark.leagueAvg}{benchmark.unit}</span>
                      <span className="text-club-light-gray/70">|</span>
                      <span className="text-club-light-gray/70">Target: {benchmark.target}{benchmark.unit}</span>
                      {benchmark.teamValue >= benchmark.target ? (
                        <Badge className="bg-green-600/80 ml-auto">Target Met</Badge>
                      ) : (benchmark.teamValue >= benchmark.leagueAvg) ? (
                        <Badge className="bg-amber-600/80 ml-auto">Above Average</Badge>
                      ) : (
                        <Badge className="bg-red-600/80 ml-auto">Below Average</Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-club-dark-gray border-club-gold/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-club-gold">
                <Star className="mr-2 h-5 w-5" />
                Talent ID Watchlist
              </CardTitle>
              <CardDescription className="text-club-light-gray/70">
                Potential scouting targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {talentWatchlist.map((talent, index) => (
                  <li key={index} className="flex justify-between p-2 bg-club-black/40 rounded">
                    <div>
                      <p className="font-medium text-club-light-gray">{talent.name}</p>
                      <div className="flex gap-2 text-xs text-club-light-gray/70">
                        <span>{talent.position}</span>
                        <span>•</span>
                        <span>{talent.club}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-club-gold/30 bg-club-gold/10 text-club-gold self-center">
                      {talent.rating}
                    </Badge>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full mt-3 border-club-gold/20 hover:bg-club-gold/10">
                View Full Scouting Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
