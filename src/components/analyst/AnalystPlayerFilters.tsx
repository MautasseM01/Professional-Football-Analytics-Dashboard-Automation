
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, RefreshCw } from "lucide-react";
import { TimeFilter, MatchTypeFilter } from "@/hooks/use-analyst-player-data";

interface AnalystPlayerFiltersProps {
  timeFilter: TimeFilter;
  matchTypeFilter: MatchTypeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
  onMatchTypeFilterChange: (filter: MatchTypeFilter) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export const AnalystPlayerFilters = ({
  timeFilter,
  matchTypeFilter,
  onTimeFilterChange,
  onMatchTypeFilterChange,
  onRefresh,
  loading = false
}: AnalystPlayerFiltersProps) => {
  return (
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-club-gold text-sm font-medium flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Analysis Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="text-xs text-club-light-gray/70">Time Period</label>
            <Select
              value={timeFilter.period}
              onValueChange={(value: any) => onTimeFilterChange({ period: value })}
            >
              <SelectTrigger className="bg-club-black border-club-gold/30 text-club-light-gray">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last5">Last 5 Matches</SelectItem>
                <SelectItem value="last10">Last 10 Matches</SelectItem>
                <SelectItem value="season">Full Season</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-club-light-gray/70">Competition</label>
            <Select
              value={matchTypeFilter.competition}
              onValueChange={(value: any) =>
                onMatchTypeFilterChange({ ...matchTypeFilter, competition: value })
              }
            >
              <SelectTrigger className="bg-club-black border-club-gold/30 text-club-light-gray">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Competitions</SelectItem>
                <SelectItem value="league">League Only</SelectItem>
                <SelectItem value="cup">Cup Matches</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-club-light-gray/70">Location</label>
            <Select
              value={matchTypeFilter.location}
              onValueChange={(value: any) =>
                onMatchTypeFilterChange({ ...matchTypeFilter, location: value })
              }
            >
              <SelectTrigger className="bg-club-black border-club-gold/30 text-club-light-gray">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Home & Away</SelectItem>
                <SelectItem value="home">Home Only</SelectItem>
                <SelectItem value="away">Away Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs border-club-gold/30 text-club-light-gray">
              <Calendar className="h-3 w-3 mr-1" />
              {timeFilter.period === 'season' ? 'Full Season' : 
               timeFilter.period === 'last10' ? 'Last 10' : 
               timeFilter.period === 'last5' ? 'Last 5' : 'Custom'}
            </Badge>
            {matchTypeFilter.competition !== 'all' && (
              <Badge variant="outline" className="text-xs border-club-gold/30 text-club-light-gray">
                {matchTypeFilter.competition}
              </Badge>
            )}
            {matchTypeFilter.location !== 'all' && (
              <Badge variant="outline" className="text-xs border-club-gold/30 text-club-light-gray">
                {matchTypeFilter.location}
              </Badge>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="border-club-gold/30 hover:bg-club-gold/10 text-club-light-gray"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
