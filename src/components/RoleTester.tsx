
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile, changeDemoRole } from '@/hooks/use-user-profile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, RefreshCw, Eye } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ROLES = [
  { value: 'admin', label: 'Admin', color: 'bg-red-500' },
  { value: 'management', label: 'Management', color: 'bg-purple-500' },
  { value: 'coach', label: 'Coach', color: 'bg-blue-500' },
  { value: 'performance_director', label: 'Performance Director', color: 'bg-green-500' },
  { value: 'analyst', label: 'Analyst', color: 'bg-cyan-500' },
  { value: 'player', label: 'Player', color: 'bg-yellow-500' },
  { value: 'unassigned', label: 'Unassigned', color: 'bg-gray-500' },
];

export const RoleTester = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [isUpdating, setIsUpdating] = useState(false);

  const getCurrentRoleInfo = () => {
    return ROLES.find(role => role.value === profile?.role) || ROLES[0]; // Default to admin
  };

  const handleRoleChange = async (newRole: string) => {
    if (!user?.id) {
      toast({
        title: "Demo Mode",
        description: "Role switching enabled for demonstration",
      });
    }

    setIsUpdating(true);
    try {
      // Use demo role change function
      changeDemoRole(newRole as any);

      toast({
        title: "Role Changed",
        description: `Now viewing as ${newRole}`,
      });

      // Brief delay to show loading state
      setTimeout(() => {
        setIsUpdating(false);
      }, 300);

    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update role",
        variant: "destructive",
      });
      setIsUpdating(false);
    }
  };

  if (!profile) {
    return null;
  }

  const currentRole = getCurrentRoleInfo();

  return (
    <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm">
      {/* DEMO MODE Warning */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md text-sm font-bold shadow-sm">
        <Eye size={14} />
        DEMO MODE
      </div>

      {/* Current Role Badge */}
      <Badge 
        className={`${currentRole.color} text-white text-sm px-3 py-1 shadow-sm`}
        variant="default"
      >
        {currentRole.label}
      </Badge>

      {/* Role Selector */}
      <Select 
        value={profile.role || 'admin'} 
        onValueChange={handleRoleChange}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-44 h-9 text-sm border-blue-300 dark:border-blue-600 bg-white dark:bg-slate-800 shadow-sm">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((role) => (
            <SelectItem key={role.value} value={role.value} className="text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${role.color}`} />
                {role.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Loading Indicator */}
      {isUpdating && (
        <RefreshCw size={16} className="animate-spin text-blue-600 dark:text-blue-400" />
      )}

      {/* Info text */}
      <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
        Switch roles to see different dashboard views
      </span>
    </div>
  );
};
