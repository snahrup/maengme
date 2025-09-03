import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  profile?: UserProfile;
  onboardingComplete: boolean;
}

interface UserProfile {
  experience: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  concerns: string[];
  preferredStrains: string[];
  typicalDose: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, remember: boolean) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // TODO: Validate token with backend
          // For now, mock user data
          const mockUser: User = {
            id: '1',
            username: 'demo',
            email: 'demo@maengme.com',
            onboardingComplete: false
          };
          setUser(mockUser);
        }      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string, remember: boolean) => {
    try {
      // TODO: Replace with actual API call to Supabase
      console.log('Login attempt:', { username, remember });
      
      // Mock successful login
      const mockUser: User = {
        id: '1',
        username,
        email: `${username}@maengme.com`,
        onboardingComplete: false
      };
      
      setUser(mockUser);
      
      // Store token if remember me is checked
      if (remember) {
        localStorage.setItem('authToken', 'mock-jwt-token');
      } else {
        sessionStorage.setItem('authToken', 'mock-jwt-token');
      }    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      // TODO: Replace with actual API call to Supabase
      console.log('Signup attempt:', { username, email });
      
      // Mock successful signup
      const mockUser: User = {
        id: Date.now().toString(),
        username,
        email,
        onboardingComplete: false
      };
      
      setUser(mockUser);
      localStorage.setItem('authToken', 'mock-jwt-token');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      // TODO: Update profile via API
      console.log('Updating profile:', profile);
      
      setUser({
        ...user,
        profile: {
          ...user.profile,
          ...profile
        } as UserProfile
      });
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};