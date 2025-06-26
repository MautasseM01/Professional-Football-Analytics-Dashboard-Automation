
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TouchFeedbackButton } from '@/components/TouchFeedbackButton';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { ResponsiveChartContainer } from '@/components/ResponsiveChartContainer';
import { PlayerAvatar } from '@/components/PlayerAvatar';
import { 
  Maximize2, 
  Minimize2, 
  Download, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Users,
  TrendingUp,
  Target,
  Award,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { toast } from 'sonner';

interface TabletPresentationModeProps {
  onExit?: () => void;
}

interface OverviewData {
  totalPlayers: number;
  availablePlayers: number;
  developmentProgress: number;
  performanceIndex: number;
}

interface DevelopmentData {
  month: string;
  progress: number;
  target: number;
}

interface PlayerData {
  id: number;
  name: string;
  position: string;
  rating: number;
  improvement: string;
}

interface TeamData {
  team: string;
  performance: number;
  players: number;
}

interface SlideData {
  title: string;
  type: 'overview' | 'development' | 'players' | 'teams';
  data: OverviewData | DevelopmentData[] | PlayerData[] | TeamData[];
}

export const TabletPresentationMode = ({ onExit }: TabletPresentationModeProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  const { triggerHaptic } = useHapticFeedback();

  // Mock presentation data with proper typing
  const slides: SlideData[] = [
    { 
      title: 'Executive Overview', 
      type: 'overview',
      data: {
        totalPlayers: 85,
        availablePlayers: 74,
        developmentProgress: 87,
        performanceIndex: 92
      }
    },
    { 
      title: 'Development Progress', 
      type: 'development',
      data: [
        { month: 'Aug', progress: 65, target: 70 },
        { month: 'Sep', progress: 72, target: 75 },
        { month: 'Oct', progress: 78, target: 80 },
        { month: 'Nov', progress: 85, target: 85 },
        { month: 'Dec', progress: 87, target: 90 }
      ]
    },
    { 
      title: 'Top Performers', 
      type: 'players',
      data: [
        { id: 1, name: 'Marcus Johnson', position: 'Midfielder', rating: 9.2, improvement: '+15%' },
        { id: 2, name: 'Alex Rodriguez', position: 'Forward', rating: 9.0, improvement: '+22%' },
        { id: 3, name: 'David Chen', position: 'Defender', rating: 8.8, improvement: '+18%' }
      ]
    },
    { 
      title: 'Team Performance by Level', 
      type: 'teams',
      data: [
        { team: 'First Team', performance: 92, players: 25 },
        { team: 'U23s', performance: 88, players: 20 },
        { team: 'U18s', performance: 85, players: 18 },
        { team: 'U15s', performance: 82, players: 15 },
        { team: 'U12s', performance: 79, players: 12 }
      ]
    }
  ];

  const currentSlideData = slides[currentSlide];

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
      triggerHaptic('medium');
    } catch (error) {
      toast.error('Fullscreen not supported');
    }
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      triggerHaptic('light');
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      triggerHaptic('light');
    }
  };

  const exportPresentation = () => {
    triggerHaptic('medium');
    toast.success('Presentation exported successfully');
  };

  const sharePresentation = () => {
    triggerHaptic('medium');
    if (navigator.share) {
      navigator.share({
        title: 'Performance Director Presentation',
        text: 'Development progress and performance metrics',
        url: window.location.href
      });
    } else {
      toast.success('Presentation link copied to clipboard');
    }
  };

  const renderSlideContent = () => {
    switch (currentSlideData.type) {
      case 'overview':
        const overviewData = currentSlideData.data as OverviewData;
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-full">
            <Card className="bg-club-dark-gray/50 border-club-gold/20 flex items-center justify-center">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-club-gold mx-auto mb-4" />
                <div className="text-4xl font-bold text-club-gold">{overviewData.totalPlayers}</div>
                <div className="text-club-light-gray">Total Players</div>
              </CardContent>
            </Card>
            <Card className="bg-club-dark-gray/50 border-green-500/20 flex items-center justify-center">
              <CardContent className="p-6 text-center">
                <Activity className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <div className="text-4xl font-bold text-green-500">{overviewData.availablePlayers}</div>
                <div className="text-club-light-gray">Available</div>
              </CardContent>
            </Card>
            <Card className="bg-club-dark-gray/50 border-blue-500/20 flex items-center justify-center">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <div className="text-4xl font-bold text-blue-500">{overviewData.developmentProgress}%</div>
                <div className="text-club-light-gray">Development</div>
              </CardContent>
            </Card>
            <Card className="bg-club-dark-gray/50 border-purple-500/20 flex items-center justify-center">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <div className="text-4xl font-bold text-purple-500">{overviewData.performanceIndex}</div>
                <div className="text-club-light-gray">Performance</div>
              </CardContent>
            </Card>
          </div>
        );

      case 'development':
        const developmentData = currentSlideData.data as DevelopmentData[];
        return (
          <ResponsiveChartContainer className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={developmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #D4AF37',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="progress" 
                  stroke="#D4AF37" 
                  strokeWidth={4}
                  dot={{ fill: '#D4AF37', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#6B7280" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#6B7280', strokeWidth: 1, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ResponsiveChartContainer>
        );

      case 'players':
        const playersData = currentSlideData.data as PlayerData[];
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {playersData.map((player: PlayerData, index: number) => (
              <Card 
                key={player.id}
                className="bg-club-dark-gray/50 border-club-gold/20 cursor-pointer hover:border-club-gold/40 transition-all"
                onClick={() => {
                  setSelectedPlayer(player);
                  triggerHaptic('light');
                }}
              >
                <CardContent className="p-6 text-center">
                  <PlayerAvatar player={player} size="lg" className="mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-club-light-gray mb-2">{player.name}</h3>
                  <Badge variant="outline" className="mb-3">{player.position}</Badge>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-club-gold">{player.rating}</div>
                    <div className="text-green-400 font-medium">{player.improvement}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'teams':
        const teamsData = currentSlideData.data as TeamData[];
        return (
          <ResponsiveChartContainer className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="team" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #D4AF37',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="performance" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ResponsiveChartContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-club-black via-club-dark-gray to-club-black ${isFullscreen ? 'p-0' : 'p-4'}`}>
      {/* Header */}
      {!isFullscreen && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-club-gold">Board Presentation</h1>
            <p className="text-club-light-gray/70">Performance Director Dashboard</p>
          </div>
          <div className="flex gap-2">
            <TouchFeedbackButton
              variant="outline"
              size="sm"
              onClick={sharePresentation}
              className="border-club-gold/30"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </TouchFeedbackButton>
            <TouchFeedbackButton
              variant="outline"
              size="sm"
              onClick={exportPresentation}
              className="border-club-gold/30"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </TouchFeedbackButton>
            <TouchFeedbackButton
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="border-club-gold/30"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </TouchFeedbackButton>
            {onExit && (
              <TouchFeedbackButton
                variant="outline"
                size="sm"
                onClick={onExit}
                className="border-club-gold/30"
              >
                Exit
              </TouchFeedbackButton>
            )}
          </div>
        </div>
      )}

      {/* Slide Content */}
      <Card className={`bg-club-dark-gray/80 backdrop-blur-sm border-club-gold/20 ${isFullscreen ? 'h-screen rounded-none' : 'min-h-[600px]'}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-club-gold">{currentSlideData.title}</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-club-light-gray/70">
                {currentSlide + 1} / {slides.length}
              </span>
              <div className="flex gap-1">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-club-gold' : 'bg-club-light-gray/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className={`${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[500px]'}`}>
          {renderSlideContent()}
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center mt-6 gap-4">
        <TouchFeedbackButton
          variant="outline"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="border-club-gold/30"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </TouchFeedbackButton>
        
        <TouchFeedbackButton
          variant="outline"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="border-club-gold/30"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </TouchFeedbackButton>
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPlayer(null)}
        >
          <Card className="bg-club-dark-gray border-club-gold/20 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="text-club-gold">{selectedPlayer.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <PlayerAvatar player={selectedPlayer} size="lg" className="mx-auto mb-4" />
                  <Badge variant="outline" className="mb-2">{selectedPlayer.position}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-club-gold">{selectedPlayer.rating}</div>
                    <div className="text-sm text-club-light-gray/70">Current Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">{selectedPlayer.improvement}</div>
                    <div className="text-sm text-club-light-gray/70">Improvement</div>
                  </div>
                </div>
                <TouchFeedbackButton
                  className="w-full bg-club-gold text-club-black"
                  onClick={() => setSelectedPlayer(null)}
                >
                  Close
                </TouchFeedbackButton>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
