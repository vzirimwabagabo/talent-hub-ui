// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  UserRole,
  SupporterType
} from '@/types/auth';
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser
} from '@/api/userApi';

// Auth context interface
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasSupporterType: (type: SupporterType) => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        try {
          const parsedUser: AuthUser = JSON.parse(storedUser);
          // Optionally revalidate with backend if needed:
          // const freshUser = await getCurrentUser();
          // setUser(freshUser);
          setUser(parsedUser);
        } catch (e) {
          console.error('Auth initialization failed', e);
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  // Auth actions
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const res = await loginUser(credentials);
      const { token, user: userData } = res.data.data;
      if (!token || !userData) {
        return { success: false, error: 'Login failed' };
      }
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (data: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const { token, user: userData } = await registerUser(data);
      if (!token || !userData) {
        return { success: false, error: 'Registration failed' };
      }
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    logoutUser(); // Backend logout if needed
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Role checks
  const hasRole = (role: UserRole) => user?.role === role;
  const hasSupporterType = (type: SupporterType) => user?.supporterType === type;

  // Context value
  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    hasRole,
    hasSupporterType,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
