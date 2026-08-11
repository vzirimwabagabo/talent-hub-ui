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
  loginAdminUser,
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
  adminLogin: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasSupporterType: (type: SupporterType) => boolean;
}
// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Custom hook with safe fallback to avoid runtime crash when provider is missing
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context) return context;

  // Fallback no-op implementations to keep app stable in dev
  const noopAuth: AuthContextType = {
    user: null,
    loading: false,
    isAuthenticated: false,
    login: async () => ({ success: false, error: 'AuthProvider not available' }),
    adminLogin: async () => ({ success: false, error: 'AuthProvider not available' }),
    register: async () => ({ success: false, error: 'AuthProvider not available' }),
    logout: () => {},
    hasRole: () => false,
    hasSupporterType: () => false,
  };

  return noopAuth;
};
interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [revalidating, setRevalidating] = useState<boolean>(false);
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (token) {
        // If we have a token, attempt to revalidate with backend
        try {
          setRevalidating(true);
          const res = await getCurrentUser();
          if (res.success && res.data) {
            setUser(res.data as AuthUser);
            // refresh stored user
            localStorage.setItem('user', JSON.stringify(res.data));
          } else {
            // token invalid -> clear
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (e) {
          console.error('Auth revalidation failed', e);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setUser(null);
        } finally {
          setRevalidating(false);
          setLoading(false);
        }
      } else if (storedUser) {
        // No token but there is cached user data — use it but try to revalidate in background
        try {
          const parsedUser: AuthUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (e) {
          console.warn('Failed to parse stored user', e);
          localStorage.removeItem('user');
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Auth actions
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const res = await loginUser(credentials);
      if (!res || !res.success) {
        return { success: false, error: res?.error || 'Login failed' };
      }

      // Attempt to find token and user in common shapes
      const payload = res.data || {};
      const maybeServerPayload = payload.data || payload; // server nests under data
      const token = maybeServerPayload.token || maybeServerPayload?.data?.token;
      const userData = maybeServerPayload.user || maybeServerPayload;

      if (!token || !userData) {
        return { success: false, error: 'Login failed (unexpected response shape)' };
      }

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData as AuthUser);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (data: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const res = await registerUser(data);
      if (!res || !res.success) return { success: false, error: res?.error || 'Registration failed' };

      const payload = res.data || {};
      const maybeServerPayload = payload.data || payload;
      const token = maybeServerPayload.token || maybeServerPayload?.data?.token;
      const userData = maybeServerPayload.user || maybeServerPayload;

      if (!token || !userData) return { success: false, error: 'Registration failed (unexpected response shape)' };

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData as AuthUser);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const adminLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const res = await loginAdminUser(credentials);
      if (!res || !res.success) {
        return { success: false, error: res?.error || 'Admin login failed' };
      }

      const payload = res.data || {};
      const maybeServerPayload = (payload as any).data || payload;
      const token = (maybeServerPayload as any).token || (maybeServerPayload as any)?.data?.token;
      const userData = (maybeServerPayload as any).user || maybeServerPayload;

      if (!token || !userData) {
        return { success: false, error: 'Admin login failed (unexpected response shape)' };
      }

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData as AuthUser);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Admin login failed' };
    }
  };

  // Revalidate token on demand
  const revalidate = async (): Promise<boolean> => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    try {
      setRevalidating(true);
      const res = await getCurrentUser();
      if (res.success && res.data) {
        setUser(res.data as AuthUser);
        localStorage.setItem('user', JSON.stringify(res.data));
        return true;
      }
      // invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      return false;
    } catch (e) {
      console.error('Revalidate failed', e);
      return false;
    } finally {
      setRevalidating(false);
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
    loading: loading || revalidating,
    isAuthenticated: !!user,
    login,
    adminLogin,
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
