
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/use-user-profile';
import { supabase } from '@/integrations/supabase/client';
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
    return ROLES.find(role => role.value === profile?.role) || ROLES[6]; // Default to unassigned
  };

  const handleRoleChange = async (newRole: string) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "No user found",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Role Updated",
        description: `Role changed to ${newRole}`,
      });

      // Refresh the page to update the dashboard view
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update role",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!profile) {
    return null;
  }

  const currentRole = getCurrentRoleInfo();

  return (
    <div className="flex items-center gap-2 p-2 bg-orange-100 border border-orange-300 rounded-lg">
      {/* TEST MODE Warning */}
      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-200 border border-yellow-400 rounded text-xs font-bold text-yellow-800">
        <AlertTriangle size={12} />
        TEST MODE
      </div>

      {/* Current Role Badge */}
      <Badge 
        className={`${currentRole.color} text-white text-xs`}
        variant="default"
      >
        {currentRole.label}
      </Badge>

      {/* Role Selector */}
      <Select 
        value={profile.role || 'unassigned'} 
        onValueChange={handleRoleChange}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-36 h-8 text-xs border-orange-300 bg-white">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((role) => (
            <SelectItem key={role.value} value={role.value} className="text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${role.color}`} />
                {role.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Loading Indicator */}
      {isUpdating && (
        <RefreshCw size={14} className="animate-spin text-orange-600" />
      )}
    </div>
  );
};
