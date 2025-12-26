export default {
  name: "Blaze",
  slug: "blaze-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "blaze",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#19942dff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.yourcompany.blaze",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "We need your location to find nearby drivers and show your pickup location.",
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "We need your location to track your ride and show driver location.",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#19942dff",
    },
    package: "com.yourcompany.blaze",
    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION",
      "FOREGROUND_SERVICE",
      "ACCESS_BACKGROUND_LOCATION",
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow Blaze to use your location for ride requests.",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    // Environment variables - accessible via Constants.expoConfig.extra
    apiUrl: process.env.API_URL,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    sentryDsn: process.env.SENTRY_DSN,
    enableSocialLogin: process.env.ENABLE_SOCIAL_LOGIN === "true",
    nodeEnv: process.env.NODE_ENV,
    eas: {
      projectId: "your-eas-project-id",
    },
  },
};
