import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, UserRole } from '../types';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false); // Changed to false for instant load
  const { toast } = useToast();

  useEffect(() => {
    // Instantly provide mock user for demo purposes - no delays
    const mockUser: AuthUser = {
      id: 'demo-user-id',
      email: 'demo@example.com',
      user_metadata: {
        name: 'Demo User'
      }
    };

    setUser(mockUser);
    setLoading(false);
    console.log('Demo mode: Instant authentication enabled');

    // Still set up auth state listener for when authentication is re-enabled
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata
          });
        } else {
          // Keep mock user for demo
          setUser(mockUser);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    console.log("Demo mode: Sign in simulated");
    toast({
      title: "Demo Mode",
      description: "Authentication is disabled for demo purposes.",
    });
  };

  const signInWithGoogle = async () => {
    console.log("Demo mode: Google sign in simulated");
    toast({
      title: "Demo Mode",
      description: "Google authentication is disabled for demo purposes.",
    });
  };

  const signOut = async () => {
    console.log("Demo mode: Sign out simulated");
    toast({
      title: "Demo Mode",
      description: "Sign out is disabled for demo purposes.",
    });
  };

  const signUp = async (email: string, password: string) => {
    console.log("Demo mode: Sign up simulated");
    toast({
      title: "Demo Mode",
      description: "Registration is disabled for demo purposes.",
    });
  };

  const value = {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
