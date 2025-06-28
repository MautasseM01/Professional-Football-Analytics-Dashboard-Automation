
import React, { useState, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ChevronUp, 
  ChevronDown,
  MoreHorizontal,
  RefreshCw
} from "lucide-react";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaginatedPlayers } from "@/hooks/use-optimized-analytics";
import { useDebounce } from "@/hooks/use-debounce";

interface OptimizedDataTableProps {
  className?: string;
}

interface PlayerRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    players: any[];
    onPlayerSelect: (player: any) => void;
  };
}

const PlayerRow = ({ index, style, data }: PlayerRowProps) => {
  const player = data.players[index];
  
  if (!player) {
    return (
      <div style={style} className="flex items-center p-4 border-b border-club-gold/10">
        <Skeleton className="h-4 w-full bg-club-gold/20" />
      </div>
    );
  }

  return (
    <div 
      style={style} 
      className="flex items-center justify-between p-4 border-b border-club-gold/10 hover:bg-club-gold/5 transition-colors"
    >
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 rounded-full bg-club-gold/20 flex items-center justify-center text-club-gold text-sm font-bold">
          {player.number || '?'}
        </div>
        <div>
          <div className="font-medium text-club-light-gray">{player.name}</div>
          <div className="text-sm text-club-light-gray/60">{player.position}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-6 text-sm">
        <div className="text-center">
          <div className="text-club-gold font-medium">{player.goals || 0}</div>
          <div className="text-club-light-gray/60">Goals</div>
        </div>
        <div className="text-center">
          <div className="text-club-gold font-medium">{player.assists || 0}</div>
          <div className="text-club-light-gray/60">Assists</div>
        </div>
        <div className="text-center">
          <div className="text-club-gold font-medium">{player.match_rating?.toFixed(1) || '0.0'}</div>
          <div className="text-club-light-gray/60">Rating</div>
        </div>
        <TouchFeedbackButton
          size="sm"
          variant="outline"
          onClick={() => data.onPlayerSelect(player)}
          className="border-club-gold/30 text-club-light-gray hover:bg-club-gold/10"
        >
          <MoreHorizontal className="h-4 w-4" />
        </TouchFeedbackButton>
      </div>
    </div>
  );
};

export const OptimizedDataTable = ({ className }: OptimizedDataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'goals' | 'assists' | 'match_rating'>('match_rating');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = usePaginatedPlayers(debouncedSearchTerm, 50);

  const allPlayers = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  const sortedPlayers = useMemo(() => {
    return [...allPlayers].sort((a, b) => {
      const aValue = a[sortField] || 0;
      const bValue = b[sortField] || 0;
      
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [allPlayers, sortField, sortDirection]);

  const handleSort = useCallback((field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  }, [sortField]);

  const handlePlayerSelect = useCallback((player: any) => {
    console.log('Selected player:', player);
    // Handle player selection
  }, []);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) {
    return (
      <Card className={`bg-club-dark-gray border-club-gold/20 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="text-red-400 mb-4">Failed to load player data</div>
          <TouchFeedbackButton onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </TouchFeedbackButton>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-club-dark-gray border-club-gold/20 ${className}`}>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-club-gold">Player Performance</CardTitle>
          <div className="text-sm text-club-light-gray/60">
            {allPlayers.length} players loaded
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-club-gold/60 h-4 w-4" />
            <Input
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-club-black border-club-gold/30 text-club-light-gray"
            />
          </div>
          
          <TouchFeedbackButton
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="border-club-gold/30 text-club-light-gray"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </TouchFeedbackButton>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Header Row */}
        <div className="flex items-center justify-between p-4 border-b border-club-gold/20 bg-club-black/40">
          <div className="flex items-center space-x-4">
            <div className="w-8"></div>
            <TouchFeedbackButton
              variant="ghost"
              onClick={() => handleSort('name')}
              className="text-club-gold hover:bg-club-gold/10 p-2"
            >
              Player {sortField === 'name' && (
                sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </TouchFeedbackButton>
          </div>
          
          <div className="flex items-center space-x-6">
            <TouchFeedbackButton
              variant="ghost"
              onClick={() => handleSort('goals')}
              className="text-club-gold hover:bg-club-gold/10 p-2"
            >
              Goals {sortField === 'goals' && (
                sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </TouchFeedbackButton>
            <TouchFeedbackButton
              variant="ghost"
              onClick={() => handleSort('assists')}
              className="text-club-gold hover:bg-club-gold/10 p-2"
            >
              Assists {sortField === 'assists' && (
                sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </TouchFeedbackButton>
            <TouchFeedbackButton
              variant="ghost"
              onClick={() => handleSort('match_rating')}
              className="text-club-gold hover:bg-club-gold/10 p-2"
            >
              Rating {sortField === 'match_rating' && (
                sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </TouchFeedbackButton>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Virtualized List */}
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full bg-club-gold/10" />
            ))}
          </div>
        ) : (
          <div className="h-96">
            <List
              height={384}
              itemCount={sortedPlayers.length + (hasNextPage ? 1 : 0)}
              itemSize={80}
              itemData={{
                players: sortedPlayers,
                onPlayerSelect: handlePlayerSelect
              }}
              onItemsRendered={({ visibleStopIndex }) => {
                if (visibleStopIndex >= sortedPlayers.length - 5 && hasNextPage && !isFetchingNextPage) {
                  loadMore();
                }
              }}
            >
              {PlayerRow}
            </List>
          </div>
        )}

        {/* Load More Button */}
        {hasNextPage && (
          <div className="p-4 border-t border-club-gold/10">
            <TouchFeedbackButton
              onClick={loadMore}
              disabled={isFetchingNextPage}
              className="w-full bg-club-gold text-club-black hover:bg-club-gold/90"
            >
              {isFetchingNextPage ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Players'
              )}
            </TouchFeedbackButton>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
