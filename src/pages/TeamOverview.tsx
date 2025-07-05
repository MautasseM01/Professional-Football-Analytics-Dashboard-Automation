import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackToTopButton } from "@/components/BackToTopButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";
import { useMatchRatings } from "@/hooks/use-match-ratings";
import { useTeamMetrics } from "@/hooks/use-team-metrics";
import TeamDisciplineTimeline from "@/components/TeamDisciplineTimeline";
import { 
  Users, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  MapPin,
  Clock,
  Award,
  Menu,
  RefreshCw,
  Star
} from "lucide-react";

const TeamOverview = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const { ratings, loading: ratingsLoading } = useMatchRatings(undefined, 10);
  const { data: teamMetrics, isLoading: metricsLoading } = useTeamMetrics();

  const handleRefresh = () => {
    console.log("Manual refresh triggered for team overview");
    // In a real app, this would refresh team data
  };

  // Enhanced team stats with real data integration
  const teamStats = {
    overview: {
      wins: 15,
      draws: 3,
      losses: 2,
      goalsFor: teamMetrics?.teamGoals || 45,
      goalsAgainst: 18,
      points: 48,
      position: 2,
      totalPlayers: teamMetrics?.totalPlayers || 26,
      availablePlayers: teamMetrics?.availablePlayers || 24,
      injuredPlayers: teamMetrics?.injuredPlayers || 2,
      winRate: teamMetrics?.winRate || 75
    },
    recentResults: [
      { date: "2024-01-20", opponent: "Arsenal FC", result: "W 3-1", location: "Home" },
      { date: "2024-01-15", opponent: "Liverpool FC", result: "D 2-2", location: "Away" },
      { date: "2024-01-10", opponent: "Chelsea FC", result: "W 1-0", location: "Home" },
      { date: "2024-01-05", opponent: "Man City", result: "L 1-2", location: "Away" },
      { date: "2024-01-01", opponent: "Tottenham", result: "W 4-0", location: "Home" }
    ],
    upcomingFixtures: [
      { date: "2024-01-25", opponent: "Newcastle", time: "15:00", location: "Away" },
      { date: "2024-01-30", opponent: "Brighton", time: "20:00", location: "Home" },
      { date: "2024-02-03", opponent: "Everton", time: "17:30", location: "Away" }
    ],
    squadStats: {
      totalPlayers: teamMetrics?.totalPlayers || 26,
      averageAge: 26.5,
      internationals: 12,
      homegrownPlayers: 8,
      availablePlayers: teamMetrics?.availablePlayers || 24,
      injuredPlayers: teamMetrics?.injuredPlayers || 2
    },
    topPerformers: [
      { name: "Marcus Johnson", position: "Forward", goals: 12, assists: 6 },
      { name: "David Wilson", position: "Midfielder", goals: 4, assists: 11 },
      { name: "Alex Thompson", position: "Defender", cleanSheets: 8, tackles: 45 },
      { name: "Mike Davis", position: "Goalkeeper", saves: 67, cleanSheets: 10 }
    ]
  };

  const getResultBadgeColor = (result: string) => {
    if (result.startsWith('W')) return 'bg-green-500/90 text-white border border-green-500/30';
    if (result.startsWith('D')) return 'bg-amber-500/90 text-white border border-amber-500/30';
    return 'bg-red-500/90 text-white border border-red-500/30';
  };

  // Calculate average ratings if available
  const avgPerformanceRating = ratings && ratings.length > 0 
    ? ratings.reduce((sum, r) => sum + r.overall_performance, 0) / ratings.length 
    : 0;

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      {showSidebar && <DashboardSidebar />}
      
      <div className="flex-1 overflow-auto min-w-0">
        <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-20 transition-colors duration-300">
          <div className="max-w-[calc(100%-2rem)] mx-auto">
            <div className="flex justify-between items-center px-4 sm:px-6 py-4 gap-2 sm:gap-4 min-h-[var(--touch-target-comfortable)]">
              {/* Left section - Title and page info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-primary truncate">
                  Team Overview
                </h1>
                <p className="text-sm text-muted-foreground truncate">
                  Complete overview of team performance, statistics, and squad information
                </p>
              </div>
              
              {/* Right section - Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Language Selector */}
                <LanguageSelector />
                
                {/* Theme Toggle */}
                <ThemeToggle />
                
                {/* Refresh Button */}
                <TouchFeedbackButton 
                  variant="outline" 
                  size="icon" 
                  className="bg-muted/50 border-border hover:bg-muted min-h-[var(--touch-target-comfortable)] min-w-[var(--touch-target-comfortable)]" 
                  onClick={handleRefresh} 
                  title="Refresh data" 
                  hapticType="medium"
                  disabled={metricsLoading || ratingsLoading}
                >
                  <RefreshCw size={18} className="text-primary" />
                </TouchFeedbackButton>
                
                {/* Menu Toggle */}
                <TouchFeedbackButton 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setShowSidebar(!showSidebar)} 
                  className="bg-muted/50 border-border hover:bg-muted min-h-[var(--touch-target-comfortable)] min-w-[var(--touch-target-comfortable)]" 
                  title="Toggle sidebar" 
                  hapticType="light"
                >
                  <Menu size={18} className="text-primary" />
                </TouchFeedbackButton>
              </div>
            </div>
          </div>
        </header>
        
        <main className="bg-background transition-colors duration-300 w-full">
          <div className="space-y-6 p-4 sm:p-6">
            {/* Season Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground truncate">League Position</p>
                      <p className="text-2xl font-bold text-primary">#{teamStats.overview.position}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground truncate">Points</p>
                      <p className="text-2xl font-bold text-primary">{teamStats.overview.points}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground truncate">Goals For</p>
                      <p className="text-2xl font-bold text-green-500">{teamStats.overview.goalsFor}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-red-500 rotate-180 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground truncate">Goals Against</p>
                      <p className="text-2xl font-bold text-red-500">{teamStats.overview.goalsAgainst}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Rating Card */}
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground truncate">Win Rate</p>
                      <p className="text-2xl font-bold text-amber-500">
                        {teamStats.overview.winRate}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Discipline Timeline - NEW COMPONENT */}
            <TeamDisciplineTimeline />

            {/* Main Content Tabs */}
            <Tabs defaultValue="results" className="space-y-6">
              <TabsList className="bg-muted border border-border">
                <TabsTrigger 
                  value="results" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-medium px-4 py-2.5 min-h-[var(--touch-target-comfortable)]"
                >
                  Results & Fixtures
                </TabsTrigger>
                <TabsTrigger 
                  value="squad" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-medium px-4 py-2.5 min-h-[var(--touch-target-comfortable)]"
                >
                  Squad Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="performance" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-medium px-4 py-2.5 min-h-[var(--touch-target-comfortable)]"
                >
                  Top Performers
                </TabsTrigger>
                <TabsTrigger 
                  value="ratings" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-medium px-4 py-2.5 min-h-[var(--touch-target-comfortable)]"
                >
                  Match Ratings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="grid md:grid-cols-2 gap-6">
                {/* Recent Results */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Recent Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {teamStats.recentResults.map((match, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg min-h-[var(--touch-target-comfortable)]">
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-base font-medium text-foreground truncate">{match.opponent}</span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{match.location} • {new Date(match.date).toLocaleDateString()}</span>
                          </span>
                        </div>
                        <Badge className={`${getResultBadgeColor(match.result)} text-xs flex-shrink-0`}>
                          {match.result}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Upcoming Fixtures */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Upcoming Fixtures
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {teamStats.upcomingFixtures.map((match, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg min-h-[var(--touch-target-comfortable)]">
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-base font-medium text-foreground truncate">{match.opponent}</span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{match.location}</span>
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-base font-medium text-primary">{match.time}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(match.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="squad" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Squad Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{teamStats.squadStats.totalPlayers}</div>
                          <div className="text-sm text-muted-foreground">Total Players</div>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{teamStats.squadStats.averageAge}</div>
                          <div className="text-sm text-muted-foreground">Average Age</div>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-green-500">{teamStats.squadStats.availablePlayers}</div>
                          <div className="text-sm text-muted-foreground">Available</div>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-red-500">{teamStats.squadStats.injuredPlayers}</div>
                          <div className="text-sm text-muted-foreground">Injured</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-foreground">Performance Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Win Rate</span>
                            <span className="font-medium">{teamStats.overview.winRate}%</span>
                          </div>
                          <Progress value={teamStats.overview.winRate} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Goal Difference</span>
                            <span className="font-medium text-green-500">+{teamStats.overview.goalsFor - teamStats.overview.goalsAgainst}</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Squad Availability</span>
                            <span className="font-medium">{Math.round((teamStats.squadStats.availablePlayers / teamStats.squadStats.totalPlayers) * 100)}%</span>
                          </div>
                          <Progress value={(teamStats.squadStats.availablePlayers / teamStats.squadStats.totalPlayers) * 100} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Top Performers This Season
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Leading players across different categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {teamStats.topPerformers.map((player, index) => (
                        <div key={index} className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-medium text-foreground truncate">{player.name}</h3>
                            <Badge variant="outline" className="text-primary border-primary/30 text-xs flex-shrink-0">
                              {player.position}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            {player.goals !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Goals:</span>
                                <span className="text-primary font-medium">{player.goals}</span>
                              </div>
                            )}
                            {player.assists !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Assists:</span>
                                <span className="text-primary font-medium">{player.assists}</span>
                              </div>
                            )}
                            {player.cleanSheets !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Clean Sheets:</span>
                                <span className="text-primary font-medium">{player.cleanSheets}</span>
                              </div>
                            )}
                            {player.tackles !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Tackles:</span>
                                <span className="text-primary font-medium">{player.tackles}</span>
                              </div>
                            )}
                            {player.saves !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Saves:</span>
                                <span className="text-primary font-medium">{player.saves}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Match Ratings Tab */}
              <TabsContent value="ratings" className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Recent Match Ratings
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Performance ratings from recent matches
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {ratingsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-pulse">
                          <p className="text-muted-foreground">Loading match ratings...</p>
                        </div>
                      </div>
                    ) : ratings && ratings.length > 0 ? (
                      <div className="space-y-3">
                        {ratings.slice(0, 5).map((rating) => (
                          <div key={rating.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg min-h-[var(--touch-target-comfortable)]">
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-foreground">{rating.opponent}</span>
                                <Badge variant="outline" className="text-xs">{rating.result}</Badge>
                                {rating.man_of_match_name && (
                                  <Badge variant="secondary" className="text-xs">
                                    MOTM: {rating.man_of_match_name}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(rating.match_date).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-lg font-bold text-amber-500">
                                {rating.overall_performance.toFixed(1)}
                              </div>
                              <div className="text-xs text-muted-foreground">Overall</div>
                            </div>
                          </div>
                        ))}
                        <div className="pt-4 text-center">
                          <TouchFeedbackButton 
                            variant="outline" 
                            onClick={() => window.location.href = '/match-ratings'}
                            className="text-primary border-primary/30 hover:bg-primary/10 min-h-[var(--touch-target-comfortable)]"
                          >
                            View Full Match Ratings Analysis
                          </TouchFeedbackButton>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-muted-foreground">No match ratings data available</p>
                        <p className="text-sm text-muted-foreground/70 mt-1">Match ratings will appear here once data is available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <BackToTopButton />
    </div>
  );
};

export default TeamOverview;
