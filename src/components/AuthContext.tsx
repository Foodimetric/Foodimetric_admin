import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token on app initialization
    const savedToken =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken");

    if (savedToken) {
      // Optional: Validate token before setting as authenticated
      if (isTokenValid(savedToken)) {
        setToken(savedToken);
        setIsAuthenticated(true);
      } else {
        // Clear invalid token
        logout();
      }
    }

    setLoading(false);
  }, []);

  const isTokenValid = (token: string): boolean => {
    try {
      // If your token is a JWT, decode and check expiration
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      // Check if token is expired
      if (tokenPayload.exp && tokenPayload.exp < currentTime) {
        return false;
      }

      return true;
    } catch (error) {
      // If token is not a valid JWT, assume it's valid if it exists
      return Boolean(token);
    }
  };

  const login = (newToken: string) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");

    setToken(null);
    setIsAuthenticated(false);

    // Optional: Redirect to login
    window.location.href = "/";
  };

  const value = {
    isAuthenticated,
    token,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
