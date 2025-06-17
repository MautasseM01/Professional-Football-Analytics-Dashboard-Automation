
// Enhanced KPI options with club gold theming - now includes all 8 metrics
export const KPI_OPTIONS = [
  { value: "distance", label: "Total Distance (km)", color: "#D4AF37", shortLabel: "Distance" },
  { value: "sprintDistance", label: "Sprint Distance (km)", color: "#D4AF37", shortLabel: "Sprint" },
  { value: "passes_completed", label: "Passes Completed", color: "#D4AF37", shortLabel: "Passes" },
  { value: "shots_on_target", label: "Shots on Target", color: "#D4AF37", shortLabel: "Shots" },
  { value: "tackles_won", label: "Tackles Won", color: "#D4AF37", shortLabel: "Tackles" },
  { value: "goals", label: "Goals", color: "#D4AF37", shortLabel: "Goals" },
  { value: "assists", label: "Assists", color: "#D4AF37", shortLabel: "Assists" },
  { value: "match_rating", label: "Match Rating", color: "#D4AF37", shortLabel: "Rating" }
];

// Enhanced time period options
export const TIME_PERIOD_OPTIONS = [
  { value: "last3", label: "Last 3 Matches", shortLabel: "3M" },
  { value: "last5", label: "Last 5 Matches", shortLabel: "5M" },
  { value: "last10", label: "Last 10 Matches", shortLabel: "10M" },
  { value: "season", label: "Season to Date", shortLabel: "Season" }
];

// Chart view options
export const CHART_VIEW_OPTIONS = [
  { value: "line", label: "Line Chart" },
  { value: "area", label: "Area Chart" }
];
