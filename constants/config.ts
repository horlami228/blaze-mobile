import Constants from "expo-constants";

// Get environment variables from app.config.js
const extra = Constants.expoConfig?.extra || {};

// API Configuration
export const API_URL = extra.apiUrl || "http://localhost:3000/api/v1";

// Google Maps
export const GOOGLE_MAPS_API_KEY = extra.googleMapsApiKey || "";

// Sentry
export const SENTRY_DSN = extra.sentryDsn || "";

// Feature Flags
export const ENABLE_SOCIAL_LOGIN = extra.enableSocialLogin ?? true;
export const ENABLE_PROMO_CODES = extra.enablePromoCodes ?? true;

// Environment
export const NODE_ENV = extra.nodeEnv || "development";
export const IS_DEV = NODE_ENV === "development";
export const IS_PROD = NODE_ENV === "production";

// App Info
export const APP_NAME = Constants.expoConfig?.name || "Blaze";
export const APP_VERSION = Constants.expoConfig?.version || "1.0.0";
export const APP_SLUG = Constants.expoConfig?.slug || "blaze-app";

// Validate required variables
if (!API_URL) {
  console.warn("⚠️ API_URL is not set in environment variables");
}

if (IS_DEV) {
  console.log("📱 App Configuration:", {
    apiUrl: API_URL,
    environment: NODE_ENV,
    version: APP_VERSION,
  });
}

// Timeouts
export const REQUEST_TIMEOUT = 30000; // 30 seconds
export const RETRY_ATTEMPTS = 3;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  THEME: "theme",
  LANGUAGE: "language",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  REGISTER: "/auth/register",
  VERIFY_OTP: "/auth/verify-otp",
  RESEND_OTP: "/auth/resend-otp",

  // User
  USER_PROFILE: "/user/profile",
  UPDATE_PROFILE: "/user/profile",

  // Rides
  REQUEST_RIDE: "/rides/request",
  CANCEL_RIDE: "/rides/cancel",
  RIDE_HISTORY: "/rides/history",
  RIDE_DETAILS: (id: string) => `/rides/${id}`,
  ACTIVE_RIDE: "/rides/active",

  // Drivers
  NEARBY_DRIVERS: "/drivers/nearby",
  DRIVER_LOCATION: (id: string) => `/drivers/${id}/location`,

  // Payments
  PAYMENT_METHODS: "/payments/methods",
  ADD_PAYMENT_METHOD: "/payments/methods/add",
  DELETE_PAYMENT_METHOD: (id: string) => `/payments/methods/${id}`,

  // Promo codes
  VALIDATE_PROMO: "/promo/validate",
  APPLY_PROMO: "/promo/apply",
} as const;

// Colors (matching your design)
export const COLORS = {
  PRIMARY: "#19942dff",
  PRIMARY_DARK: "#288960",
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  GRAY: "#666666",
  LIGHT_GRAY: "#E5E5E5",
  BACKGROUND: "#F3F3F3",
  ERROR: "#FF3B30",
  SUCCESS: "#34C759",
  WARNING: "#FF9500",
} as const;

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_LATITUDE: 6.5244, // Lagos
  DEFAULT_LONGITUDE: 3.3792,
  DEFAULT_DELTA: 0.0922,
  MIN_ZOOM: 10,
  MAX_ZOOM: 20,
} as const;
