import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { api, User, LoginRequest, RegisterRequest } from '../services/api';

// Define the shape of our authentication context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
});

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Authentication provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (api.isAuthenticated()) {
        try {
          const userData = await api.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error('Error checking authentication:', err);
          // Silent failure - we just won't log the user in automatically
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await api.login(credentials);
      setUser(userData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to login. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.register(userData);
      // Automatically log in after successful registration
      await login({
        username: userData.username,
        password: userData.password,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to register. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    api.logout();
    setUser(null);
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Provide the auth context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the context for potential direct access
export default AuthContext;

