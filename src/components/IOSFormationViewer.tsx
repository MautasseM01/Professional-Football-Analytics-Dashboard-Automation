
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TouchFeedbackButton } from './TouchFeedbackButton';
import { useSwipeGestures } from '@/hooks/use-swipe-gestures';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, RotateCcw, Users, Clock, ArrowUpDown } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  position: { x: number; y: number };
  role: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
  number: number;
  isSubstituted?: boolean;
}

interface Formation {
  id: string;
  name: string;
  time: string;
  players: Player[];
  substitutions?: Array<{
    playerOut: string;
    playerIn: string;
    time: string;
  }>;
}

interface IOSFormationViewerProps {
  formations: Formation[];
  currentFormationIndex?: number;
  onFormationChange?: (index: number) => void;
  allowEdit?: boolean;
  className?: string;
}

export const IOSFormationViewer = ({
  formations,
  currentFormationIndex = 0,
  onFormationChange,
  allowEdit = false,
  className
}: IOSFormationViewerProps) => {
  const [selectedFormation, setSelectedFormation] = useState(currentFormationIndex);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonFormation, setComparisonFormation] = useState<number | null>(null);
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHapticFeedback();

  const currentFormation = formations[selectedFormation];

  // Role colors
  const roleColors = {
    goalkeeper: '#EF4444', // Red
    defender: '#3B82F6',   // Blue
    midfielder: '#10B981', // Green
    forward: '#F59E0B'     // Amber
  };

  // Swipe gestures for formation timeline
  const { swipeProps } = useSwipeGestures({
    onSwipeLeft: () => {
      if (selectedFormation < formations.length - 1) {
        const newIndex = selectedFormation + 1;
        setSelectedFormation(newIndex);
        onFormationChange?.(newIndex);
        triggerHaptic('light');
      }
    },
    onSwipeRight: () => {
      if (selectedFormation > 0) {
        const newIndex = selectedFormation - 1;
        setSelectedFormation(newIndex);
        onFormationChange?.(newIndex);
        triggerHaptic('light');
      }
    },
    threshold: 50
  });

  // Player avatar component
  const PlayerAvatar = ({ player, isComparison = false }: { player: Player; isComparison?: boolean }) => {
    const initials = player.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const backgroundColor = roleColors[player.role];
    
    return (
      <div
        className={cn(
          "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
          allowEdit && "cursor-move",
          player.isSubstituted && "opacity-50",
          isComparison && "opacity-70 scale-90"
        )}
        style={{
          left: `${player.position.x}%`,
          top: `${player.position.y}%`,
        }}
        onTouchStart={() => {
          if (allowEdit) {
            setDraggedPlayer(player.id);
            triggerHaptic('medium');
          }
        }}
        onTouchEnd={() => {
          setDraggedPlayer(null);
        }}
      >
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white",
            draggedPlayer === player.id && "scale-110 shadow-xl"
          )}
          style={{ backgroundColor }}
        >
          <span className="text-white text-ios-caption2 font-bold">
            {player.number}
          </span>
        </div>
        
        {/* Player name */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-sm">
          <span className="text-ios-caption2 text-gray-900 dark:text-white whitespace-nowrap">
            {initials}
          </span>
        </div>

        {/* Substitution indicator */}
        {player.isSubstituted && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <ArrowUpDown size={8} className="text-white" />
          </div>
        )}
      </div>
    );
  };

  // Formation timeline
  const FormationTimeline = () => (
    <div className="flex gap-2 overflow-x-auto pb-2" {...swipeProps}>
      {formations.map((formation, index) => (
        <TouchFeedbackButton
          key={formation.id}
          variant={selectedFormation === index ? "default" : "outline"}
          size="sm"
          className={cn(
            "whitespace-nowrap h-10 px-4 flex-shrink-0",
            selectedFormation === index 
              ? "bg-blue-600 text-white shadow-lg" 
              : "bg-white/50 dark:bg-slate-800/50"
          )}
          onClick={() => {
            setSelectedFormation(index);
            onFormationChange?.(index);
            triggerHaptic('light');
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-ios-caption2 font-medium">{formation.name}</span>
            <span className="text-ios-caption opacity-70">{formation.time}</span>
          </div>
        </TouchFeedbackButton>
      ))}
    </div>
  );

  return (
    <div className={cn("w-full", className)}>
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/20 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-ios-headline font-semibold text-gray-900 dark:text-white">
                Team Formation
              </CardTitle>
              <p className="text-ios-caption text-gray-600 dark:text-gray-400 mt-1">
                {currentFormation?.name} • {currentFormation?.time}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {formations.length > 1 && (
                <TouchFeedbackButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setComparisonMode(!comparisonMode);
                    if (!comparisonMode && selectedFormation > 0) {
                      setComparisonFormation(selectedFormation - 1);
                    } else {
                      setComparisonFormation(null);
                    }
                    triggerHaptic('medium');
                  }}
                  className={cn(
                    "h-8 px-3",
                    comparisonMode ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : ""
                  )}
                >
                  <Users size={14} className="mr-1" />
                  Compare
                </TouchFeedbackButton>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Formation Timeline */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <Clock size={16} className="text-gray-500 dark:text-gray-400" />
              <span className="text-ios-caption text-gray-600 dark:text-gray-400">Formation Timeline</span>
            </div>
            <FormationTimeline />
          </div>

          {/* Football Field */}
          <div className="relative">
            {comparisonMode ? (
              // Side-by-side comparison view
              <div className="grid grid-cols-2 gap-1">
                {[currentFormation, comparisonFormation !== null ? formations[comparisonFormation] : null].map((formation, index) => (
                  formation && (
                    <div key={index} className="relative aspect-[2/3] bg-green-100 dark:bg-green-900/20 overflow-hidden">
                      {/* Field markings */}
                      <div className="absolute inset-2 border-2 border-white/50 rounded-sm">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/50 transform -translate-y-0.5" />
                        <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white/50 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute top-0 left-1/4 right-1/4 h-8 border-2 border-t-0 border-white/50" />
                        <div className="absolute bottom-0 left-1/4 right-1/4 h-8 border-2 border-b-0 border-white/50" />
                      </div>

                      {/* Players */}
                      {formation.players.map((player) => (
                        <PlayerAvatar key={player.id} player={player} isComparison={index === 1} />
                      ))}

                      {/* Formation label */}
                      <div className="absolute top-2 left-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-2 py-1">
                        <span className="text-ios-caption2 font-medium text-gray-900 dark:text-white">
                          {formation.name}
                        </span>
                      </div>
                    </div>
                  )
                ))}
              </div>
            ) : (
              // Single formation view
              <div className="relative aspect-[2/3] bg-green-100 dark:bg-green-900/20 overflow-hidden">
                {/* Field markings */}
                <div className="absolute inset-4 border-2 border-white/50 rounded-sm">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/50 transform -translate-y-0.5" />
                  <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-white/50 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute top-0 left-1/4 right-1/4 h-12 border-2 border-t-0 border-white/50" />
                  <div className="absolute bottom-0 left-1/4 right-1/4 h-12 border-2 border-b-0 border-white/50" />
                </div>

                {/* Players */}
                {currentFormation?.players.map((player) => (
                  <PlayerAvatar key={player.id} player={player} />
                ))}

                {/* Role legend */}
                <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                  <div className="text-ios-caption2 font-medium text-gray-900 dark:text-white mb-2">
                    Player Roles
                  </div>
                  <div className="space-y-1">
                    {Object.entries(roleColors).map(([role, color]) => (
                      <div key={role} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-ios-caption text-gray-600 dark:text-gray-400 capitalize">
                          {role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Substitutions */}
          {currentFormation?.substitutions && currentFormation.substitutions.length > 0 && (
            <div className="p-4 bg-gray-50/50 dark:bg-slate-800/50">
              <div className="text-ios-caption2 font-medium text-gray-900 dark:text-white mb-2">
                Substitutions
              </div>
              <div className="space-y-2">
                {currentFormation.substitutions.map((sub, index) => (
                  <div key={index} className="flex items-center gap-3 text-ios-caption">
                    <span className="text-gray-600 dark:text-gray-400">{sub.time}</span>
                    <ArrowUpDown size={12} className="text-gray-500" />
                    <span className="text-red-600 dark:text-red-400">{sub.playerOut}</span>
                    <span className="text-gray-500">→</span>
                    <span className="text-green-600 dark:text-green-400">{sub.playerIn}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
