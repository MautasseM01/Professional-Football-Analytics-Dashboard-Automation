
import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { usePlayerData } from "@/hooks/use-player-data";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useLanguage } from "@/contexts/LanguageContext";
import { PlayerSelector } from "@/components/PlayerSelector";
import { RoleBasedContent } from "@/components/RoleBasedContent";
import { BackToTopButton } from "@/components/BackToTopButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";
import { Target, TrendingUp, Calendar, MessageSquare, Star, Award, RefreshCw, Menu } from "lucide-react";

const PlayerDevelopment = () => {
  const { players, selectedPlayer, selectPlayer, loading, refreshData } = usePlayerData();
  const { profile } = useUserProfile();
  const { t } = useLanguage();
  const [showSidebar, setShowSidebar] = useState(true);

  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    refreshData();
  };

  // Mock development data - in real app this would come from API
  const developmentData = {
    goals: [
      {
        id: 1,
        title: "Improve Shot Accuracy",
        target: 75,
        current: 68,
        deadline: "2024-03-15",
        status: "in_progress",
        category: "Technical"
      },
      {
        id: 2,
        title: "Increase Pass Completion Rate",
        target: 85,
        current: 82,
        deadline: "2024-02-28",
        status: "on_track",
        category: "Technical"
      },
      {
        id: 3,
        title: "Build Physical Strength",
        target: 100,
        current: 75,
        deadline: "2024-04-01",
        status: "in_progress",
        category: "Physical"
      }
    ],
    trainingRecommendations: [
      {
        type: "Technical",
        exercises: ["1v1 finishing drills", "Target practice", "Weak foot training"],
        frequency: "3x per week"
      },
      {
        type: "Physical", 
        exercises: ["Strength training", "Sprint intervals", "Agility ladders"],
        frequency: "2x per week"
      },
      {
        type: "Tactical",
        exercises: ["Position play", "Movement patterns", "Decision making"],
        frequency: "Daily"
      }
    ],
    coachFeedback: [
      {
        date: "2024-01-15",
        coach: "John Smith",
        feedback: "Great improvement in positioning. Continue working on first touch under pressure.",
        rating: 4
      },
      {
        date: "2024-01-08",
        coach: "John Smith", 
        feedback: "Excellent work rate in training. Focus on communication with teammates during matches.",
        rating: 5
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "on_track": return "bg-blue-500";
      case "behind": return "bg-red-500";
      default: return "bg-yellow-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "on_track": return "On Track";
      case "behind": return "Behind Schedule";
      default: return "In Progress";
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-club-black to-slate-900 dark:from-slate-900 dark:via-club-black dark:to-slate-900 text-gray-100 dark:text-gray-100 transition-colors duration-300">
      {showSidebar && <DashboardSidebar />}
      
      <div className="flex-1 overflow-auto min-w-0">
        <header className="border-b border-club-gold/20 dark:border-club-gold/20 bg-club-black/80 dark:bg-club-black/80 backdrop-blur-xl sticky top-0 z-20 transition-colors duration-300">
          <div className="max-w-[calc(100%-2rem)] mx-auto">
            <div className="flex justify-between items-center px-3 sm:px-4 lg:px-6 py-3 gap-2 sm:gap-4 sm:py-[20px]">
              {/* Left section - Title and page info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-ios-headline font-bold text-club-gold dark:text-club-gold truncate">
                  Player Development
                </h1>
                <p className="text-ios-caption text-gray-400 dark:text-gray-400 truncate">
                  {profile?.role === 'player' 
                    ? "Track your development goals and progress"
                    : "Monitor player development and provide guidance"
                  }
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
            {/* Role-based access information */}
            <RoleBasedContent allowedRoles={['player']}>
              <Alert className="bg-club-gold/10 border-club-gold/30">
                <Target className="h-4 w-4" />
                <AlertDescription className="text-club-light-gray">
                  You can view your personal development goals and track your progress.
                </AlertDescription>
              </Alert>
            </RoleBasedContent>

            {/* Player Selector - Hidden for player role */}
            <RoleBasedContent 
              allowedRoles={['admin', 'management', 'coach', 'analyst', 'performance_director']}
              fallback={null}
            >
              <PlayerSelector
                players={players}
                selectedPlayer={selectedPlayer}
                onPlayerSelect={selectPlayer}
                loading={loading}
              />
            </RoleBasedContent>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin w-8 h-8 border-4 border-club-gold border-t-transparent rounded-full"></div>
              </div>
            )}

            {/* Main Content */}
            {selectedPlayer && !loading ? (
              <Tabs defaultValue="goals" className="space-y-6">
                <TabsList className="bg-club-dark-gray border-club-gold/20">
                  <TabsTrigger value="goals" className="data-[state=active]:bg-club-gold/20">
                    Development Goals
                  </TabsTrigger>
                  <TabsTrigger value="training" className="data-[state=active]:bg-club-gold/20">
                    Training Plan
                  </TabsTrigger>
                  <TabsTrigger value="feedback" className="data-[state=active]:bg-club-gold/20">
                    Coach Feedback
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="goals" className="space-y-6">
                  <div className="grid gap-6">
                    {developmentData.goals.map((goal) => (
                      <Card key={goal.id} className="bg-club-dark-gray border-club-gold/20">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-club-gold flex items-center gap-2">
                              <Target className="h-5 w-5" />
                              {goal.title}
                            </CardTitle>
                            <Badge className={`${getStatusColor(goal.status)} text-white`}>
                              {getStatusText(goal.status)}
                            </Badge>
                          </div>
                          <CardDescription className="text-club-light-gray/70">
                            Category: {goal.category} • Deadline: {new Date(goal.deadline).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{goal.current}% / {goal.target}%</span>
                            </div>
                            <Progress 
                              value={(goal.current / goal.target) * 100} 
                              className="h-2"
                            />
                            <div className="text-sm text-club-light-gray/60">
                              {Math.round((goal.current / goal.target) * 100)}% complete
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="training" className="space-y-6">
                  <div className="grid gap-6">
                    {developmentData.trainingRecommendations.map((rec, index) => (
                      <Card key={index} className="bg-club-dark-gray border-club-gold/20">
                        <CardHeader>
                          <CardTitle className="text-club-gold flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            {rec.type} Training
                          </CardTitle>
                          <CardDescription className="text-club-light-gray/70">
                            Frequency: {rec.frequency}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {rec.exercises.map((exercise, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-club-light-gray">
                                <div className="w-2 h-2 bg-club-gold rounded-full"></div>
                                {exercise}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="feedback" className="space-y-6">
                  <div className="grid gap-6">
                    {developmentData.coachFeedback.map((feedback, index) => (
                      <Card key={index} className="bg-club-dark-gray border-club-gold/20">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-club-gold flex items-center gap-2">
                              <MessageSquare className="h-5 w-5" />
                              Feedback from {feedback.coach}
                            </CardTitle>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < feedback.rating ? 'text-club-gold fill-current' : 'text-club-light-gray/30'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <CardDescription className="text-club-light-gray/70">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            {new Date(feedback.date).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-club-light-gray">{feedback.feedback}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            ) : !loading && (
              <div className="flex items-center justify-center min-h-[50vh] text-center px-4">
                <div className="space-y-2">
                  <Award className="h-12 w-12 text-club-gold/50 mx-auto" />
                  <p className="text-base sm:text-lg text-club-light-gray">
                    {profile?.role === 'player' 
                      ? "Loading your development plan..."
                      : "No player selected"
                    }
                  </p>
                  <p className="text-xs sm:text-sm text-club-light-gray/60">
                    {profile?.role === 'player' 
                      ? "Please wait while we load your goals"
                      : "Please select a player to view their development plan"
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <BackToTopButton />
    </div>
  );
};

export default PlayerDevelopment;
