
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
        console.log("Demo login detected, using special flow");
        // For demo user, we'll use a pre-registered account or create one if needed
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email: "coach@smhfoot.fr", 
          password: "password123"
        });
        
        if (error) {
          // If the demo account doesn't exist yet, create it
          if (error.message.includes("Invalid login credentials")) {
            const { error: signUpError } = await supabase.auth.signUp({
              email: "coach@smhfoot.fr",
              password: "password123",
              options: {
                data: {
                  name: "Coach Demo",
                }
              }
            });
            
            if (signUpError) throw signUpError;
            
            // Try signing in again
            const { error: retryError } = await supabase.auth.signInWithPassword({
              email: "coach@smhfoot.fr",
              password: "password123"
            });
            
            if (retryError) throw retryError;
          } else {
            throw error;
          }
        }
        
        toast({
          title: "Demo Login",
          description: "You are now logged in as a demo user",
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
