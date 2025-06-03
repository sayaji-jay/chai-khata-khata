import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Record not found
          // Create profile if it doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                name: user?.user_metadata.name || user?.email?.split('@')[0] || '',
                role: 'customer',
                phone: user?.user_metadata.phone || '',
                address: user?.user_metadata.address || ''
              }
            ])
            .select()
            .single();

          if (createError) {
            throw createError;
          }
          setProfile(newProfile);
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive"
      });
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;

      // Refresh profile
      if (user) {
        await fetchProfile(user.id);
      }

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
      console.error('Error updating profile:', error);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      toast({
        title: "Success",
        description: "Logged out successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive"
      });
      console.error('Error during logout:', error);
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    logout,
    updateProfile
  };
};
