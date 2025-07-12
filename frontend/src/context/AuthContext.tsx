import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Make sure this path is correct

interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  isPublic: boolean;
  isAdmin: boolean;
  rating: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
   signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // 🔐 Supabase login function
  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      console.error("Login failed:", error?.message);
      return false;
    }

    // Fetch user profile from 'profiles' table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      console.error("Failed to load profile:", profileError?.message);
      return false;
    }

    const fullUser: User = {
      id: data.user.id,
      name: profile.name || '',
      email: data.user.email || '',
      location: profile.location || '',
      profilePhoto: profile.photo_url || '',
      skillsOffered: profile.skills_offered || [],
      skillsWanted: profile.skills_wanted || [],
      availability: profile.availability || [],
      isPublic: profile.is_public ?? true,
      isAdmin: data.user.email === 'admin@skillswap.com',
      rating: 0, // optional: you can calculate avg from feedback if needed
    };

    setUser(fullUser);
    localStorage.setItem('user', JSON.stringify(fullUser));
    return true;
  };
  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    console.error("Signup failed:", error?.message);
    return false;
  }

  // Insert initial profile data into Supabase 'profiles' table
  const { error: insertError } = await supabase.from("profiles").insert({
    id: data.user.id,
    name,
    
    skills_offered: [],
    skills_wanted: [],
    availability: [],
    is_public: true,
    location: '',
    photo_url: '',
  });

  if (insertError) {
    console.error("Profile creation failed:", insertError.message);
    return false;
  }

  return true;
};


  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // optional: also update in Supabase 'profiles' table here
    }
  };

  // 🔁 Load user on refresh (if already logged in)
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profile && !profileError) {
        const fullUser: User = {
          id: data.user.id,
          name: profile.name || '',
          email: data.user.email || '',
          location: profile.location || '',
          profilePhoto: profile.photo_url || '',
          skillsOffered: profile.skills_offered || [],
          skillsWanted: profile.skills_wanted || [],
          availability: profile.availability || [],
          isPublic: profile.is_public ?? true,
          isAdmin: data.user.email === 'admin@skillswap.com',
          rating: 0,
        };
        setUser(fullUser);
      }
    };

    loadUser();
  }, []);

  const value: AuthContextType = {
    user,
    login,
    logout,
    signup,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
