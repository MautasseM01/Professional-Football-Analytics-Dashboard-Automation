
import { useState } from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { UserRole } from '@/types';

const ROLES = [
  { value: 'admin', label: 'Admin', color: 'bg-red-500' },
  { value: 'management', label: 'Management', color: 'bg-purple-500' },
  { value: 'performance_director', label: 'Performance Director', color: 'bg-green-500' },
  { value: 'coach', label: 'Coach', color: 'bg-blue-500' },
  { value: 'analyst', label: 'Analyst', color: 'bg-cyan-500' },
  { value: 'player', label: 'Player', color: 'bg-yellow-500' },
  { value: 'unassigned', label: 'Unassigned', color: 'bg-gray-500' },
];

export const RoleTester = () => {
  const { profile, updateRole } = useUserProfile();
  const [isUpdating, setIsUpdating] = useState(false);

  const getCurrentRoleInfo = () => {
    return ROLES.find(role => role.value === profile?.role) || ROLES[6]; // Default to unassigned
  };

  const handleRoleChange = async (newRole: string) => {
    setIsUpdating(true);
    try {
      updateRole(newRole as UserRole);
      
      toast({
        title: "Role Updated",
        description: `Role changed to ${newRole}. Dashboard will update automatically.`,
      });

      // Small delay for visual feedback
      setTimeout(() => {
        setIsUpdating(false);
      }, 500);

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
    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-300 dark:border-orange-600/30 rounded-lg shadow-sm">
      {/* TEST MODE Warning - more prominent */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-200 dark:bg-yellow-800 border border-yellow-400 dark:border-yellow-600 rounded-md text-sm font-bold text-yellow-800 dark:text-yellow-200">
        <AlertTriangle size={16} />
        DEMO MODE - ROLE TESTING
      </div>

      {/* Current Role Badge - larger */}
      <Badge 
        className={`${currentRole.color} text-white text-sm px-3 py-1`}
        variant="default"
      >
        Current: {currentRole.label}
      </Badge>

      {/* Role Selector - more prominent */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Switch Role:</span>
        <Select 
          value={profile.role || 'admin'} 
          onValueChange={handleRoleChange}
          disabled={isUpdating}
        >
          <SelectTrigger className="w-48 h-9 text-sm border-orange-300 dark:border-orange-600 bg-white dark:bg-gray-800">
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
      </div>

      {/* Loading Indicator */}
      {isUpdating && (
        <RefreshCw size={16} className="animate-spin text-orange-600 dark:text-orange-400" />
      )}

      {/* Help text */}
      <div className="text-xs text-gray-600 dark:text-gray-400 ml-auto">
        Switch roles to see different dashboard views
      </div>
    </div>
  );
};
