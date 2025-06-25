import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { authApi } from "../api/authApi";

// User interface
interface User {
  id: number;
  username: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const response = await authApi.checkAuth();

        if (response.statusCode === 200 && response.data) {
          setUser(response.data);
        } else {
          // Clear user state if not authenticated
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setError("Authentication check failed");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setError(null);
    try {
      const response = await authApi.login(username, password);

      if (response.statusCode === 200 && response.data) {
        // We don't need to store the token as it's in the HttpOnly cookie
        // Just set the user state from the response if available
        setUser({ id: 0, username }); // You might want to get actual user data from the server
        return true;
      } else {
        setError(response.message || "Login failed");
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
      return false;
    }
  };

  // Register function
  const register = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setError(null);
    try {
      const response = await authApi.register(username, password);

      if (response.statusCode === 201 && response.data) {
        // Similar to login, we rely on the HttpOnly cookie
        setUser({ id: 0, username });
        return true;
      } else {
        setError(response.message || "Registration failed");
        return false;
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
      setError("Logout failed. Please try again.");
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
