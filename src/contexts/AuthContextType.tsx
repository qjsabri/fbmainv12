import React, { createContext } from 'react';

// Mock user type to replace Supabase User
interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

// Mock session type to replace Supabase Session
interface MockSession {
  user: MockUser;
  access_token: string;
}

export interface AuthContextType {
  user: MockUser | null;
  session: MockSession | null;
  loading: boolean;
  signUp: (email: string, _password: string, fullName: string) => Promise<{ error: unknown }>;
  signIn: (email: string, _password: string) => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
