// app/hooks/queries/ride.queries.ts
import { rideService } from "@/api/services/ride.service";
import { queryKeys } from "@/react-query/query-keys";
import type { RideRequest } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to get ride history
 */
export function useRideHistory() {
  return useQuery({
    queryKey: queryKeys.rides.history(),
    queryFn: () => rideService.getHistory(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to get active ride
 */
export function useActiveRide() {
  return useQuery({
    queryKey: queryKeys.rides.active(),
    queryFn: () => rideService.getActive(),
    refetchInterval: (query) => (query.state.data ? 5000 : false), // Poll only if there is an active ride
  });
}

/**
 * Hook to get ride details
 */
export function useRideDetail(rideId: string) {
  return useQuery({
    queryKey: queryKeys.rides.detail(rideId),
    queryFn: () => rideService.getDetail(rideId),
    enabled: !!rideId,
  });
}

/**
 * Mutation hook for requesting a ride
 */
export function useRequestRideMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RideRequest) => rideService.requestRide(data),
    onSuccess: (newRide) => {
      queryClient.setQueryData(queryKeys.rides.active(), newRide);
      queryClient.invalidateQueries({ queryKey: queryKeys.rides.history() });
    },
  });
}

/**
 * Mutation hook for cancelling a ride
 */
export function useCancelRideMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rideId: string) => rideService.cancelRide(rideId),
    onSuccess: (cancelledRide) => {
      queryClient.setQueryData(
        queryKeys.rides.detail(cancelledRide.id),
        cancelledRide
      );
      queryClient.setQueryData(queryKeys.rides.active(), null);
      queryClient.invalidateQueries({ queryKey: queryKeys.rides.history() });
    },
  });
}

/**
 * Mutation hook for rating a ride
 */
export function useRateRideMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      rideId,
      rating,
      comment,
    }: {
      rideId: string;
      rating: number;
      comment?: string;
    }) => rideService.rateRide(rideId, rating, comment),
    onSuccess: (ratedRide) => {
      queryClient.setQueryData(queryKeys.rides.detail(ratedRide.id), ratedRide);
      queryClient.invalidateQueries({ queryKey: queryKeys.rides.history() });
    },
  });
}
