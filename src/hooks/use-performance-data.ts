
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";
import { toast } from "sonner";

export interface PerformanceDataPoint {
  match: string;
  date: string;
  value: number;
  matchId?: number;
}

export const usePerformanceData = (player: Player | null, metric: string, timePeriod: string) => {
  const [data, setData] = useState<PerformanceDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!player) {
        setData([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching ${metric} data for player ${player.name} (ID: ${player.id})`);

        // Determine the number of matches to fetch based on time period
        const getMatchLimit = () => {
          switch (timePeriod) {
            case "last3": return 3;
            case "last5": return 5;
            case "last10": return 10;
            case "last15": return 15;
            case "season": return 25;
            case "home": return 15;
            case "away": return 15;
            default: return 5;
          }
        };

        const matchLimit = getMatchLimit();

        // Fetch performance data from player_match_performance table
        const { data: performanceData, error: perfError } = await supabase
          .from("player_match_performance")
          .select('*')
          .eq('player_id', player.id)
          .limit(matchLimit);

        if (perfError) {
          console.error("Error fetching performance data:", perfError);
          throw perfError;
        }

        if (!performanceData || performanceData.length === 0) {
          console.warn("No performance data found for player");
          setData([]);
          return;
        }

        // Fetch match details separately
        const matchIds = performanceData.map(p => p.match_id);
        const { data: matchesData, error: matchesError } = await supabase
          .from("matches")
          .select('id, date, opponent, location')
          .in('id', matchIds)
          .order('date', { ascending: false });

        if (matchesError) {
          console.error("Error fetching matches data:", matchesError);
          throw matchesError;
        }

        // Transform the data based on the requested metric
        const transformedData: PerformanceDataPoint[] = performanceData
          .map((perf: any) => {
            const match = matchesData?.find(m => m.id === perf.match_id);
            if (!match) return null;

            let value = 0;

            switch (metric) {
              case "goals":
                value = perf.goals || 0;
                break;
              case "assists":
                value = perf.assists || 0;
                break;
              case "match_rating":
                value = Number(perf.match_rating) || 0;
                break;
              case "distance":
              case "distance_covered":
                value = Number(perf.distance_covered) || 0;
                break;
              case "sprintDistance":
                value = Number(perf.sprint_distance) || 0;
                break;
              case "passes_completed":
                value = perf.passes_completed || 0;
                break;
              case "shots_on_target":
                value = perf.shots_on_target || 0;
                break;
              case "tackles_won":
                value = perf.tackles_won || 0;
                break;
              case "pass_accuracy":
                value = Number(perf.pass_accuracy) || 0;
                break;
              case "touches":
                value = perf.touches || 0;
                break;
              case "possession_won":
                value = perf.possession_won || 0;
                break;
              case "possession_lost":
                value = perf.possession_lost || 0;
                break;
              case "dribbles_successful":
                value = perf.dribbles_successful || 0;
                break;
              default:
                value = 0;
            }

            // Round value appropriately
            let roundedValue: number;
            if (metric === "distance" || metric === "distance_covered" || metric === "sprintDistance") {
              roundedValue = Number(value.toFixed(2));
            } else if (metric === "match_rating" || metric === "pass_accuracy") {
              roundedValue = Number(value.toFixed(1));
            } else {
              roundedValue = Math.round(value);
            }

            return {
              match: `vs ${match.opponent}`,
              date: new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              value: roundedValue,
              matchId: match.id
            };
          })
          .filter(item => item !== null)
          .sort((a, b) => {
            const matchA = matchesData?.find(m => m.id === a?.matchId);
            const matchB = matchesData?.find(m => m.id === b?.matchId);
            return new Date(matchA?.date || 0).getTime() - new Date(matchB?.date || 0).getTime();
          }) as PerformanceDataPoint[];

        console.log(`Performance data for ${metric}:`, transformedData);
        setData(transformedData);

      } catch (err: any) {
        console.error("Error fetching performance data:", err);
        setError(err.message);
        toast.error(`Failed to load ${metric} data: ${err.message}`);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [player?.id, metric, timePeriod]);

  return { data, loading, error };
};
