import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User, AuthState } from '../types';
import * as api from '../api';

// Helper to generate a persistent avatar URL based on username
const makeAvatar = (username: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

interface AuthContextProps {
  authState: AuthState;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  // 1) On mount: restore from localStorage or call /api/me
  useEffect(() => {
    const stored = localStorage.getItem('postspace_auth');
    if (stored) {
      try {
        setAuthState(JSON.parse(stored));
        return; // skip getMe if we have stored session
      } catch {
        localStorage.removeItem('postspace_auth');
      }
    }
    (async () => {
      setAuthState(s => ({ ...s, isLoading: true }));
      try {
        const res = await api.getMe();
        if (res.success) {
          // Enrich avatar if missing
          const rawUser = res.user as User;
          const enrichedUser: User = {
            ...rawUser,
            avatar: rawUser.avatar || makeAvatar(rawUser.username),
          };
          const next: AuthState = {
            isAuthenticated: true,
            user: enrichedUser,
            isLoading: false,
            error: null,
          };
          setAuthState(next);
          localStorage.setItem('postspace_auth', JSON.stringify(next));
        } else {
          setAuthState({ ...initialAuthState, isLoading: false });
        }
      } catch {
        setAuthState({ ...initialAuthState, isLoading: false });
      }
    })();
  }, []);

  // 2) Sync authState to localStorage whenever authenticated
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      localStorage.setItem('postspace_auth', JSON.stringify(authState));
    }
  }, [authState]);

  // Login
  const login = async (username: string, password: string) => {
    setAuthState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const res = await api.signin(username, password);
      if (!res.success) throw new Error(res.message);
      const rawUser = res.user as User;
      const enrichedUser: User = {
        ...rawUser,
        avatar: rawUser.avatar || makeAvatar(rawUser.username),
      };
      const next: AuthState = {
        isAuthenticated: true,
        user: enrichedUser,
        isLoading: false,
        error: null,
      };
      setAuthState(next);
      localStorage.setItem('postspace_auth', JSON.stringify(next));
    } catch (err: any) {
      setAuthState(s => ({
        ...s,
        isLoading: false,
        error: err.message || 'Login failed',
      }));
      throw err;
    }
  };

  // Signup (and auto-login)
  const signup = async (
    username: string,
    email: string,
    password: string
  ) => {
    setAuthState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const res = await api.signup(username, email, password);
      if (!res.success) throw new Error(res.message);
      // After successful signup, treat returned user the same as login
      await login(username, password);
    } catch (err: any) {
      setAuthState(s => ({
        ...s,
        isLoading: false,
        error: err.message || 'Signup failed',
      }));
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setAuthState({ ...initialAuthState, isLoading: false });
      localStorage.removeItem('postspace_auth');
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
