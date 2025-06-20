
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  FileText, 
  Settings, 
  Home,
  UserCheck,
  Target,
  Activity,
  Map,
  Zap,
  Shield,
  Upload
} from "lucide-react";
import { UserRole } from "@/types";

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current: boolean;
  allowedRoles: UserRole[];
  subItems?: {
    name: string;
    href: string;
    allowedRoles: UserRole[];
  }[];
}

export const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    current: false,
    allowedRoles: ['player', 'coach', 'analyst', 'performance_director', 'management', 'admin'],
  },
  {
    name: 'Player Analysis',
    href: '/player-analysis',
    icon: UserCheck,
    current: false,
    allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
    subItems: [
      {
        name: 'Player Stats',
        href: '/player-analysis/stats',
        allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
      },
      {
        name: 'Player Comparison',
        href: '/player-analysis/comparison',
        allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
      },
      {
        name: 'Player Development',
        href: '/player-analysis/development',
        allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
      },
      {
        name: 'Shot Map',
        href: '/player-analysis/shot-map',
        allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
      },
      {
        name: 'Goals & Assists',
        href: '/player-analysis/goals-assists',
        allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
      },
    ],
  },
  {
    name: 'Team Performance',
    href: '/team-performance',
    icon: Users,
    current: false,
    allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
    subItems: [
      {
        name: 'Team Overview',
        href: '/team-performance/overview',
        allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
      },
      {
        name: 'Tactical Analysis',
        href: '/team-performance/tactical-analysis',
        allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
      },
    ],
  },
  {
    name: 'Match Data Import',
    href: '/match-data-import',
    icon: Upload,
    current: false,
    allowedRoles: ['coach', 'analyst', 'management', 'admin'],
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    current: false,
    allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    current: false,
    allowedRoles: ['player', 'coach', 'analyst', 'performance_director', 'management', 'admin'],
  },
];
