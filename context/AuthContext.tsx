import apiClient, { tokenManager } from "@/api/client";
import { API_ENDPOINTS, STORAGE_KEYS } from "@/constants/config";
import { AuthContextType, BaseUser, LoginResponse } from "@/types";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

// Create context with undefined initial value for safety check
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<BaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Auth State (Check for persisting token/user)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await tokenManager.getToken();
        const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);

        if (token && userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } else {
          // Token invalid or missing user data
          // Don't call handleLogout() here to avoid redirect loop on load, just reset state
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth init failed:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.LOGIN,
        {
          email,
          password,
        }
      );

      const { token, refreshToken, user: userData } = response.data;

      // 1. Persist Session
      await tokenManager.setToken(token);
      // await tokenManager.setRefreshToken(refreshToken);
      await SecureStore.setItemAsync(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData)
      );

      // 2. Update State
      setUser(userData as BaseUser);
      setIsAuthenticated(true);

      // 3. Navigate
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Let the UI handle the specific error display
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string): Promise<void> => {
    // Implementation placeholder - typically similar to login if OTP returns the final token
    // For now, assuming login flow handles the primary auth
    console.warn("verifyOTP implementation pending backend spec");
    return Promise.resolve();
  };

  const handleLogout = async () => {
    try {
      // 1. Clear Backend Session (optional, fire-and-forget)
      apiClient.post(API_ENDPOINTS.LOGOUT).catch(() => {});

      // 2. Clear Local Storage
      await tokenManager.clearTokens();
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);

      // 3. Reset State
      setUser(null);
      setIsAuthenticated(false);

      // 4. Navigate to Login
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateUser = (data: Partial<BaseUser>) => {
    if (!user) return;

    // Optimistic update
    const updatedUser = { ...user, ...data } as BaseUser;
    setUser(updatedUser);

    // Sync with storage
    SecureStore.setItemAsync(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(updatedUser)
    ).catch(console.error);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    verifyOTP,
    logout: handleLogout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook for consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
