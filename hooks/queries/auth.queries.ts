// app/hooks/queries/auth.queries.ts
import { authService } from "@/api/services/auth.service";
import { queryKeys } from "@/react-query/query-keys";
import type { BaseUser } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to get the current user profile from server state
 */
export function useUserProfile() {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: () => authService.getProfile(),
    // Enabled only when we have a reason to fetch (e.g. on profile screen)
    enabled: false,
  });
}

/**
 * Hook to check server-side authentication status
 */
export function useServerAuthStatus() {
  return useQuery({
    queryKey: queryKeys.auth.status(),
    queryFn: () => authService.isAuthenticated(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Mutation hook for updating user profile
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BaseUser>) => authService.updateProfile(data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.auth.user() });
      const previousUser = queryClient.getQueryData<BaseUser>(
        queryKeys.auth.user()
      );

      if (previousUser) {
        queryClient.setQueryData<BaseUser>(queryKeys.auth.user(), {
          ...previousUser,
          ...newData,
        });
      }

      return { previousUser };
    },
    onError: (err, newData, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(queryKeys.auth.user(), context.previousUser);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
  });
}
