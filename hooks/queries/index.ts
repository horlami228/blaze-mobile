// Central export for all query hooks

// Auth hooks
export {
  useServerAuthStatus,
  useUpdateProfileMutation,
  useUserProfile,
} from "./auth.queries";

// Ride hooks
export {
  useActiveRide,
  useCancelRideMutation,
  useRateRideMutation,
  useRequestRideMutation,
  useRideDetail,
  useRideHistory,
} from "./ride.queries";

// Driver Onboarding hooks
export {
  useManufacturers,
  useModels,
  useOnboardingStatus,
  useSubmitDriverInfo,
  useSubmitPersonalInfo,
  useSubmitVehicleInfo,
} from "./driver.queries";
