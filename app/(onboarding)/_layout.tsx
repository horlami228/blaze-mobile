import ProgressBar from "@/components/onboarding/ProgressBar";
import { useAuth } from "@/context/AuthContext";
import { useOnboardingStatus } from "@/hooks/queries";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

export default function OnboardingLayout() {
  const { data: onboardingStatus, isLoading } = useOnboardingStatus();
  const { logout } = useAuth();
  const pathname = usePathname();

  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoading || !onboardingStatus) return;

    // 1. If complete, always send to home
    if (onboardingStatus.isComplete) {
      router.replace("/(tabs)/home");
      return;
    }

    const stepRoutes: Record<number, string> = {
      1: "/(onboarding)/personal-info",
      2: "/(onboarding)/driver-info",
      3: "/(onboarding)/vehicle-info",
    };

    const targetRoute =
      stepRoutes[onboardingStatus.currentStep] || "/(onboarding)/personal-info";

    // 2. INITIAL REDIRECT: Only run this ONCE when the data first loads
    if (!hasRedirected.current) {
      hasRedirected.current = true; // Mark as done so it never forces a forward jump again
      router.replace(targetRoute as any);
      return;
    }

    // 3. SECURITY CHECK: Prevent skipping forward
    // Find what step the user is CURRENTLY trying to view
    const currentPathStep = Object.keys(stepRoutes).find((key) =>
      pathname.includes(stepRoutes[Number(key)])
    );

    if (
      currentPathStep &&
      Number(currentPathStep) > onboardingStatus.currentStep
    ) {
      // User is trying to skip ahead! Send them back to their actual status
      router.replace(targetRoute as any);
    }
  }, [onboardingStatus, isLoading, pathname]);

  const currentStepNumber = onboardingStatus?.currentStep || 1;

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#00C48C" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1E293B" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "600" },
        headerShadowVisible: false, // Modern way to remove the bottom line
        headerTitleAlign: "center",
        // Use the 'canGoBack' prop provided by Expo Router's header
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={logout} style={{ marginLeft: 10 }}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          ),
      }}
    >
      <Stack.Screen
        name="personal-info"
        options={{
          headerTitle: () => (
            <ProgressBar
              currentStep={onboardingStatus?.currentStep || 1}
              totalSteps={3}
            />
          ),
        }}
      />
      <Stack.Screen
        name="driver-info"
        options={{
          headerTitle: () => (
            <ProgressBar
              currentStep={onboardingStatus?.currentStep || 1}
              totalSteps={3}
            />
          ),
        }}
      />
      <Stack.Screen
        name="vehicle-info"
        options={{
          headerTitle: () => (
            <ProgressBar
              currentStep={onboardingStatus?.currentStep || 1}
              totalSteps={3}
            />
          ),
        }}
      />
    </Stack>
  );
}
