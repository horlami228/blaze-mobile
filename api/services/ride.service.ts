import { API_ENDPOINTS } from "@/constants/config";
import type { ApiResponse, Ride, RideRequest } from "@/types";
import apiClient from "../client";

export const rideService = {
  /**
   * Get ride history
   */
  async getHistory(): Promise<Ride[]> {
    const response = await apiClient.get<ApiResponse<Ride[]>>(
      API_ENDPOINTS.RIDE_HISTORY
    );
    return response.data.data || [];
  },

  /**
   * Get active ride
   */
  async getActive(): Promise<Ride | null> {
    const response = await apiClient.get<ApiResponse<Ride>>(
      API_ENDPOINTS.ACTIVE_RIDE
    );
    return response.data.data;
  },

  /**
   * Get ride details
   */
  async getDetail(id: string): Promise<Ride> {
    const response = await apiClient.get<ApiResponse<Ride>>(
      API_ENDPOINTS.RIDE_DETAILS(id)
    );
    return response.data.data;
  },

  /**
   * Request a ride
   */
  async requestRide(data: RideRequest): Promise<Ride> {
    const response = await apiClient.post<ApiResponse<Ride>>(
      API_ENDPOINTS.REQUEST_RIDE,
      data
    );
    return response.data.data;
  },

  /**
   * Cancel a ride
   */
  async cancelRide(rideId: string): Promise<Ride> {
    const response = await apiClient.post<ApiResponse<Ride>>(
      API_ENDPOINTS.CANCEL_RIDE,
      { rideId }
    );
    return response.data.data;
  },

  /**
   * Rate a ride
   */
  async rateRide(
    rideId: string,
    rating: number,
    comment?: string
  ): Promise<Ride> {
    const response = await apiClient.post<ApiResponse<Ride>>(
      API_ENDPOINTS.RATE_RIDE(rideId),
      { rating, comment }
    );
    return response.data.data;
  },
};
