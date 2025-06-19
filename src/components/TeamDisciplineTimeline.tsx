
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, AlertTriangle, Filter } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';

interface DisciplinaryData {
  match_id: number;
  match_date: string;
  opponent: string;
  location: string;
  competition: string;
  yellow_cards: number;
  red_cards: number;
  total_cards: number;
  players_booked: string[];
}

interface FilterState {
  dateRange: 'all' | 'last30' | 'last90' | 'thisMonth';
  competition: 'all' | 'League' | 'Cup';
  location: 'all' | 'Home' | 'Away';
}

const TeamDisciplineTimeline = () => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'all',
    competition: 'all',
    location: 'all'
  });

  // Fetch disciplinary data
  const { data: disciplinaryData, isLoading } = useQuery({
    queryKey: ['team-disciplinary-timeline', filters],
    queryFn: async () => {
      console.log('Fetching team disciplinary data with filters:', filters);
      
      // Get matches with disciplinary data
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select(`
          id,
          date,
          opponent,
          location,
          competition
        `)
        .order('date', { ascending: true });

      if (matchesError) {
        console.error('Error fetching matches:', matchesError);
        throw matchesError;
      }

      // Get disciplinary records
      const { data: disciplinaryRecords, error: disciplinaryError } = await supabase
        .from('player_disciplinary')
        .select(`
          player_id,
          card_type,
          match_date,
          competition,
          players!inner(name)
        `);

      if (disciplinaryError) {
        console.error('Error fetching disciplinary records:', disciplinaryError);
        throw disciplinaryError;
      }

      // Process and combine data
      const processedData: DisciplinaryData[] = matchesData.map(match => {
        const matchDisciplinary = disciplinaryRecords.filter(
          record => record.match_date === match.date
        );

        const yellowCards = matchDisciplinary.filter(
          record => record.card_type?.toLowerCase() === 'yellow'
        );
        
        const redCards = matchDisciplinary.filter(
          record => record.card_type?.toLowerCase() === 'red'
        );

        const playersBooked = matchDisciplinary.map(
          record => `${record.players?.name} (${record.card_type})`
        );

        return {
          match_id: match.id,
          match_date: match.date,
          opponent: match.opponent,
          location: match.location,
          competition: match.competition,
          yellow_cards: yellowCards.length,
          red_cards: redCards.length,
          total_cards: yellowCards.length + redCards.length,
          players_booked: playersBooked
        };
      });

      console.log('Processed disciplinary data:', processedData);
      return processedData;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    if (!disciplinaryData) return [];

    return disciplinaryData.filter(item => {
      // Date range filter
      const itemDate = parseISO(item.match_date);
      const now = new Date();
      
      if (filters.dateRange === 'last30') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (itemDate < thirtyDaysAgo) return false;
      } else if (filters.dateRange === 'last90') {
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        if (itemDate < ninetyDaysAgo) return false;
      } else if (filters.dateRange === 'thisMonth') {
        if (!isWithinInterval(itemDate, { 
          start: startOfMonth(now), 
          end: endOfMonth(now) 
        })) return false;
      }

      // Competition filter
      if (filters.competition !== 'all' && item.competition !== filters.competition) {
        return false;
      }

      // Location filter
      if (filters.location !== 'all' && item.location !== filters.location) {
        return false;
      }

      return true;
    });
  }, [disciplinaryData, filters]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!filteredData.length) return null;

    const totalYellow = filteredData.reduce((sum, item) => sum + item.yellow_cards, 0);
    const totalRed = filteredData.reduce((sum, item) => sum + item.red_cards, 0);
    const totalCards = totalYellow + totalRed;
    const averagePerGame = totalCards / filteredData.length;

    // Calculate trend (compare first half vs second half of filtered data)
    const midPoint = Math.floor(filteredData.length / 2);
    const firstHalf = filteredData.slice(0, midPoint);
    const secondHalf = filteredData.slice(midPoint);

    const firstHalfAvg = firstHalf.length > 0 
      ? firstHalf.reduce((sum, item) => sum + item.total_cards, 0) / firstHalf.length 
      : 0;
    const secondHalfAvg = secondHalf.length > 0 
      ? secondHalf.reduce((sum, item) => sum + item.total_cards, 0) / secondHalf.length 
      : 0;

    const trend = secondHalfAvg > firstHalfAvg ? 'worsening' : 'improving';

    return {
      totalCards,
      totalYellow,
      totalRed,
      averagePerGame,
      trend,
      gamesPlayed: filteredData.length
    };
  }, [filteredData]);

  // Chart data for Recharts
  const chartData = useMemo(() => {
    return filteredData.map((item, index) => ({
      ...item,
      matchNumber: index + 1,
      formattedDate: format(parseISO(item.match_date), 'MMM dd'),
      displayName: `vs ${item.opponent}`
    }));
  }, [filteredData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-club-dark-gray border border-club-gold/20 rounded-lg p-3 shadow-lg">
          <p className="text-club-gold font-medium">{data.displayName}</p>
          <p className="text-club-light-gray/70 text-sm">{data.formattedDate} • {data.location}</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-yellow-500">Yellow Cards:</span>
              <span className="text-club-light-gray">{data.yellow_cards}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-500">Red Cards:</span>
              <span className="text-club-light-gray">{data.red_cards}</span>
            </div>
            {data.players_booked.length > 0 && (
              <div className="mt-2 pt-2 border-t border-club-gold/10">
                <p className="text-xs text-club-light-gray/70">Players booked:</p>
                {data.players_booked.map((player: string, index: number) => (
                  <p key={index} className="text-xs text-club-light-gray">{player}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="text-club-gold">Team Discipline Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-club-light-gray/70">Loading disciplinary data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader>
        <CardTitle className="text-club-gold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Team Discipline Timeline
        </CardTitle>
        <CardDescription className="text-club-light-gray/70">
          Track disciplinary trends and identify patterns across matches
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-club-gold" />
            <span className="text-sm text-club-light-gray">Filters:</span>
          </div>
          
          <Select value={filters.dateRange} onValueChange={(value: any) => 
            setFilters(prev => ({ ...prev, dateRange: value }))}>
            <SelectTrigger className="w-36 bg-club-black/30 border-club-gold/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="last30">Last 30 Days</SelectItem>
              <SelectItem value="last90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.competition} onValueChange={(value: any) => 
            setFilters(prev => ({ ...prev, competition: value }))}>
            <SelectTrigger className="w-32 bg-club-black/30 border-club-gold/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Comps</SelectItem>
              <SelectItem value="League">League</SelectItem>
              <SelectItem value="Cup">Cup</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.location} onValueChange={(value: any) => 
            setFilters(prev => ({ ...prev, location: value }))}>
            <SelectTrigger className="w-28 bg-club-black/30 border-club-gold/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Home">Home</SelectItem>
              <SelectItem value="Away">Away</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Stats */}
        {summaryStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-club-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-club-gold">{summaryStats.totalCards}</div>
              <div className="text-xs text-club-light-gray/70">Total Cards</div>
            </div>
            <div className="bg-club-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-club-gold">{summaryStats.averagePerGame.toFixed(1)}</div>
              <div className="text-xs text-club-light-gray/70">Cards per Game</div>
            </div>
            <div className="bg-club-black/30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                {summaryStats.trend === 'improving' ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  summaryStats.trend === 'improving' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {summaryStats.trend === 'improving' ? 'Improving' : 'Worsening'}
                </span>
              </div>
              <div className="text-xs text-club-light-gray/70">Trend</div>
            </div>
            <div className="bg-club-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-500">2.1</div>
              <div className="text-xs text-club-light-gray/70">League Avg</div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="h-80">
          <ChartContainer
            config={{
              yellow_cards: { color: "#eab308" },
              red_cards: { color: "#ef4444" }
            }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="formattedDate"
                  stroke="#9CA3AF"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <ChartTooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="yellow_cards" 
                  stroke="#eab308" 
                  strokeWidth={2}
                  dot={{ fill: "#eab308", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#eab308", strokeWidth: 2 }}
                  name="Yellow Cards"
                />
                <Line 
                  type="monotone" 
                  dataKey="red_cards" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
                  name="Red Cards"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Card Breakdown */}
        {summaryStats && (
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-club-light-gray">
                Yellow Cards: {summaryStats.totalYellow}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-club-light-gray">
                Red Cards: {summaryStats.totalRed}
              </span>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!isLoading && (!chartData || chartData.length === 0) && (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-club-gold/50 mx-auto mb-3" />
            <p className="text-club-light-gray">No disciplinary data available for the selected filters</p>
            <p className="text-club-light-gray/70 text-sm mt-1">Try adjusting your filter criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamDisciplineTimeline;
