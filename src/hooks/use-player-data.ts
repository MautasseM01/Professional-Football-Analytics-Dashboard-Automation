
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Player } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useRoleAccess } from "@/hooks/use-role-access";
import { toast } from "@/components/ui/sonner";

export const usePlayerData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();
  const { profile } = useUserProfile();
  const { canViewAllPlayers, canViewOwnDataOnly } = useRoleAccess();
  
  const fetchPlayers = async () => {
    setLoading(true);
    try {
      console.log("Fetching data from players table...");
      
      const { data, error: fetchError } = await supabase
        .from("players")
        .select("*");
      
      if (fetchError) {
        throw fetchError;
      }
      
      console.log("Players data received:", data);
      
      if (data && data.length > 0) {
        console.log("First player structure:", data[0]);
        console.log("Player numbers in database:", data.map(p => ({ name: p.name, id: p.id, number: p.number })));
        
        // Apply role-based filtering
        let filteredData = data as Player[];
        
        if (canViewOwnDataOnly()) {
          // Players can only see their own data
          // For demo purposes, we'll show only the first player
          // In a real app, you'd match by user profile or a player_user_id field
          filteredData = data.slice(0, 1) as Player[];
          console.log("Player role: showing only own data");
        } else if (canViewAllPlayers()) {
          // Staff roles can see all players
          filteredData = data as Player[];
          console.log("Staff role: showing all players");
        } else {
          // Unassigned or restricted roles see no players
          filteredData = [];
          console.log("Restricted role: no player access");
        }
        
        setPlayers(filteredData);
        
        // Set the first available player as selected by default
        if (filteredData.length > 0) {
          setSelectedPlayer(filteredData[0] as Player);
        }
      } else {
        console.log("No data found in the players table");
        toast("No player data found in the Supabase players table");
      }
    } catch (error: any) {
      console.error("Error fetching players:", error);
      setError(error.message || "Failed to fetch players");
      uiToast({
        title: "Data Fetch Error",
        description: "Failed to load player data: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Only fetch data if profile is loaded
    if (profile) {
      fetchPlayers();
    }
  }, [profile]);
  
  useEffect(() => {
    if (!profile) return;
    
    // Set up a subscription to player changes
    const playersSubscription = supabase
      .channel('public:players')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'players' 
      }, () => {
        console.log('Players table changed, refreshing data');
        fetchPlayers();
      })
      .subscribe();
    
    return () => {
      playersSubscription.unsubscribe();
    };
  }, [profile]);
  
  const selectPlayer = (id: number) => {
    const player = players.find(p => p.id === id);
    if (player) {
      // Check role-based access
      if (canViewOwnDataOnly() && players.length === 1 && player.id !== players[0].id) {
        uiToast({
          title: "Access Denied",
          description: "You can only view your own player data.",
          variant: "destructive",
        });
        return;
      }
      
      console.log(`Selected player: ${player.name}, Number: ${player.number}`);
      setSelectedPlayer(player);
    }
  };
  
  const canAccessPlayerData = (playerId: number): boolean => {
    if (!profile) return false;
    
    if (canViewAllPlayers()) {
      return true;
    } else if (canViewOwnDataOnly()) {
      // Players can only access their own data
      return players.length === 1 && players[0].id === playerId;
    }
    
    return false;
  };
  
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
