
import { useUserProfile } from "@/hooks/use-user-profile";

export const useAuth = () => {
  const { profile, user, isLoading } = useUserProfile();

  return {
    user,
    profile,
    isLoading
  };
};
