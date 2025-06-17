
import { PlayerMatchPerformance } from "@/hooks/use-player-match-performance";
import { KPI_OPTIONS } from "./constants";

export const processChartData = (performances: PlayerMatchPerformance[] | undefined, selectedKPI: string) => {
  if (!performances || performances.length === 0) return [];
  
  return performances.map((perf, index) => {
    let value = 0;
    switch (selectedKPI) {
      case "distance_covered":
        value = Number(perf.distance_covered) || 0;
        break;
      case "sprint_distance":
        value = Number(perf.sprint_distance) || 0;
        break;
      case "match_rating":
        value = Number(perf.match_rating) || 0;
        break;
      case "goals":
        value = perf.goals || 0;
        break;
      case "assists":
        value = perf.assists || 0;
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
      case "dribbles_successful":
        value = perf.dribbles_successful || 0;
        break;
      case "touches":
        value = perf.touches || 0;
        break;
      case "max_speed":
        value = Number(perf.max_speed) || 0;
        break;
      default:
        value = 0;
    }

    // Calculate moving average
    let movingAvg = null;
    if (index >= 2) {
      const last3Values = performances.slice(Math.max(0, index - 2), index + 1).map(p => {
        switch (selectedKPI) {
          case "distance_covered":
            return Number(p.distance_covered) || 0;
          case "sprint_distance":
            return Number(p.sprint_distance) || 0;
          case "match_rating":
            return Number(p.match_rating) || 0;
          case "goals":
            return p.goals || 0;
          case "assists":
            return p.assists || 0;
          case "passes_completed":
            return p.passes_completed || 0;
          case "shots_on_target":
            return p.shots_on_target || 0;
          case "tackles_won":
            return p.tackles_won || 0;
          case "pass_accuracy":
            return Number(p.pass_accuracy) || 0;
          case "dribbles_successful":
            return p.dribbles_successful || 0;
          case "touches":
            return p.touches || 0;
          case "max_speed":
            return Number(p.max_speed) || 0;
          default:
            return 0;
        }
      });
      movingAvg = last3Values.reduce((sum, val) => sum + val, 0) / last3Values.length;
    }

    return {
      match: `vs ${perf.opponent}`,
      date: new Date(perf.match_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      value: selectedKPI.includes("distance") || selectedKPI === "max_speed" 
        ? Number(value.toFixed(2)) 
        : Number(value.toFixed(1)),
      movingAvg: movingAvg 
        ? (selectedKPI.includes("distance") || selectedKPI === "max_speed" 
            ? Number(movingAvg.toFixed(2)) 
            : Number(movingAvg.toFixed(1))) 
        : null,
      opponent: perf.opponent,
      result: perf.result
    };
  }).reverse(); // Show chronological order
};

export const calculateStats = (chartData: any[], selectedKPI: string) => {
  if (chartData.length === 0) return {
    avg: 0,
    max: 0,
    min: 0,
    trend: 'neutral' as const
  };

  const values = chartData.map(d => d.value);
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);

  // Calculate trend (last 3 vs previous 3)
  const recent = values.slice(-3);
  const previous = values.slice(-6, -3);
  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
  const previousAvg = previous.length > 0 
    ? previous.reduce((sum, val) => sum + val, 0) / previous.length 
    : recentAvg;
  
  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  if (recentAvg > previousAvg * 1.1) trend = 'up';
  else if (recentAvg < previousAvg * 0.9) trend = 'down';

  return {
    avg: selectedKPI.includes("distance") || selectedKPI === "max_speed" 
      ? Number(avg.toFixed(2)) 
      : Number(avg.toFixed(1)),
    max: selectedKPI.includes("distance") || selectedKPI === "max_speed" 
      ? Number(max.toFixed(2)) 
      : Number(max.toFixed(1)),
    min: selectedKPI.includes("distance") || selectedKPI === "max_speed" 
      ? Number(min.toFixed(2)) 
      : Number(min.toFixed(1)),
    trend
  };
};

export const formatValue = (value: number, selectedKPI: string): string => {
  const kpiOption = KPI_OPTIONS.find(option => option.value === selectedKPI);
  const unit = kpiOption?.unit || "";
  
  if (selectedKPI.includes("distance") || selectedKPI === "max_speed") {
    return `${value.toFixed(2)}${unit}`;
  }
  return `${value.toFixed(1)}${unit}`;
};
