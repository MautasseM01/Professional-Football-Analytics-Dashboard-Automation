
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackToTopButton } from "@/components/BackToTopButton";
import { ResponsiveGrid } from "@/components/ResponsiveLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Users, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  MapPin,
  Clock,
  Award
} from "lucide-react";

const TeamOverview = () => {
  const isMobile = useIsMobile();
  
  // Mock team data - in real app this would come from API
  const teamStats = {
    overview: {
      wins: 15,
      draws: 3,
      losses: 2,
      goalsFor: 45,
      goalsAgainst: 18,
      points: 48,
      position: 2
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
      totalPlayers: 26,
      averageAge: 26.5,
      internationals: 12,
      homegrownPlayers: 8
    },
    topPerformers: [
      { name: "Marcus Johnson", position: "Forward", goals: 12, assists: 6 },
      { name: "David Wilson", position: "Midfielder", goals: 4, assists: 11 },
      { name: "Alex Thompson", position: "Defender", cleanSheets: 8, tackles: 45 },
      { name: "Mike Davis", position: "Goalkeeper", saves: 67, cleanSheets: 10 }
    ]
  };

  const getResultBadgeColor = (result: string) => {
    if (result.startsWith('W')) return 'bg-green-500';
    if (result.startsWith('D')) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-4 sm:py-6 space-y-4 sm:space-y-6 px-4 sm:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Team Overview</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Complete overview of team performance, statistics, and squad information
          </p>
        </div>

        {/* Season Statistics */}
        <ResponsiveGrid 
          className="grid-cols-2 md:grid-cols-4" 
          minCardWidth="150px"
        >
          <Card className="bg-club-dark-gray border-club-gold/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-club-gold flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-club-light-gray/70 truncate">League Position</p>
                  <p className="text-xl sm:text-2xl font-bold text-club-gold">#{teamStats.overview.position}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-club-dark-gray border-club-gold/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-club-gold flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-club-light-gray/70 truncate">Points</p>
                  <p className="text-xl sm:text-2xl font-bold text-club-gold">{teamStats.overview.points}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-club-dark-gray border-club-gold/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-club-light-gray/70 truncate">Goals For</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-500">{teamStats.overview.goalsFor}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-club-dark-gray border-club-gold/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-500 rotate-180 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-club-light-gray/70 truncate">Goals Against</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-500">{teamStats.overview.goalsAgainst}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ResponsiveGrid>

        {/* Main Content Tabs */}
        <Tabs defaultValue="results" className="space-y-4 sm:space-y-6">
          <TabsList className="bg-club-dark-gray border-club-gold/20 grid w-full grid-cols-3">
            <TabsTrigger 
              value="results" 
              className="data-[state=active]:bg-club-gold/20 text-xs sm:text-sm min-h-[44px] touch-manipulation"
            >
              Results & Fixtures
            </TabsTrigger>
            <TabsTrigger 
              value="squad" 
              className="data-[state=active]:bg-club-gold/20 text-xs sm:text-sm min-h-[44px] touch-manipulation"
            >
              Squad Overview
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="data-[state=active]:bg-club-gold/20 text-xs sm:text-sm min-h-[44px] touch-manipulation"
            >
              Top Performers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-4 sm:space-y-6">
            <ResponsiveGrid className="grid-cols-1 md:grid-cols-2">
              {/* Recent Results */}
              <Card className="bg-club-dark-gray border-club-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl text-club-gold flex items-center gap-2">
                    <Calendar className="h-5 w-5 flex-shrink-0" />
                    Recent Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {teamStats.recentResults.map((match, index) => (
                    <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-club-black/30 rounded-lg min-h-[44px] touch-manipulation">
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm sm:text-base font-medium text-club-light-gray truncate">{match.opponent}</span>
                        <span className="text-xs sm:text-sm text-club-light-gray/70 flex items-center gap-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          {match.location} • {new Date(match.date).toLocaleDateString()}
                        </span>
                      </div>
                      <Badge className={`${getResultBadgeColor(match.result)} text-white text-xs ml-2 flex-shrink-0`}>
                        {match.result}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Upcoming Fixtures */}
              <Card className="bg-club-dark-gray border-club-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl text-club-gold flex items-center gap-2">
                    <Clock className="h-5 w-5 flex-shrink-0" />
                    Upcoming Fixtures
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {teamStats.upcomingFixtures.map((match, index) => (
                    <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-club-black/30 rounded-lg min-h-[44px] touch-manipulation">
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm sm:text-base font-medium text-club-light-gray truncate">{match.opponent}</span>
                        <span className="text-xs sm:text-sm text-club-light-gray/70 flex items-center gap-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          {match.location}
                        </span>
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <div className="text-sm sm:text-base font-medium text-club-gold">{match.time}</div>
                        <div className="text-xs sm:text-sm text-club-light-gray/70">
                          {new Date(match.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </ResponsiveGrid>
          </TabsContent>

          <TabsContent value="squad" className="space-y-4 sm:space-y-6">
            <ResponsiveGrid className="grid-cols-1 md:grid-cols-2">
              <Card className="bg-club-dark-gray border-club-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl text-club-gold flex items-center gap-2">
                    <Users className="h-5 w-5 flex-shrink-0" />
                    Squad Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ResponsiveGrid className="grid-cols-2" minCardWidth="120px">
                    <div className="text-center p-3 sm:p-4 bg-club-black/30 rounded-lg min-h-[44px] touch-manipulation">
                      <div className="text-xl sm:text-2xl font-bold text-club-gold">{teamStats.squadStats.totalPlayers}</div>
                      <div className="text-xs sm:text-sm text-club-light-gray/70">Total Players</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-club-black/30 rounded-lg min-h-[44px] touch-manipulation">
                      <div className="text-xl sm:text-2xl font-bold text-club-gold">{teamStats.squadStats.averageAge}</div>
                      <div className="text-xs sm:text-sm text-club-light-gray/70">Average Age</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-club-black/30 rounded-lg min-h-[44px] touch-manipulation">
                      <div className="text-xl sm:text-2xl font-bold text-club-gold">{teamStats.squadStats.internationals}</div>
                      <div className="text-xs sm:text-sm text-club-light-gray/70">Internationals</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-club-black/30 rounded-lg min-h-[44px] touch-manipulation">
                      <div className="text-xl sm:text-2xl font-bold text-club-gold">{teamStats.squadStats.homegrownPlayers}</div>
                      <div className="text-xs sm:text-sm text-club-light-gray/70">Homegrown</div>
                    </div>
                  </ResponsiveGrid>
                </CardContent>
              </Card>

              <Card className="bg-club-dark-gray border-club-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl text-club-gold">Win Rate Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span>Wins</span>
                        <span>{teamStats.overview.wins}/20 games</span>
                      </div>
                      <Progress value={(teamStats.overview.wins / 20) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span>Goal Difference</span>
                        <span>+{teamStats.overview.goalsFor - teamStats.overview.goalsAgainst}</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ResponsiveGrid>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4 sm:space-y-6">
            <Card className="bg-club-dark-gray border-club-gold/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl text-club-gold flex items-center gap-2">
                  <Award className="h-5 w-5 flex-shrink-0" />
                  Top Performers This Season
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-club-light-gray/70">
                  Leading players across different categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveGrid className="grid-cols-1 md:grid-cols-2" minCardWidth="280px">
                  {teamStats.topPerformers.map((player, index) => (
                    <div key={index} className="p-4 bg-club-black/30 rounded-lg min-h-[44px] touch-manipulation">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm sm:text-base font-medium text-club-light-gray truncate">{player.name}</h3>
                        <Badge variant="outline" className="text-club-gold border-club-gold/30 text-xs ml-2 flex-shrink-0">
                          {player.position}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs sm:text-sm text-club-light-gray/70">
                        {player.goals !== undefined && (
                          <div className="flex justify-between">
                            <span>Goals:</span>
                            <span className="text-club-gold">{player.goals}</span>
                          </div>
                        )}
                        {player.assists !== undefined && (
                          <div className="flex justify-between">
                            <span>Assists:</span>
                            <span className="text-club-gold">{player.assists}</span>
                          </div>
                        )}
                        {player.cleanSheets !== undefined && (
                          <div className="flex justify-between">
                            <span>Clean Sheets:</span>
                            <span className="text-club-gold">{player.cleanSheets}</span>
                          </div>
                        )}
                        {player.tackles !== undefined && (
                          <div className="flex justify-between">
                            <span>Tackles:</span>
                            <span className="text-club-gold">{player.tackles}</span>
                          </div>
                        )}
                        {player.saves !== undefined && (
                          <div className="flex justify-between">
                            <span>Saves:</span>
                            <span className="text-club-gold">{player.saves}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </ResponsiveGrid>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BackToTopButton />
    </DashboardLayout>
  );
};

export default TeamOverview;
