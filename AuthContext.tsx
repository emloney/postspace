import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextProps {
  authState: AuthState;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  useEffect(() => {
    // Check for existing session in localStorage
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('postspace_user');
        console.log('Stored user:', storedUser);
        
        if (storedUser) {
          const user = JSON.parse(storedUser) as User;
          setAuthState({
            isAuthenticated: true,
            user,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState({
            ...initialAuthState,
            isLoading: false,
          });
        }
      } catch (error) {
        setAuthState({
          ...initialAuthState,
          isLoading: false,
          error: 'Session restoration failed',
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setAuthState({
        ...authState,
        isLoading: true,
        error: null,
      });

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock authentication logic
      const user = mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
      
      if (!user) {
        throw new Error('Invalid username or password');
      }
      
      // Store user in localStorage
      console.log('User found:', user);
      localStorage.setItem('postspace_user', JSON.stringify(user));
      
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        ...authState,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      });
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      setAuthState({
        ...authState,
        isLoading: true,
        error: null,
      });

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if username already exists
      if (mockUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        throw new Error('Username already taken');
      }
      
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        username,
        displayName: username,
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`,
        joinedAt: new Date().toISOString(),
        karma: 0,
      };
      
      // Store user in localStorage
      localStorage.setItem('postspace_user', JSON.stringify(newUser));
      
      setAuthState({
        isAuthenticated: true,
        user: newUser,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        ...authState,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('postspace_user');
    setAuthState({
      ...initialAuthState,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};