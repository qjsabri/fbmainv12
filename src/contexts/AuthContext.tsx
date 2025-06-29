import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AuthContext, type MockUser, type MockSession } from './AuthContextType';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<MockSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedSession = localStorage.getItem('mock_session');
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        setSession(parsedSession);
        setUser(parsedSession.user);
      } catch (_error) {
        console.error('Error parsing saved session:', error);
        localStorage.removeItem('mock_session');
      }
    } else {
      // Auto-login with a default user for demo purposes
      const defaultUser: MockUser = {
        id: 'demo_user_123',
        email: 'demo@facebook.com',
        user_metadata: {
          full_name: 'John Doe',
          avatar_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=400&h=400&fit=crop&crop=face'
        }
      };

      const defaultSession: MockSession = {
        user: defaultUser,
        access_token: 'demo_token_123'
      };

      localStorage.setItem('mock_session', JSON.stringify(defaultSession));
      setUser(defaultUser);
      setSession(defaultSession);
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, _password: string, fullName: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user
      const mockUser: MockUser = {
        id: `user_${Date.now()}`,
        email,
        user_metadata: {
          full_name: fullName,
          avatar_url: `https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=400&h=400&fit=crop&crop=face`
        }
      };

      const mockSession: MockSession = {
        user: mockUser,
        access_token: `mock_token_${Date.now()}`
      };

      // Save to localStorage
      localStorage.setItem('mock_session', JSON.stringify(mockSession));
      
      setUser(mockUser);
      setSession(mockSession);
      
      toast.success('Account created successfully!');
      return { error: null };
    } catch (_error) {
      console.error('Mock sign-up error:', error);
      toast.error('Sign-up failed. Please try again.');
      return { error };
    }
  };

  const signIn = async (email: string, _password: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user (in real app, this would validate credentials)
      const mockUser: MockUser = {
        id: `user_${Date.now()}`,
        email,
        user_metadata: {
          full_name: email.split('@')[0], // Use email prefix as name
          avatar_url: `https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=400&h=400&fit=crop&crop=face`
        }
      };

      const mockSession: MockSession = {
        user: mockUser,
        access_token: `mock_token_${Date.now()}`
      };

      // Save to localStorage
      localStorage.setItem('mock_session', JSON.stringify(mockSession));
      
      setUser(mockUser);
      setSession(mockSession);
      
      toast.success('Welcome back!');
      return { error: null };
    } catch (_error) {
      console.error('Mock sign-in error:', error);
      toast.error('Sign-in failed. Please try again.');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Remove from localStorage
      localStorage.removeItem('mock_session');
      
      setUser(null);
      setSession(null);
      
      toast.success('Signed out successfully');
    } catch (_error) {
      console.error('Mock sign-out error:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};