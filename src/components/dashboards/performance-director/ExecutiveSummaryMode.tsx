
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TouchFeedbackButton } from '@/components/TouchFeedbackButton';
import { useSwipeGestures } from '@/hooks/use-swipe-gestures';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Trophy,
  Mic,
  MicOff,
  ChevronLeft,
  ChevronRight,
  Shield,
  Target,
  Activity,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface ExecutiveSummaryModeProps {
  onClose?: () => void;
  onPresentationMode?: () => void;
}

export const ExecutiveSummaryMode = ({ onClose, onPresentationMode }: ExecutiveSummaryModeProps) => {
  const [currentTeamLevel, setCurrentTeamLevel] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const { triggerHaptic } = useHapticFeedback();

  const teamLevels = [
    { name: 'First Team', level: 'senior', color: 'text-club-gold' },
    { name: 'U23s', level: 'u23', color: 'text-blue-500' },
    { name: 'U18s', level: 'u18', color: 'text-green-500' },
    { name: 'U15s', level: 'u15', color: 'text-purple-500' },
    { name: 'U12s', level: 'u12', color: 'text-orange-500' }
  ];

  const currentTeam = teamLevels[currentTeamLevel];

  // Mock data - would come from API
  const teamData = {
    availablePlayers: 18,
    injuredPlayers: 4,
    developmentProgress: 78,
    newTalents: 3,
    criticalAlerts: [
      { type: 'injury', message: 'Key striker expected out 6 weeks', severity: 'high' },
      { type: 'development', message: '2 players ready for promotion', severity: 'medium' }
    ],
    keyMetrics: {
      performanceIndex: 87,
      developmentROI: 156,
      talentRetention: 94,
      academyGraduation: 12
    }
  };

  const { swipeProps } = useSwipeGestures({
    onSwipeLeft: () => {
      if (currentTeamLevel < teamLevels.length - 1) {
        setCurrentTeamLevel(currentTeamLevel + 1);
        triggerHaptic('light');
      }
    },
    onSwipeRight: () => {
      if (currentTeamLevel > 0) {
        setCurrentTeamLevel(currentTeamLevel - 1);
        triggerHaptic('light');
      }
    },
    threshold: 100
  });

  const handleVoiceNote = () => {
    setIsRecording(!isRecording);
    triggerHaptic('medium');
    
    if (!isRecording) {
      toast.success('Voice recording started');
      // Mock recording functionality
      setTimeout(() => {
        setIsRecording(false);
        toast.success('Voice note saved');
      }, 3000);
    } else {
      toast.success('Voice note saved');
    }
  };

  const navigateTeam = (direction: 'prev' | 'next') => {
    if (direction === 'next' && currentTeamLevel < teamLevels.length - 1) {
      setCurrentTeamLevel(currentTeamLevel + 1);
    } else if (direction === 'prev' && currentTeamLevel > 0) {
      setCurrentTeamLevel(currentTeamLevel - 1);
    }
    triggerHaptic('light');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-club-black via-club-dark-gray to-club-black p-4" {...swipeProps}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-club-gold">Executive Summary</h1>
          <p className="text-club-light-gray/70 text-sm">Performance Director Dashboard</p>
        </div>
        <div className="flex gap-2">
          <TouchFeedbackButton
            variant="outline"
            size="sm"
            onClick={handleVoiceNote}
            className={`border-club-gold/30 ${isRecording ? 'bg-red-500/20 border-red-500' : ''}`}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </TouchFeedbackButton>
          {onClose && (
            <TouchFeedbackButton
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-club-gold/30"
            >
              Close
            </TouchFeedbackButton>
          )}
        </div>
      </div>

      {/* Team Level Navigation */}
      <Card className="bg-club-dark-gray/80 backdrop-blur-sm border-club-gold/20 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <TouchFeedbackButton
              variant="ghost"
              size="sm"
              onClick={() => navigateTeam('prev')}
              disabled={currentTeamLevel === 0}
              className="p-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </TouchFeedbackButton>
            
            <div className="text-center">
              <h2 className={`text-xl font-bold ${currentTeam.color}`}>
                {currentTeam.name}
              </h2>
              <div className="flex justify-center mt-2 gap-1">
                {teamLevels.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                      index === currentTeamLevel ? 'bg-club-gold' : 'bg-club-light-gray/30'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <TouchFeedbackButton
              variant="ghost"
              size="sm"
              onClick={() => navigateTeam('next')}
              disabled={currentTeamLevel === teamLevels.length - 1}
              className="p-2"
            >
              <ChevronRight className="h-5 w-5" />
            </TouchFeedbackButton>
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {teamData.criticalAlerts.length > 0 && (
        <div className="space-y-3 mb-6">
          {teamData.criticalAlerts.map((alert, index) => (
            <Alert
              key={index}
              className={`${
                alert.severity === 'high' 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : 'bg-amber-500/10 border-amber-500/30'
              } backdrop-blur-sm`}
            >
              <AlertTriangle className={`h-4 w-4 ${
                alert.severity === 'high' ? 'text-red-500' : 'text-amber-500'
              }`} />
              <AlertDescription className={
                alert.severity === 'high' ? 'text-red-400' : 'text-amber-400'
              }>
                {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-club-dark-gray/80 backdrop-blur-sm border-club-gold/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-500">{teamData.availablePlayers}</div>
            <div className="text-xs text-club-light-gray/70">Available Players</div>
            <div className="text-xs text-red-400 mt-1">{teamData.injuredPlayers} injured</div>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray/80 backdrop-blur-sm border-club-gold/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-club-gold" />
            </div>
            <div className="text-2xl font-bold text-club-gold">{teamData.developmentProgress}%</div>
            <div className="text-xs text-club-light-gray/70">Development Progress</div>
            <div className="text-xs text-green-400 mt-1">+{teamData.newTalents} new talents</div>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray/80 backdrop-blur-sm border-club-gold/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-500">{teamData.keyMetrics.performanceIndex}</div>
            <div className="text-xs text-club-light-gray/70">Performance Index</div>
            <div className="text-xs text-blue-400 mt-1">League top 3</div>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray/80 backdrop-blur-sm border-club-gold/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-6 w-6 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-500">{teamData.keyMetrics.developmentROI}%</div>
            <div className="text-xs text-club-light-gray/70">Development ROI</div>
            <div className="text-xs text-purple-400 mt-1">Above target</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <TouchFeedbackButton
          className="bg-club-gold text-club-black hover:bg-club-gold/90 h-16"
          onClick={onPresentationMode}
        >
          <div className="text-center">
            <Shield className="h-6 w-6 mx-auto mb-1" />
            <div className="text-sm font-medium">Present to Board</div>
          </div>
        </TouchFeedbackButton>

        <TouchFeedbackButton
          variant="outline"
          className="border-club-gold/30 h-16"
          onClick={() => toast.success('Detailed report generated')}
        >
          <div className="text-center">
            <Clock className="h-6 w-6 mx-auto mb-1" />
            <div className="text-sm font-medium">Generate Report</div>
          </div>
        </TouchFeedbackButton>
      </div>
    </div>
  );
};
