
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Player } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { useSafeAsync } from "@/hooks/use-safe-async";

export const usePlayerData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { profile } = useUserProfile();
  const { handleError } = useErrorHandler({ component: 'usePlayerData' });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  const fetchPlayersAsync = useCallback(async () => {
    // Allow fetching players even if profile is not loaded yet in demo mode
    // This is essential for the demo mode functionality
    try {
      const { data, error: fetchError } = await supabase
        .from("players")
        .select("*");
      
      if (fetchError) {
        throw new Error(`Failed to fetch players: ${fetchError.message}`);
      }
      
      if (!data || data.length === 0) {
        throw new Error('No player data found');
      }
      
      // Apply role-based filtering only if profile is available
      let filteredData = data as Player[];
      
      if (profile?.role === 'player') {
        // Players can only see their own data
        filteredData = data.slice(0, 1) as Player[];
      }
      
      return { players: filteredData, selectedPlayer: filteredData[0] || null };
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Unknown error'), 'high');
      throw error;
    }
  }, [profile, handleError]);

  const { data, loading, error: asyncError, retry } = useSafeAsync(
    fetchPlayersAsync,
    [], // Remove profile dependency to allow loading without profile
    { component: 'usePlayerData' }
  );

  useEffect(() => {
    if (data && mountedRef.current) {
      setPlayers(data.players);
      if (data.selectedPlayer) {
        setSelectedPlayer(data.selectedPlayer);
      }
    }
  }, [data]);

  useEffect(() => {
    if (asyncError) {
      setError(asyncError.message);
    } else {
      setError(null);
    }
  }, [asyncError]);
  
  useEffect(() => {
    // Set up subscription regardless of profile status
    const playersSubscription = supabase
      .channel('public:players')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'players' 
      }, () => {
        if (mountedRef.current) {
          retry();
        }
      })
      .subscribe();
    
    return () => {
      playersSubscription.unsubscribe();
    };
  }, [retry]); // Remove profile dependency
  
  const selectPlayer = useCallback((id: number) => {
    const player = players.find(p => p.id === id);
    if (player) {
      // Check role-based access only if profile is available
      if (profile?.role === 'player' && players.length === 1 && player.id !== players[0].id) {
        toast({
          title: "Access Denied",
          description: "You can only view your own player data.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedPlayer(player);
    }
  }, [players, profile, toast]);
  
  const canAccessPlayerData = useCallback((playerId: number): boolean => {
    if (!profile) return true; // Allow access in demo mode when profile is loading
    
    switch (profile.role) {
      case 'admin':
      case 'management':
      case 'coach':
      case 'analyst':
      case 'performance_director':
        return true;
      case 'player':
        return players.length === 1 && players[0]?.id === playerId;
      default:
        return true; // Default to allowing access in demo mode
    }
  }, [profile, players]);
  
  return {
    players,
    selectedPlayer,
    selectPlayer,
    loading,
    error,
    refreshData: retry,
    canAccessPlayerData
  };
};
