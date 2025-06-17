
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";
import { toast } from "sonner";

export interface ShotData {
  id: number;
  player_id: number;
  match_id: number;
  minute: number;
  period: string;
  outcome: string;
  x_coordinate: number;
  y_coordinate: number;
  distance?: number;
  assisted_by?: string;
  match_name: string;
  date: string;
}

export const useShotsData = (player?: Player | null) => {
  const [shots, setShots] = useState<ShotData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShotsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching shots data');

      let query = supabase
        .from("shots")
        .select('*');

      if (player) {
        query = query.eq('player_id', player.id);
      }

      const { data: shotsData, error: shotsError } = await query;

      if (shotsError) {
        console.error("Error fetching shots:", shotsError);
        throw shotsError;
      }

      const transformedShots: ShotData[] = (shotsData || []).map((shot: any) => ({
        id: shot.id,
        player_id: shot.player_id,
        match_id: shot.match_id,
        minute: shot.minute,
        period: shot.period || 'First Half',
        outcome: shot.outcome || 'Miss',
        x_coordinate: shot.x_coordinate || 0,
        y_coordinate: shot.y_coordinate || 0,
        distance: shot.distance,
        assisted_by: shot.assisted_by,
        match_name: shot.match_name || 'Unknown Match',
        date: shot.date || '',
      }));

      setShots(transformedShots);
      console.log('Shots data:', transformedShots);

    } catch (err: any) {
      console.error("Error fetching shots data:", err);
      setError(err.message);
      toast.error(`Failed to load shots data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [player?.id]);

  useEffect(() => {
    fetchShotsData();
  }, [fetchShotsData]);

  const refetch = useCallback(() => {
    return fetchShotsData();
  }, [fetchShotsData]);

  return { shots, loading, error, refetch };
};
