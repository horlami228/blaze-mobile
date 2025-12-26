import { BaseUser } from "@/types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  statusCode: string;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    user: BaseUser;
    requiresOTP: boolean;
  };
}

export interface VerifyOTPRequest {
  phoneNumber: string;
  otp: string;
}

export interface RegisterRequest {
  phoneNumber: string;
  countryCode?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface AuthContextType {
  user: BaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<BaseUser>) => void;
}
