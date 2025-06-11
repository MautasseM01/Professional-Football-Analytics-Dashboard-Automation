
import React, { createContext, useState, useEffect, useContext } from 'react';
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
  // Mock user for demo purposes
  const mockUser: AuthUser = {
    id: 'demo-user',
    email: 'demo@example.com',
    user_metadata: {
      name: 'Demo User'
    }
  };

  const [user] = useState<AuthUser | null>(mockUser);
  const [loading] = useState(false);
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    toast({
      title: "Demo Mode",
      description: "Authentication is disabled for demo purposes.",
    });
  };

  const signInWithGoogle = async () => {
    toast({
      title: "Demo Mode",
      description: "Authentication is disabled for demo purposes.",
    });
  };

  const signOut = async () => {
    toast({
      title: "Demo Mode",
      description: "Authentication is disabled for demo purposes.",
    });
  };

  const signUp = async (email: string, password: string) => {
    toast({
      title: "Demo Mode",
      description: "Authentication is disabled for demo purposes.",
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
