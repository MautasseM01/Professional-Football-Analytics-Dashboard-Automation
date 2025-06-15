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
  RefreshCw
} from "lucide-react";

const TeamOverview = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  const handleRefresh = () => {
    console.log("Manual refresh triggered for team overview");
    // In a real app, this would refresh team data
  };

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
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-club-black to-slate-900 dark:from-slate-900 dark:via-club-black dark:to-slate-900 text-gray-100 dark:text-gray-100 transition-colors duration-300">
      {showSidebar && <DashboardSidebar />}
      
      <div className="flex-1 overflow-auto min-w-0">
        <header className="border-b border-club-gold/20 dark:border-club-gold/20 bg-club-black/80 dark:bg-club-black/80 backdrop-blur-xl sticky top-0 z-20 transition-colors duration-300">
          <div className="max-w-[calc(100%-2rem)] mx-auto">
            <div className="flex justify-between items-center px-3 sm:px-4 lg:px-6 py-[23px] gap-2 sm:gap-4">
              {/* Left section - Title and page info */}
              <div className="flex-1 min-w-0">
                <h1 className="font-bold text-club-gold dark:text-club-gold truncate md:line-clamp-2 lg:line-clamp-none text-base md:text-lg lg:text-2xl">
                  Team Overview
                </h1>
                <p className="text-gray-400 dark:text-gray-400 truncate md:line-clamp-2 lg:line-clamp-none text-xs md:text-sm lg:text-base">
                  Complete overview of team performance, statistics, and squad information
                </p>
              </div>
              
              {/* Right section - Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
                {/* Language Selector */}
                <LanguageSelector />
                
                {/* Theme Toggle */}
                <ThemeToggle />
                
                {/* Refresh Button */}
                <TouchFeedbackButton 
                  variant="outline" 
                  size="icon" 
                  className="bg-club-black/50 dark:bg-club-black/50 border-club-gold/30 dark:border-club-gold/30 hover:bg-club-gold/10 dark:hover:bg-club-gold/10 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" 
                  onClick={handleRefresh} 
                  title="Refresh data" 
                  hapticType="medium"
                >
                  <RefreshCw size={14} className="sm:hidden text-club-gold" />
                  <RefreshCw size={16} className="hidden sm:block lg:hidden text-club-gold" />
                  <RefreshCw size={18} className="hidden lg:block text-club-gold" />
                </TouchFeedbackButton>
                
                {/* Menu Toggle */}
                <TouchFeedbackButton 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setShowSidebar(!showSidebar)} 
                  className="bg-club-black/50 dark:bg-club-black/50 border-club-gold/30 dark:border-club-gold/30 hover:bg-club-gold/10 dark:hover:bg-club-gold/10 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" 
                  title="Toggle sidebar" 
                  hapticType="light"
                >
                  <Menu size={16} className="sm:hidden text-club-gold" />
                  <Menu size={18} className="hidden sm:block lg:hidden text-club-gold" />
                  <Menu size={20} className="hidden lg:block text-club-gold" />
                </TouchFeedbackButton>
              </div>
            </div>
          </div>
        </header>
        
        <main className="bg-transparent transition-colors duration-300 w-full">
          <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Season Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-club-dark-gray border-club-gold/20">
                <CardContent className="p-responsive-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-club-gold" />
                    <div>
                      <p className="text-responsive-sm text-club-light-gray/70">League Position</p>
                      <p className="text-responsive-2xl font-bold text-club-gold">#{teamStats.overview.position}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-club-dark-gray border-club-gold/20">
                <CardContent className="p-responsive-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-club-gold" />
                    <div>
                      <p className="text-responsive-sm text-club-light-gray/70">Points</p>
                      <p className="text-responsive-2xl font-bold text-club-gold">{teamStats.overview.points}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-club-dark-gray border-club-gold/20">
                <CardContent className="p-responsive-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-responsive-sm text-club-light-gray/70">Goals For</p>
                      <p className="text-responsive-2xl font-bold text-green-500">{teamStats.overview.goalsFor}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-club-dark-gray border-club-gold/20">
                <CardContent className="p-responsive-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-red-500 rotate-180" />
                    <div>
                      <p className="text-responsive-sm text-club-light-gray/70">Goals Against</p>
                      <p className="text-responsive-2xl font-bold text-red-500">{teamStats.overview.goalsAgainst}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="results" className="space-y-6">
              <TabsList className="bg-club-dark-gray border-club-gold/20">
                <TabsTrigger value="results" className="data-[state=active]:bg-club-gold/20 text-responsive-sm">
                  Results & Fixtures
                </TabsTrigger>
                <TabsTrigger value="squad" className="data-[state=active]:bg-club-gold/20 text-responsive-sm">
                  Squad Overview
                </TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-club-gold/20 text-responsive-sm">
                  Top Performers
                </TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="grid md:grid-cols-2 gap-6">
                {/* Recent Results */}
                <Card className="bg-club-dark-gray border-club-gold/20">
                  <CardHeader>
                    <CardTitle className="heading-quaternary text-club-gold flex items-center gap-2 mb-0">
                      <Calendar className="h-5 w-5" />
                      Recent Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {teamStats.recentResults.map((match, index) => (
                      <div key={index} className="flex items-center justify-between p-responsive-3 bg-club-black/30 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-responsive-base font-medium text-club-light-gray">{match.opponent}</span>
                          <span className="text-responsive-sm text-club-light-gray/70 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {match.location} • {new Date(match.date).toLocaleDateString()}
                          </span>
                        </div>
                        <Badge className={`${getResultBadgeColor(match.result)} text-white text-responsive-xs`}>
                          {match.result}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Upcoming Fixtures */}
                <Card className="bg-club-dark-gray border-club-gold/20">
                  <CardHeader>
                    <CardTitle className="heading-quaternary text-club-gold flex items-center gap-2 mb-0">
                      <Clock className="h-5 w-5" />
                      Upcoming Fixtures
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {teamStats.upcomingFixtures.map((match, index) => (
                      <div key={index} className="flex items-center justify-between p-responsive-3 bg-club-black/30 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-responsive-base font-medium text-club-light-gray">{match.opponent}</span>
                          <span className="text-responsive-sm text-club-light-gray/70 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {match.location}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-responsive-base font-medium text-club-gold">{match.time}</div>
                          <div className="text-responsive-sm text-club-light-gray/70">
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
                  <Card className="bg-club-dark-gray border-club-gold/20">
                    <CardHeader>
                      <CardTitle className="heading-quaternary text-club-gold flex items-center gap-2 mb-0">
                        <Users className="h-5 w-5" />
                        Squad Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-responsive-3 bg-club-black/30 rounded-lg">
                          <div className="text-responsive-2xl font-bold text-club-gold">{teamStats.squadStats.totalPlayers}</div>
                          <div className="text-responsive-sm text-club-light-gray/70">Total Players</div>
                        </div>
                        <div className="text-center p-responsive-3 bg-club-black/30 rounded-lg">
                          <div className="text-responsive-2xl font-bold text-club-gold">{teamStats.squadStats.averageAge}</div>
                          <div className="text-responsive-sm text-club-light-gray/70">Average Age</div>
                        </div>
                        <div className="text-center p-responsive-3 bg-club-black/30 rounded-lg">
                          <div className="text-responsive-2xl font-bold text-club-gold">{teamStats.squadStats.internationals}</div>
                          <div className="text-responsive-sm text-club-light-gray/70">Internationals</div>
                        </div>
                        <div className="text-center p-responsive-3 bg-club-black/30 rounded-lg">
                          <div className="text-responsive-2xl font-bold text-club-gold">{teamStats.squadStats.homegrownPlayers}</div>
                          <div className="text-responsive-sm text-club-light-gray/70">Homegrown</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-club-dark-gray border-club-gold/20">
                    <CardHeader>
                      <CardTitle className="heading-quaternary text-club-gold mb-0">Win Rate Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-responsive-sm mb-1">
                            <span>Wins</span>
                            <span>{teamStats.overview.wins}/20 games</span>
                          </div>
                          <Progress value={(teamStats.overview.wins / 20) * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-responsive-sm mb-1">
                            <span>Goal Difference</span>
                            <span>+{teamStats.overview.goalsFor - teamStats.overview.goalsAgainst}</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <Card className="bg-club-dark-gray border-club-gold/20">
                  <CardHeader>
                    <CardTitle className="heading-quaternary text-club-gold flex items-center gap-2 mb-0">
                      <Award className="h-5 w-5" />
                      Top Performers This Season
                    </CardTitle>
                    <CardDescription className="text-responsive-sm text-club-light-gray/70">
                      Leading players across different categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {teamStats.topPerformers.map((player, index) => (
                        <div key={index} className="p-responsive-4 bg-club-black/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-responsive-base font-medium text-club-light-gray">{player.name}</h3>
                            <Badge variant="outline" className="text-club-gold border-club-gold/30 text-responsive-xs">
                              {player.position}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-responsive-sm text-club-light-gray/70">
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
                    </div>
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
