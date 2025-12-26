// app/hooks/queries/driver.queries.ts
import { driverService } from "@/api/services/driver.service";
import { queryKeys } from "@/react-query/query-keys";
import type { SubmitPersonalInfoRequest } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to get current onboarding status
 */
export function useOnboardingStatus() {
  return useQuery({
    queryKey: queryKeys.onboarding.status(),
    queryFn: () => driverService.getOnboardingStatus(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Mutation hook for submitting personal info (Step 1)
 */
export function useSubmitPersonalInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitPersonalInfoRequest) =>
      driverService.submitPersonalInfo(data),
    onSuccess: () => {
      // Invalidate to refetch the full status (including new step & completion)
      queryClient.invalidateQueries({
        queryKey: queryKeys.onboarding.status(),
      });
    },
  });
}

/**
 * Mutation hook for submitting driver info (Step 2)
 */
export function useSubmitDriverInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      driverService.submitDriverInfo(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.onboarding.status(),
      });
    },
  });
}

/**
 * Mutation hook for submitting vehicle info (Step 3)
 */
export function useSubmitVehicleInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      driverService.submitVehicleInfo(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.onboarding.status(),
      });
    },
  });
}

export function useManufacturers() {
  return useQuery({
    queryKey: queryKeys.manufacturers.list(),
    queryFn: () => driverService.getManufacturers(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (Static data)
  });
}

export function useModels(manufacturerId: string) {
  return useQuery({
    queryKey: queryKeys.models.byManufacturer(manufacturerId),
    queryFn: () => driverService.getModels(manufacturerId),
    enabled: !!manufacturerId, // Only run if manufacturerId exists
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (Static data)
  });
}
