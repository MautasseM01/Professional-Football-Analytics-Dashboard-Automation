
import { useUserProfile } from "@/hooks/use-user-profile";

export const useAuth = () => {
  const { profile, loading, error } = useUserProfile();

  return {
    user: profile ? {
      id: profile.id,
      email: profile.email,
      user_metadata: {
        name: profile.full_name
      }
    } : null,
    profile,
    isLoading: loading
  };
};
