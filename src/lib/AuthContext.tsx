import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { Profile } from './types';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  pendingEmail: string | null;
  pendingPassword: string | null;
  pendingFullName: string | null;
  pendingCourse: string | null;
  signUp: (email: string, password: string, fullName: string, course: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  saveFacePhoto: (photo: string) => Promise<{ error: string | null }>;
  clearPendingSignup: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingPassword, setPendingPassword] = useState<string | null>(null);
  const [pendingFullName, setPendingFullName] = useState<string | null>(null);
  const [pendingCourse, setPendingCourse] = useState<string | null>(null);

  async function fetchProfile(userId: string, email = '') {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    if (!data) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, email })
        .select('*')
        .single();

      if (insertError) {
        console.error('Error creating profile:', insertError);
        return;
      }
      setProfile(newProfile as Profile);
    } else {
      setProfile(data as Profile);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        void fetchProfile(s.user.id, s.user.email ?? '').finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        void fetchProfile(s.user.id, s.user.email ?? '').finally(() => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signUp(email: string, password: string, fullName: string, course: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, email, full_name: fullName, course });
      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    setPendingEmail(email);
    setPendingPassword(password);
    setPendingFullName(fullName);
    setPendingCourse(course);

    return { error: null };
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    setPendingEmail(null);
    setPendingPassword(null);
    setPendingFullName(null);
    setPendingCourse(null);
    return { error: null };
  }

  function clearPendingSignup() {
    setPendingEmail(null);
    setPendingPassword(null);
    setPendingFullName(null);
    setPendingCourse(null);
  }

  async function saveFacePhoto(photo: string) {
    if (!user) return { error: 'Not signed in' };
    const { error } = await supabase
      .from('profiles')
      .update({ face_photo: photo })
      .eq('id', user.id);
    if (error) return { error: 'Could not save your photo.' };
    await refreshProfile();
    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
    clearPendingSignup();
  }

  async function refreshProfile() {
    if (user) {
      await fetchProfile(user.id, user.email ?? '');
    }
  }

  return (
    <AuthContext.Provider value={{
      user, session, profile, loading,
      pendingEmail, pendingPassword, pendingFullName, pendingCourse,
      signUp, signIn, signOut, refreshProfile, saveFacePhoto, clearPendingSignup,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
