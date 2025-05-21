
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shot, ShotFilters, ShotOutcome } from "@/types/shot";
import { Player } from "@/types";
import { toast } from "@/components/ui/sonner";

export const useShotsData = () => {
  const [shots, setShots] = useState<Shot[]>([]);
  const [filteredShots, setFilteredShots] = useState<Shot[]>([]);
  const [filters, setFilters] = useState<ShotFilters>({});
  const [matches, setMatches] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch shots data
  useEffect(() => {
    const fetchShots = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("shots")
          .select("*, players(name)")
          .order("match_id", { ascending: false })
          .order("minute", { ascending: true });

        if (fetchError) {
          throw new Error(`Error fetching shots data: ${fetchError.message}`);
        }

        // Process the data to include player name from the join and ensure types are correct
        const processedData: Shot[] = data?.map(shot => ({
          id: shot.id,
          player_id: shot.player_id,
          player_name: shot.players?.name || "Unknown Player",
          match_id: shot.match_id,
          match_name: shot.match_name,
          x_coordinate: shot.x_coordinate,
          y_coordinate: shot.y_coordinate,
          minute: shot.minute,
          // Ensure period is cast to the correct type
          period: shot.period as "First Half" | "Second Half" | "Extra Time" | "Penalties",
          outcome: shot.outcome as ShotOutcome,
          assisted_by: shot.assisted_by || undefined,
          distance: shot.distance || undefined,
          date: shot.date
        })) || [];

        setShots(processedData);
        setFilteredShots(processedData);

        // Extract unique matches for the filter
        const uniqueMatches = Array.from(
          new Set(processedData.map(shot => shot.match_id))
        ).map(id => {
          const shot = processedData.find(s => s.match_id === id);
          return {
            id: id as number,
            name: shot?.match_name || `Match ${id}`
          };
        });

        setMatches(uniqueMatches);
      } catch (err: any) {
        console.error("Error in useShotsData:", err);
        setError(err.message);
        toast("Data fetch error", {
          description: `Could not load shots data: ${err.message}`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchShots();
  }, []);

  // Apply filters whenever filters change
  useEffect(() => {
    const applyFilters = () => {
      let result = [...shots];

      if (filters.playerId) {
        result = result.filter(shot => shot.player_id === filters.playerId);
      }

      if (filters.matchId) {
        result = result.filter(shot => shot.match_id === filters.matchId);
      }

      if (filters.period) {
        result = result.filter(shot => shot.period === filters.period);
      }

      if (filters.outcome) {
        result = result.filter(shot => shot.outcome === filters.outcome);
      }

      setFilteredShots(result);
    };

    applyFilters();
  }, [filters, shots]);

  // Update filters
  const updateFilters = (newFilters: Partial<ShotFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({});
  };

  return {
    shots: filteredShots,
    allShots: shots,
    matches,
    filters,
    updateFilters,
    resetFilters,
    loading,
    error
  };
};
