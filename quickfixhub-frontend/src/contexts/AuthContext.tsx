import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User | null>;
  signup: (userData: Partial<User> & { password: string }) => Promise<User | null>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // 🔥 Start true until /auth/me resolves
  });

  /* ========================================
     LOAD SESSION ON APP START
  ======================================== */
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: 'include',
        });

        const data = await res.json();

        if (data.success && data.user) {
          setAuthState({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkSession();
  }, []);

  /* ========================================
     LOGIN
  ======================================== */
  const login = useCallback(
    async (email: string, password: string): Promise<User | null> => {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success && data.user) {
          setAuthState({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });

          return data.user; // ✅ return actual user
        }

        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });

        return null;
      } catch (error) {
        console.error('Login error:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return null;
      }
    },
    []
  );

  /* ========================================
     SIGNUP
  ======================================== */
  const signup = useCallback(
    async (userData: Partial<User> & { password: string }): Promise<User | null> => {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (data.success && data.user) {
          setAuthState({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });

          return data.user;
        }

        setAuthState(prev => ({ ...prev, isLoading: false }));
        return null;
      } catch (error) {
        console.error('Signup error:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return null;
      }
    },
    []
  );

  /* ========================================
     LOGOUT
  ======================================== */
  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  /* ========================================
     MANUAL USER SETTER
  ======================================== */
  const setUser = useCallback((user: User | null) => {
    setAuthState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ========================================
   HOOK
======================================== */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
