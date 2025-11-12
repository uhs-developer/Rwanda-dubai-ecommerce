import { apiRequest, ApiResponse } from './api';
import { graphqlClient } from '../lib/graphqlClient';
import { GET_CURRENT_USER } from '../graphql/storefront';

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: string;
  last_login_at?: string;
  roles: Role[];
}

export interface Role {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
}

// Authentication Service
export class AuthService {
  // Login user
  static async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiRequest<AuthResponse>('POST', '/login', credentials, {
      timeout: 20000 // 20 seconds for login
    });
    
    if (response.success && response.data) {
      // Store token and user data
      localStorage.setItem('rwanda-dubai-token', response.data.token);
      localStorage.setItem('rwanda-dubai-user', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  // Register user
  static async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiRequest<AuthResponse>('POST', '/register', userData, {
      timeout: 45000 // 45 seconds for registration (includes role assignment and database operations)
    });
    
    if (response.success && response.data) {
      // Store token and user data
      localStorage.setItem('rwanda-dubai-token', response.data.token);
      localStorage.setItem('rwanda-dubai-user', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  // Get current user (REST API - deprecated, use getCurrentUserGraphQL)
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return await apiRequest<User>('GET', '/me');
  }

  // Get current user using GraphQL
  static async getCurrentUserGraphQL(): Promise<ApiResponse<User>> {
    try {
      const result = await graphqlClient.query(GET_CURRENT_USER, {}).toPromise();
      
      if (result.error) {
        return {
          success: false,
          message: result.error.message,
          data: null,
        };
      }

      if (result.data?.me) {
        return {
          success: true,
          message: 'User fetched successfully',
          data: result.data.me,
        };
      }

      return {
        success: false,
        message: 'User not found',
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to fetch user',
        data: null,
      };
    }
  }

  // Logout current session
  static async logout(): Promise<ApiResponse> {
    try {
      const response = await apiRequest('POST', '/logout');
      this.clearAuthData();
      return response;
    } catch (error) {
      // Clear local data even if API call fails
      this.clearAuthData();
      throw error;
    }
  }

  // Logout all sessions
  static async logoutAll(): Promise<ApiResponse> {
    try {
      const response = await apiRequest('POST', '/logout-all');
      this.clearAuthData();
      return response;
    } catch (error) {
      // Clear local data even if API call fails
      this.clearAuthData();
      throw error;
    }
  }

  // Change password
  static async changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse> {
    return await apiRequest('POST', '/change-password', passwordData);
  }

  // Update profile
  static async updateProfile(profileData: UpdateProfileRequest): Promise<ApiResponse<User>> {
    const response = await apiRequest<User>('PUT', '/profile', profileData);
    
    if (response.success && response.data) {
      // Update stored user data
      localStorage.setItem('rwanda-dubai-user', JSON.stringify(response.data));
    }
    
    return response;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('rwanda-dubai-token');
    const user = localStorage.getItem('rwanda-dubai-user');
    return !!(token && user);
  }

  // Get stored user data
  static getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('rwanda-dubai-user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  // Get stored token
  static getStoredToken(): string | null {
    return localStorage.getItem('rwanda-dubai-token');
  }

  // Clear authentication data
  static clearAuthData(): void {
    localStorage.removeItem('rwanda-dubai-token');
    localStorage.removeItem('rwanda-dubai-user');
  }

  // Check if user has specific role
  static hasRole(user: User | null, roleSlug: string): boolean {
    if (!user || !user.roles) return false;
    const target = (roleSlug || '').toLowerCase();
    return user.roles.some(role => {
      const current = (role.slug || role.name || '').toLowerCase();
      return current === target;
    });
  }

  // Check if user has any of the specified roles
  static hasAnyRole(user: User | null, roleSlugs: string[]): boolean {
    if (!user || !user.roles) return false;
    const targets = roleSlugs.map(r => (r || '').toLowerCase());
    return user.roles.some(role => {
      const current = (role.slug || role.name || '').toLowerCase();
      return targets.includes(current);
    });
  }

  // Check if user has specific permission
  static hasPermission(user: User | null, permissionSlug: string): boolean {
    if (!user || !user.roles) return false;
    return user.roles.some(role => 
      role.permissions?.some(permission => permission.slug === permissionSlug)
    );
  }

  // Check if user has any of the specified permissions
  static hasAnyPermission(user: User | null, permissionSlugs: string[]): boolean {
    if (!user || !user.roles) return false;
    return user.roles.some(role => 
      role.permissions?.some(permission => permissionSlugs.includes(permission.slug))
    );
  }

  // Get all user permissions
  static getAllPermissions(user: User | null): string[] {
    if (!user || !user.roles) return [];
    
    const permissions: string[] = [];
    user.roles.forEach(role => {
      if (role.permissions) {
        role.permissions.forEach(permission => {
          if (!permissions.includes(permission.slug)) {
            permissions.push(permission.slug);
          }
        });
      }
    });
    
    return permissions;
  }

  // Check if user is super admin
  static isSuperAdmin(user: User | null): boolean {
    return this.hasRole(user, 'superadmin');
  }

  // Check if user is admin (super-admin or admin)
  static isAdmin(user: User | null): boolean {
    return this.hasAnyRole(user, ['superadmin', 'admin']);
  }

  // Check if user is editor
  static isEditor(user: User | null): boolean {
    return this.hasRole(user, 'editor');
  }

  // Check if user is regular user
  static isUser(user: User | null): boolean {
    return this.hasRole(user, 'user');
  }
}

export default AuthService;
