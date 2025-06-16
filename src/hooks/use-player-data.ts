
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/use-user-profile";

export const usePlayerData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useUserProfile();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  const fetchPlayers = useCallback(async () => {
    if (!profile) {
      setError('User profile not loaded');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching enhanced player data from database');
      
      const { data, error: fetchError } = await supabase
        .from("players")
        .select(`
          id,
          name,
          position,
          number,
          matches,
          goals,
          assists,
          shots_total,
          shots_on_target,
          passes_attempted,
          passes_completed,
          pass_accuracy,
          tackles_attempted,
          tackles_won,
          distance,
          sprintDistance,
          maxSpeed,
          match_rating,
          minutes_played,
          last_match_date,
          heatmapUrl,
          reportUrl,
          season,
          created_at,
          updated_at
        `)
        .order('name');
      
      if (fetchError) {
        console.error('Error fetching players:', fetchError);
        throw new Error(`Failed to fetch players: ${fetchError.message}`);
      }
      
      if (!data || data.length === 0) {
        console.warn('No players found in database');
        setPlayers([]);
        setSelectedPlayer(null);
        return;
      }
      
      // Transform the data to match our Player interface
      const transformedPlayers: Player[] = data.map(player => ({
        id: player.id,
        name: player.name || 'Unknown Player',
        position: player.position || 'N/A',
        number: player.number || undefined,
        matches: Number(player.matches) || 0,
        distance: Number(player.distance) || 0,
        passes_attempted: Number(player.passes_attempted) || 0,
        passes_completed: Number(player.passes_completed) || 0,
        shots_total: Number(player.shots_total) || 0,
        shots_on_target: Number(player.shots_on_target) || 0,
        tackles_attempted: Number(player.tackles_attempted) || 0,
        tackles_won: Number(player.tackles_won) || 0,
        heatmapUrl: player.heatmapUrl || '',
        reportUrl: player.reportUrl || '',
        maxSpeed: Number(player.maxSpeed) || 0,
        sprintDistance: Number(player.sprintDistance) || 0,
      }));
      
      // Apply role-based filtering
      let filteredPlayers = transformedPlayers;
      
      if (profile.role === 'player') {
        // Players can only see their own data
        filteredPlayers = transformedPlayers.slice(0, 1);
      }
      
      if (mountedRef.current) {
        setPlayers(filteredPlayers);
        if (filteredPlayers.length > 0 && !selectedPlayer) {
          setSelectedPlayer(filteredPlayers[0]);
        }
      }

    } catch (err: any) {
      console.error('Error in usePlayerData:', err);
      if (mountedRef.current) {
        setError(err.message);
        toast.error(`Failed to load player data: ${err.message}`);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [profile, selectedPlayer]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);
  
  useEffect(() => {
    if (!profile) return;
    
    const playersSubscription = supabase
      .channel('public:players')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'players' 
      }, () => {
        if (mountedRef.current) {
          fetchPlayers();
        }
      })
      .subscribe();
    
    return () => {
      playersSubscription.unsubscribe();
    };
  }, [profile, fetchPlayers]);
  
  const selectPlayer = useCallback((id: number) => {
    const player = players.find(p => p.id === id);
    if (player) {
      // Check role-based access
      if (profile?.role === 'player' && players.length === 1 && player.id !== players[0].id) {
        toast.error("Access Denied: You can only view your own player data.");
        return;
      }
      
      setSelectedPlayer(player);
    }
  }, [players, profile]);
  
  const canAccessPlayerData = useCallback((playerId: number): boolean => {
    if (!profile) return false;
    
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
        return false;
    }
  }, [profile, players]);
  
  return {
    players,
    selectedPlayer,
    selectPlayer,
    loading,
    error,
    refreshData: fetchPlayers,
    canAccessPlayerData
  };
};
