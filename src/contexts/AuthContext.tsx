
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthUser } from '../types';
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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we're in demo mode first
    if (localStorage.getItem("demoMode") === "true") {
      // If in demo mode, set the demo user
      setUser({
        id: "demo-user-id",
        email: "coach@smhfoot.fr",
        user_metadata: {
          name: "Coach Demo"
        }
      });
      setLoading(false);
      return;
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata
        });
      }
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching user session:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to fetch user session.",
        variant: "destructive",
      });
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      // Special case for demo user
      if (email === "coach@smhfoot.fr" && password === "password123") {
        console.log("Demo login detected, bypassing normal flow");
        
        // Demo mode - create a fake session
        setUser({
          id: "demo-user-id",
          email: "coach@smhfoot.fr",
          user_metadata: {
            name: "Coach Demo"
          }
        });
        
        // Store a marker in localStorage to remember we're in demo mode
        localStorage.setItem("demoMode", "true");
        
        toast({
          title: "Demo Login",
          description: "You are now logged in as a demo coach user",
        });
        return;
      }
      
      // Regular sign in for non-demo users
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: "Success!",
        description: "You have been logged in.",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during sign in.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message || "An error occurred during sign in with Google.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Check if we're in demo mode
      if (localStorage.getItem("demoMode") === "true") {
        // Just clear the demo mode and reset user state
        localStorage.removeItem("demoMode");
        setUser(null);
        
        toast({
          title: "Logged out",
          description: "You have been logged out from demo mode.",
        });
        return;
      }
      
      // Regular logout for non-demo users
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log("Signing up with:", email);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during sign up.",
        variant: "destructive",
      });
      throw error;
    }
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
