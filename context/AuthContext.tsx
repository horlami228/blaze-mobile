import { tokenManager } from "@/api/client";
import { authService } from "@/api/services/auth.service"; // New service
import { driverService } from "@/api/services/driver.service";
import { STORAGE_KEYS } from "@/constants/config";
import { queryKeys } from "@/react-query/query-keys"; // New query keys
import { queryClient } from "@/react-query/react-query"; // New query client
import { AuthContextType, BaseUser } from "@/types";
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
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);

          // Seed the TanStack Query cache with initial user data
          queryClient.setQueryData(queryKeys.auth.user(), parsedUser);
        } else {
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
      const data = await authService.login({ email, password });

      const { token, refreshToken, user: userData } = data;

      // 1. Persist Session
      await tokenManager.setToken(token);
      // await tokenManager.setRefreshToken(refreshToken);
      await SecureStore.setItemAsync(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData)
      );

      // 2. Update States (React State + TanStack Cache)
      setUser(userData as BaseUser);
      setIsAuthenticated(true);
      queryClient.setQueryData(queryKeys.auth.user(), userData);

      // 3. Navigate based on Role & Status
      if (userData.role === "DRIVER") {
        // Optimization: Use flag from login response if available
        if (userData.onboardingCompleted === false) {
          router.replace("/(onboarding)/personal-info");
          return;
        }

        // Fallback: If flag is undefined, check manually (backend compatibility)
        if (userData.onboardingCompleted === undefined) {
          try {
            const status = await driverService.getOnboardingStatus();
            if (!status.isComplete) {
              router.replace("/(onboarding)/personal-info");
              return;
            }
          } catch (error) {
            console.error("Failed to check onboarding status:", error);
            // Fallback to home if check fails (or handle error UI)
          }
        }
      }

      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string): Promise<void> => {
    // Placeholder - matches authService.verifyOTP flow if needed
    console.warn("verifyOTP implementation pending backend spec");
    return Promise.resolve();
  };

  const handleLogout = async () => {
    try {
      // 1. Clear Backend Session
      authService.logout().catch(() => {});

      // 2. Clear Local Storage
      await tokenManager.clearTokens();
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);

      // 3. Reset States (React State + Global Cache)
      setUser(null);
      setIsAuthenticated(false);
      queryClient.clear(); // Important: Clear all data on logout

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

    // Sync with TanStack Cache
    queryClient.setQueryData(queryKeys.auth.user(), updatedUser);

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
