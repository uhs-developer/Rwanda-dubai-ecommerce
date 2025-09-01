import { apiRequest, ApiResponse } from './api';
import { User, UpdateProfileRequest, ChangePasswordRequest } from './auth';

// User Profile Service
export class UserService {
  // Update user profile
  static async updateProfile(profileData: UpdateProfileRequest): Promise<ApiResponse<User>> {
    return await apiRequest<User>('PUT', '/profile', profileData);
  }

  // Change user password
  static async changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse> {
    return await apiRequest('POST', '/change-password', passwordData);
  }

  // Get user dashboard data
  static async getDashboardData(): Promise<ApiResponse<any>> {
    return await apiRequest('GET', '/user/dashboard');
  }

  // Get user orders
  static async getUserOrders(): Promise<ApiResponse<any[]>> {
    // TODO: Implement when orders API is available
    return {
      success: true,
      data: [],
      message: 'Orders feature coming soon'
    };
  }

  // Get user addresses
  static async getUserAddresses(): Promise<ApiResponse<any[]>> {
    // TODO: Implement when addresses API is available
    return {
      success: true,
      data: [],
      message: 'Address book feature coming soon'
    };
  }

  // Add user address
  static async addAddress(addressData: any): Promise<ApiResponse<any>> {
    // TODO: Implement when addresses API is available
    return {
      success: true,
      message: 'Address book feature coming soon'
    };
  }

  // Update user address
  static async updateAddress(addressId: string, addressData: any): Promise<ApiResponse<any>> {
    // TODO: Implement when addresses API is available
    return {
      success: true,
      message: 'Address book feature coming soon'
    };
  }

  // Delete user address
  static async deleteAddress(addressId: string): Promise<ApiResponse> {
    // TODO: Implement when addresses API is available
    return {
      success: true,
      message: 'Address book feature coming soon'
    };
  }
}

export default UserService;
