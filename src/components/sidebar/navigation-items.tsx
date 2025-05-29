
import { 
  LayoutDashboard, 
  UserRound, 
  Users, 
  FileBarChart, 
  Settings 
} from "lucide-react";

interface SubNavigationItem {
  name: string;
  href: string;
  translationKey: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  translationKey: string;
  subItems?: SubNavigationItem[];
}

export const navigationItems: NavigationItem[] = [
  { 
    name: "Dashboard Home", 
    href: "/dashboard", 
    icon: LayoutDashboard,
    translationKey: "nav.dashboard"
  },
  { 
    name: "Player Analysis", 
    href: "/player-analysis", 
    icon: UserRound,
    translationKey: "nav.playerAnalysis",
    subItems: [
      { name: "Individual Player Stats", href: "/player-analysis/stats", translationKey: "nav.individualStats" },
      { name: "Player Comparison", href: "/player-analysis/comparison", translationKey: "nav.playerComparison" },
      { name: "Player Development", href: "/player-analysis/development", translationKey: "nav.playerDevelopment" },
      { name: "Shot Map", href: "/player-analysis/shot-map", translationKey: "nav.shotMap" }
    ]
  },
  { 
    name: "Team Performance", 
    href: "/team-performance", 
    icon: Users,
    translationKey: "nav.teamPerformance",
    subItems: [
      { name: "Team Overview", href: "/team-performance", translationKey: "nav.teamOverview" },
      { name: "Tactical Analysis", href: "/team-performance/tactical-analysis", translationKey: "nav.tacticalAnalysis" }
    ]
  },
  { 
    name: "Reports", 
    href: "/reports", 
    icon: FileBarChart,
    translationKey: "nav.reports"
  },
  { 
    name: "Settings", 
    href: "/settings", 
    icon: Settings,
    translationKey: "nav.settings"
  },
];
