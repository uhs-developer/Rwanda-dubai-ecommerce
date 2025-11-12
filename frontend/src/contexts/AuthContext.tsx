import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthService, LoginRequest, RegisterRequest } from '../services/auth';
import { toast } from 'sonner';

// Auth Context Types
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  hasRole: (roleSlug: string) => boolean;
  hasAnyRole: (roleSlugs: string[]) => boolean;
  hasPermission: (permissionSlug: string) => boolean;
  hasAnyPermission: (permissionSlugs: string[]) => boolean;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isEditor: () => boolean;
  isUser: () => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setIsLoading(true);
    
    try {
      // Check if user is authenticated
      if (AuthService.isAuthenticated()) {
        const storedUser = AuthService.getStoredUser();
        
        if (storedUser) {
          setUser(storedUser);
          
          // Optionally refresh user data from server
          try {
            await refreshUser();
          } catch (error) {
            // If refresh fails, use stored data
            console.warn('Failed to refresh user data:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      AuthService.clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await AuthService.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast.success(response.message || `Welcome back, ${response.data.user.name}!`);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await AuthService.register(userData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast.success(response.message || `Welcome, ${response.data.user.name}!`);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle timeout errors specifically
      if (error.message && error.message.includes('timeout')) {
        toast.error('Registration is taking longer than expected. Please wait a moment and try logging in if your account was created.');
      } else {
        toast.error(error.message || 'Registration failed');
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthService.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Clear local data even if API call fails
      setUser(null);
      toast.success('Logged out successfully');
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAll = async () => {
    try {
      setIsLoading(true);
      await AuthService.logoutAll();
      setUser(null);
      toast.success('Logged out from all devices');
    } catch (error: any) {
      console.error('Logout all error:', error);
      // Clear local data even if API call fails
      setUser(null);
      toast.success('Logged out from all devices');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('rwanda-dubai-user', JSON.stringify(updatedUser));
    }
  };

  const refreshUser = async () => {
    try {
      const response = await AuthService.getCurrentUserGraphQL();
      
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('rwanda-dubai-user', JSON.stringify(response.data));
      }
    } catch (error: any) {
      console.error('Error refreshing user:', error);
      
      // If token is invalid, clear auth data
      if (error.status === 401) {
        AuthService.clearAuthData();
        setUser(null);
      }
      
      throw error;
    }
  };

  // Role and permission helper methods
  const hasRole = (roleSlug: string): boolean => {
    return AuthService.hasRole(user, roleSlug);
  };

  const hasAnyRole = (roleSlugs: string[]): boolean => {
    return AuthService.hasAnyRole(user, roleSlugs);
  };

  const hasPermission = (permissionSlug: string): boolean => {
    return AuthService.hasPermission(user, permissionSlug);
  };

  const hasAnyPermission = (permissionSlugs: string[]): boolean => {
    return AuthService.hasAnyPermission(user, permissionSlugs);
  };

  const isSuperAdmin = (): boolean => {
    return AuthService.isSuperAdmin(user);
  };

  const isAdmin = (): boolean => {
    return AuthService.isAdmin(user);
  };

  const isEditor = (): boolean => {
    return AuthService.isEditor(user);
  };

  const isUser = (): boolean => {
    return AuthService.isUser(user);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    logoutAll,
    updateUser,
    refreshUser,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    isSuperAdmin,
    isAdmin,
    isEditor,
    isUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;
