
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TouchFeedbackButton } from './TouchFeedbackButton';
import { useSwipeGestures } from '@/hooks/use-swipe-gestures';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, TrendingUp, Users, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart, ReferenceLine } from 'recharts';

interface PerformanceDataPoint {
  match: number;
  date: string;
  goals: number;
  assists: number;
  passes: number;
  distance: number;
  rating: number;
}

interface IOSPerformanceTrendsProps {
  playerId: string;
  playerName: string;
  performanceData: PerformanceDataPoint[];
  comparisonData?: PerformanceDataPoint[];
  comparisonPlayerName?: string;
  className?: string;
}

export const IOSPerformanceTrends = ({
  playerId,
  playerName,
  performanceData,
  comparisonData,
  comparisonPlayerName,
  className
}: IOSPerformanceTrendsProps) => {
  const [activeMetric, setActiveMetric] = useState('rating');
  const [showComparison, setShowComparison] = useState(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState<PerformanceDataPoint | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHapticFeedback();

  const metrics = [
    { id: 'rating', label: 'Rating', color: '#3B82F6', unit: '' },
    { id: 'goals', label: 'Goals', color: '#D4AF37', unit: '' },
    { id: 'assists', label: 'Assists', color: '#10B981', unit: '' },
    { id: 'passes', label: 'Passes', color: '#8B5CF6', unit: '' },
    { id: 'distance', label: 'Distance', color: '#F59E0B', unit: 'km' }
  ];

  const currentMetric = metrics.find(m => m.id === activeMetric) || metrics[0];

  // Swipe gestures for metric switching
  const { swipeProps } = useSwipeGestures({
    onSwipeLeft: () => {
      const currentIndex = metrics.findIndex(m => m.id === activeMetric);
      if (currentIndex < metrics.length - 1) {
        setActiveMetric(metrics[currentIndex + 1].id);
        triggerHaptic('light');
      }
    },
    onSwipeRight: () => {
      const currentIndex = metrics.findIndex(m => m.id === activeMetric);
      if (currentIndex > 0) {
        setActiveMetric(metrics[currentIndex - 1].id);
        triggerHaptic('light');
      }
    },
    threshold: 50
  });

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 rounded-2xl p-4 shadow-xl">
          <div className="text-ios-caption2 font-medium text-gray-900 dark:text-white mb-2">
            Match {data.match} • {data.date}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-ios-caption text-gray-600 dark:text-gray-400">
                {currentMetric.label}
              </span>
              <span className="text-ios-caption font-medium text-gray-900 dark:text-white">
                {data[activeMetric]}{currentMetric.unit}
              </span>
            </div>
            {showComparison && comparisonData && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-ios-caption text-gray-600 dark:text-gray-400">
                  {comparisonPlayerName}
                </span>
                <span className="text-ios-caption font-medium text-orange-600 dark:text-orange-400">
                  {comparisonData.find(d => d.match === data.match)?.[activeMetric as keyof PerformanceDataPoint] || 0}{currentMetric.unit}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate trend direction
  const getTrendDirection = () => {
    if (performanceData.length < 2) return 'neutral';
    const recent = performanceData.slice(-3);
    const older = performanceData.slice(-6, -3);
    const recentAvg = recent.reduce((sum, d) => sum + (d[activeMetric as keyof PerformanceDataPoint] as number), 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + (d[activeMetric as keyof PerformanceDataPoint] as number), 0) / older.length;
    
    if (recentAvg > olderAvg * 1.1) return 'up';
    if (recentAvg < olderAvg * 0.9) return 'down';
    return 'neutral';
  };

  const trendDirection = getTrendDirection();

  return (
    <div className={cn("w-full", className)}>
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/20 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-ios-headline font-semibold text-gray-900 dark:text-white">
                Performance Trends
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-ios-caption text-gray-600 dark:text-gray-400">
                  {playerName}
                </p>
                {trendDirection !== 'neutral' && (
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full",
                    trendDirection === 'up' 
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  )}>
                    <TrendingUp 
                      size={10} 
                      className={cn(
                        trendDirection === 'down' && "rotate-180"
                      )} 
                    />
                    <span className="text-ios-caption2 font-medium">
                      {trendDirection === 'up' ? 'Improving' : 'Declining'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {comparisonData && (
              <TouchFeedbackButton
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowComparison(!showComparison);
                  triggerHaptic('light');
                }}
                className={cn(
                  "h-8 px-3",
                  showComparison ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : ""
                )}
              >
                <Users size={14} className="mr-1" />
                Compare
              </TouchFeedbackButton>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Metric Selection */}
          <div className="px-4 pb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {metrics.map((metric) => (
                <TouchFeedbackButton
                  key={metric.id}
                  variant={activeMetric === metric.id ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "whitespace-nowrap h-8 px-3 text-ios-caption",
                    activeMetric === metric.id 
                      ? "text-white shadow-lg"
                      : "bg-white/50 dark:bg-slate-800/50"
                  )}
                  style={{
                    backgroundColor: activeMetric === metric.id ? metric.color : undefined
                  }}
                  onClick={() => {
                    setActiveMetric(metric.id);
                    triggerHaptic('light');
                  }}
                >
                  {metric.label}
                </TouchFeedbackButton>
              ))}
            </div>
          </div>

          {/* Chart Container */}
          <div 
            ref={chartRef}
            className="h-64 px-4 pb-4"
            {...swipeProps}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.05}/>
                  </linearGradient>
                  {showComparison && (
                    <linearGradient id="comparisonGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0.05}/>
                    </linearGradient>
                  )}
                </defs>
                
                <XAxis 
                  dataKey="match" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                <Area
                  type="monotone"
                  dataKey={activeMetric}
                  stroke={currentMetric.color}
                  strokeWidth={3}
                  fill="url(#metricGradient)"
                  dot={{ fill: currentMetric.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: currentMetric.color, strokeWidth: 2 }}
                />
                
                {showComparison && comparisonData && (
                  <Line
                    type="monotone"
                    dataKey={activeMetric}
                    data={comparisonData}
                    stroke="#F97316"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#F97316", strokeWidth: 2, r: 3 }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Metric indicators */}
          <div className="flex justify-center gap-1 px-4 pb-4">
            {metrics.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1.5 w-6 rounded-full transition-all duration-300",
                  metrics[index].id === activeMetric 
                    ? "opacity-100" 
                    : "bg-gray-300 dark:bg-gray-600 opacity-30"
                )}
                style={{
                  backgroundColor: metrics[index].id === activeMetric ? currentMetric.color : undefined
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
