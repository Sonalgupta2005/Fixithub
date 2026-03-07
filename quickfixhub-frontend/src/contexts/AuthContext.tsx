import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { User, AuthState } from "@/types";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User | null>;
  signup: (userData: Partial<User> & { password: string }) => Promise<User | null>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = "https://fixithub-uhlu.onrender.com/api";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const getToken = () => localStorage.getItem("token");

  // Restore session on refresh
  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();

      if (!token) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (data.success && data.user) {
          setAuthState({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          localStorage.removeItem("token");
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

    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem("token", data.token);

        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });

        return data.user;
      }

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      return null;
    } catch (error) {
      console.error("Login error:", error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return null;
    }
  }, []);

  const signup = useCallback(
    async (userData: Partial<User> & { password: string }): Promise<User | null> => {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      try {
        const res = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const data = await res.json();

        if (data.success && data.token) {
          localStorage.setItem("token", data.token);

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
        console.error("Signup error:", error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return null;
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};