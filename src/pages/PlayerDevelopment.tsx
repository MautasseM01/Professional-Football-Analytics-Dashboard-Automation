
import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { usePlayerData } from "@/hooks/use-player-data";
import { useUserProfile } from "@/hooks/use-user-profile";
import { PlayerSelector } from "@/components/PlayerSelector";
import { RoleBasedContent } from "@/components/RoleBasedContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Target, TrendingUp, Calendar, MessageSquare, Star, Award, RefreshCw, Menu } from "lucide-react";

const PlayerDevelopment = () => {
  const { players, selectedPlayer, selectPlayer, loading } = usePlayerData();
  const { profile } = useUserProfile();

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
    <div className="min-h-screen bg-gradient-to-br from-club-dark-bg via-club-black to-club-dark-gray text-club-light-gray flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Demo Banner */}
        <div className="bg-club-gold text-club-black px-4 py-2 text-center text-sm font-medium">
          🚀 Demo Mode: Exploring player development analytics
        </div>

        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-club-black/80 border-b border-club-gold/20">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-lg sm:text-xl font-bold text-club-gold">
                Player Development
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-club-light-gray hover:text-club-gold hover:bg-club-gold/10"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <div className="hidden sm:flex items-center gap-2">
                <LanguageSelector />
                <ThemeToggle />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden text-club-light-gray hover:text-club-gold hover:bg-club-gold/10"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
            {loading ? (
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin w-8 h-8 border-4 border-club-gold border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-club-light-gray/70">
                    {profile?.role === 'player' 
                      ? "Track your development goals and progress"
                      : "Monitor player development and provide guidance"
                    }
                  </p>
                </div>

                {/* Role-based access information */}
                <RoleBasedContent allowedRoles={['player']}>
                  <Alert className="mb-6 bg-club-gold/10 border-club-gold/30">
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
                  <div className="mb-6">
                    <PlayerSelector
                      players={players}
                      selectedPlayer={selectedPlayer}
                      onPlayerSelect={selectPlayer}
                      loading={loading}
                    />
                  </div>
                </RoleBasedContent>

                {selectedPlayer ? (
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
                ) : (
                  <div className="flex items-center justify-center min-h-[50vh] text-center">
                    <div className="space-y-2">
                      <Award className="h-12 w-12 text-club-gold/50 mx-auto" />
                      <p className="text-lg text-club-light-gray">
                        {profile?.role === 'player' 
                          ? "Loading your development plan..."
                          : "No player selected"
                        }
                      </p>
                      <p className="text-sm text-club-light-gray/60">
                        {profile?.role === 'player' 
                          ? "Please wait while we load your goals"
                          : "Please select a player to view their development plan"
                        }
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlayerDevelopment;
