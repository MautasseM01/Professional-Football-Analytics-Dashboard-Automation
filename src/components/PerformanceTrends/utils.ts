
// Calculate moving average
export const calculateMovingAverage = (data: Array<{value: number}>, windowSize: number) => {
  return data.map((point, index, array) => {
    if (index < windowSize - 1) return { ...point, movingAvg: null };
    
    let sum = 0;
    for (let i = 0; i < windowSize; i++) {
      sum += array[index - i].value;
    }
    
    return {
      ...point,
      movingAvg: Number((sum / windowSize).toFixed(2))
    };
  });
};

// Calculate performance statistics
export const calculateStats = (data: Array<{value: number}>) => {
  const values = data.map(d => d.value).filter(v => v !== undefined && v !== null);
  if (values.length === 0) return { avg: 0, min: 0, max: 0, trend: 'neutral' as const };
  
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  // Calculate trend (last 3 vs previous 3)
  const recent = values.slice(-3);
  const previous = values.slice(-6, -3);
  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
  const previousAvg = previous.length > 0 ? previous.reduce((sum, val) => sum + val, 0) / previous.length : recentAvg;
  
  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  if (recentAvg > previousAvg * 1.1) trend = 'up';
  else if (recentAvg < previousAvg * 0.9) trend = 'down';
  
  return { avg, min, max, trend };
};

// Format value based on metric type
export const formatValue = (value: number, metric: string) => {
  if (metric === "match_rating") {
    return value.toFixed(1);
  } else if (metric === "distance" || metric === "sprintDistance") {
    return value.toFixed(2);
  }
  return value.toString();
};
