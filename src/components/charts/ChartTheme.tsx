
import { ChartConfig } from "@/components/ui/chart";

export const clubChartTheme: ChartConfig = {
  primary: {
    label: "Primary",
    color: "#D4AF37", // Club gold
  },
  secondary: {
    label: "Secondary",
    color: "#F5F5F5", // Club light gray
  },
  accent: {
    label: "Accent",
    color: "#1A1A1A", // Club dark gray
  },
  success: {
    label: "Success",
    color: "#22C55E", // Green
  },
  warning: {
    label: "Warning",
    color: "#F59E0B", // Orange
  },
  danger: {
    label: "Danger",
    color: "#EF4444", // Red
  },
  info: {
    label: "Info",
    color: "#3B82F6", // Blue
  },
};

export const chartAxisConfig = {
  axisLine: { stroke: 'rgba(212, 175, 55, 0.2)' },
  tickLine: { stroke: 'rgba(212, 175, 55, 0.2)' },
  tick: { fontSize: 12, fill: '#F5F5F5' },
  grid: { strokeDasharray: '3 3', stroke: 'rgba(212, 175, 55, 0.1)' },
};

export const chartTooltipConfig = {
  contentStyle: {
    backgroundColor: 'rgba(13, 13, 13, 0.95)',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '8px',
    color: '#F5F5F5',
    backdropFilter: 'blur(8px)',
  },
  labelStyle: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
};

export const chartAnimationConfig = {
  animationBegin: 0,
  animationDuration: 800,
  animationEasing: 'ease-out',
};
