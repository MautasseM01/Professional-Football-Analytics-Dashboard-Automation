
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";
import { toast } from "sonner";

export interface PlayerAttributes {
  id: number;
  player_id: number;
  // Physical attributes
  pace: number;
  speed: number;
  acceleration: number;
  agility: number;
  strength: number;
  stamina: number;
  jumping: number;
  // Technical attributes
  finishing: number;
  ball_control: number;
  dribbling: number;
  crossing: number;
  passing: number;
  heading: number;
  // Mental attributes
  vision: number;
  positioning: number;
  decision_making: number;
  mental_strength: number;
  leadership: number;
  communication: number;
  // Defensive attributes
  tackling: number;
  marking: number;
  // Work rates and other
  work_rate_attacking: number;
  work_rate_defensive: number;
  preferred_foot: string;
  weak_foot_rating: number;
  skill_moves_rating: number;
  // Additional attributes
  aerial_duels_won: number;
  holdup_play: number;
}

export const usePlayerAttributes = (player?: Player | null) => {
  const [attributes, setAttributes] = useState<PlayerAttributes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerAttributes = useCallback(async () => {
    if (!player) {
      setAttributes(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching player attributes for player:', player.id);

      const { data: attributesData, error: attributesError } = await supabase
        .from("player_attributes")
        .select('*')
        .eq('player_id', player.id)
        .maybeSingle();

      if (attributesError) {
        console.error("Error fetching player attributes:", attributesError);
        throw attributesError;
      }

      if (!attributesData) {
        console.warn("No attributes found for player:", player.id);
        setAttributes(null);
        return;
      }

      const transformedAttributes: PlayerAttributes = {
        id: attributesData.id,
        player_id: attributesData.player_id,
        // Physical attributes
        pace: attributesData.pace || 50,
        speed: attributesData.speed || 50,
        acceleration: attributesData.acceleration || 50,
        agility: attributesData.agility || 50,
        strength: attributesData.strength || 50,
        stamina: attributesData.stamina || 50,
        jumping: attributesData.jumping || 50,
        // Technical attributes
        finishing: attributesData.finishing || 50,
        ball_control: attributesData.ball_control || 50,
        dribbling: attributesData.dribbling || 50,
        crossing: attributesData.crossing || 50,
        passing: attributesData.passing || 50,
        heading: attributesData.heading || 50,
        // Mental attributes
        vision: attributesData.vision || 50,
        positioning: attributesData.positioning || 50,
        decision_making: attributesData.decision_making || 50,
        mental_strength: attributesData.mental_strength || 50,
        leadership: attributesData.leadership || 50,
        communication: attributesData.communication || 50,
        // Defensive attributes
        tackling: attributesData.tackling || 50,
        marking: attributesData.marking || 50,
        // Work rates and other
        work_rate_attacking: attributesData.work_rate_attacking || 50,
        work_rate_defensive: attributesData.work_rate_defensive || 50,
        preferred_foot: attributesData.preferred_foot || 'Right',
        weak_foot_rating: attributesData.weak_foot_rating || 3,
        skill_moves_rating: attributesData.skill_moves_rating || 3,
        // Additional attributes
        aerial_duels_won: attributesData.aerial_duels_won || 50,
        holdup_play: attributesData.holdup_play || 50,
      };

      setAttributes(transformedAttributes);
      console.log('Player attributes:', transformedAttributes);

    } catch (err: any) {
      console.error("Error fetching player attributes:", err);
      setError(err.message);
      toast.error(`Failed to load player attributes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [player?.id]);

  useEffect(() => {
    fetchPlayerAttributes();
  }, [fetchPlayerAttributes]);

  const refetch = useCallback(() => {
    return fetchPlayerAttributes();
  }, [fetchPlayerAttributes]);

  return { attributes, loading, error, refetch };
};
