
import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type TimePeriod = 'full_match' | 'first_half' | 'second_half' | 'last_15min' | 'custom';

interface HeatmapTimePeriodFilterProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  availableMatches?: Array<{ id: string; date: string; opponent: string }>;
  selectedMatch?: string;
  onMatchChange?: (matchId: string) => void;
  className?: string;
}

const timePeriods = [
  { id: 'full_match' as TimePeriod, label: 'Full Match', icon: Clock },
  { id: 'first_half' as TimePeriod, label: 'First Half', icon: Clock },
  { id: 'second_half' as TimePeriod, label: 'Second Half', icon: Clock },
  { id: 'last_15min' as TimePeriod, label: 'Last 15 min', icon: Clock },
];

export const HeatmapTimePeriodFilter = ({
  selectedPeriod,
  onPeriodChange,
  availableMatches = [],
  selectedMatch,
  onMatchChange,
  className = ""
}: HeatmapTimePeriodFilterProps) => {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Time Period Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Clock size={14} />
          Time Period
        </label>
        <Select value={selectedPeriod} onValueChange={onPeriodChange}>
          <SelectTrigger className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-gray-200 dark:border-slate-600 shadow-2xl">
            {timePeriods.map((period) => (
              <SelectItem 
                key={period.id} 
                value={period.id}
                className="hover:bg-blue-50 dark:hover:bg-slate-700 focus:bg-blue-100 dark:focus:bg-slate-600"
              >
                <div className="flex items-center gap-2">
                  <period.icon size={14} />
                  {period.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Match Selection */}
      {availableMatches.length > 0 && onMatchChange && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Calendar size={14} />
            Match
          </label>
          <Select value={selectedMatch} onValueChange={onMatchChange}>
            <SelectTrigger className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all">
              <SelectValue placeholder="Select match" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-gray-200 dark:border-slate-600 shadow-2xl">
              {availableMatches.map((match) => (
                <SelectItem 
                  key={match.id} 
                  value={match.id}
                  className="hover:bg-blue-50 dark:hover:bg-slate-700 focus:bg-blue-100 dark:focus:bg-slate-600"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">vs {match.opponent}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{match.date}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Quick Filter Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {timePeriods.slice(0, 4).map((period) => (
          <Button
            key={period.id}
            variant={selectedPeriod === period.id ? "default" : "outline"}
            size="sm"
            onClick={() => onPeriodChange(period.id)}
            className={`transition-all ${
              selectedPeriod === period.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500"
            }`}
          >
            <period.icon size={12} className="mr-1" />
            {period.label.replace(' ', '\n')}
          </Button>
        ))}
      </div>
    </div>
  );
};
