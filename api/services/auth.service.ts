import { API_ENDPOINTS } from "@/constants/config";
import type {
  BaseUser,
  LoginRequest,
  LoginResponse,
  VerifyOTPRequest,
} from "@/types";
import apiClient, { tokenManager } from "../client";

export const authService = {
  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<LoginResponse["data"]> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.LOGIN,
      data
    );
    return response.data.data;
  },

  /**
   * Verify OTP
   */
  async verifyOTP(data: VerifyOTPRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.VERIFY_OTP,
      data
    );
    return response.data;
  },

  /**
   * Resend OTP
   */
  async resendOTP(phoneNumber: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.RESEND_OTP, { phoneNumber });
  },

  /**
   * Get user profile
   */
  async getProfile(): Promise<BaseUser> {
    const response = await apiClient.get<BaseUser>(API_ENDPOINTS.USER_PROFILE);
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<BaseUser>): Promise<BaseUser> {
    const response = await apiClient.post<BaseUser>(
      API_ENDPOINTS.UPDATE_PROFILE,
      data
    );
    return response.data;
  },

  /**
   * Logout from server
   */
  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.LOGOUT);
  },

  /**
   * Check if user is authenticated (frontend check)
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await tokenManager.getToken();
    return !!token;
  },
};
