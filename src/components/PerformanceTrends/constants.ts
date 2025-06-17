
import { MapPin, Zap, Award, Target, Users, Activity, Focus, BarChart3, Percent, Hand, MousePointer } from "lucide-react";

export const KPI_OPTIONS = [{
  value: "distance_covered",
  label: "Total Distance (km)",
  unit: "km",
  icon: MapPin
}, {
  value: "sprint_distance",
  label: "Sprint Distance (km)",
  unit: "km",
  icon: Zap
}, {
  value: "match_rating",
  label: "Match Rating",
  unit: "/10",
  icon: Award
}, {
  value: "goals",
  label: "Goals",
  unit: "",
  icon: Target
}, {
  value: "assists",
  label: "Assists",
  unit: "",
  icon: Users
}, {
  value: "passes_completed",
  label: "Passes Completed",
  unit: "",
  icon: Activity
}, {
  value: "shots_on_target",
  label: "Shots on Target",
  unit: "",
  icon: Focus
}, {
  value: "tackles_won",
  label: "Tackles Won",
  unit: "",
  icon: BarChart3
}, {
  value: "pass_accuracy",
  label: "Pass Accuracy",
  unit: "%",
  icon: Percent
}, {
  value: "dribbles_successful",
  label: "Successful Dribbles",
  unit: "",
  icon: Hand
}, {
  value: "touches",
  label: "Touches",
  unit: "",
  icon: MousePointer
}, {
  value: "max_speed",
  label: "Max Speed",
  unit: "km/h",
  icon: Zap
}];

export const TIME_PERIOD_OPTIONS = [{
  value: "last3",
  label: "Last 3 Matches"
}, {
  value: "last5",
  label: "Last 5 Matches"
}, {
  value: "last10",
  label: "Last 10 Matches"
}, {
  value: "season",
  label: "Season to Date"
}];

export const CHART_VIEW_OPTIONS = [{
  value: "area",
  label: "Area Chart"
}, {
  value: "line",
  label: "Line Chart"
}, {
  value: "bar",
  label: "Bar Chart"
}];
