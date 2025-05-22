
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
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  subItems?: SubNavigationItem[];
}

export const navigationItems: NavigationItem[] = [
  { 
    name: "Dashboard Home", 
    href: "/dashboard", 
    icon: LayoutDashboard
  },
  { 
    name: "Player Analysis", 
    href: "/player-analysis", 
    icon: UserRound,
    subItems: [
      { name: "Individual Player Stats", href: "/player-analysis/stats" },
      { name: "Player Comparison", href: "/player-analysis/comparison" },
      { name: "Player Development", href: "/player-analysis/development" },
      { name: "Shot Map", href: "/player-analysis/shot-map" }
    ]
  },
  { 
    name: "Team Performance", 
    href: "/team-performance", 
    icon: Users,
    subItems: [
      { name: "Team Overview", href: "/team-performance" },
      { name: "Tactical Analysis", href: "/team-performance/tactical-analysis" }
    ]
  },
  { 
    name: "Reports", 
    href: "/reports", 
    icon: FileBarChart
  },
  { 
    name: "Settings", 
    href: "/settings", 
    icon: Settings
  },
];
