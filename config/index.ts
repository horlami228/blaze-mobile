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
