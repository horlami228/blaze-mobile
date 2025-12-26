import { API_ENDPOINTS } from "@/constants/config";
import type {
  DriverInfoResponse,
  ManufacturersResponse,
  ModelsResponse,
  OnboardingStatusResponse,
  PersonalInfoResponse,
  SubmitPersonalInfoRequest,
  VehicleInfoResponse,
} from "@/types";
import apiClient from "../client";

export const driverService = {
  /**
   * Get current onboarding status
   */
  async getOnboardingStatus(): Promise<OnboardingStatusResponse["data"]> {
    const response = await apiClient.get<OnboardingStatusResponse>(
      API_ENDPOINTS.ONBOARDING_STATUS
    );
    return response.data.data;
  },

  /**
   * Submit personal information (Step 1)
   */
  async submitPersonalInfo(
    data: SubmitPersonalInfoRequest
  ): Promise<PersonalInfoResponse["data"]> {
    const response = await apiClient.post<PersonalInfoResponse>(
      API_ENDPOINTS.ONBOARDING_PERSONAL,
      data
    );
    return response.data.data;
  },

  /**
   * Submit driver information with file uploads (Step 2)
   * @param formData FormData object containing licenseNumber, profilePhoto, and licensePhoto
   */
  async submitDriverInfo(
    formData: FormData
  ): Promise<DriverInfoResponse["data"]> {
    const response = await apiClient.post<DriverInfoResponse>(
      API_ENDPOINTS.ONBOARDING_DRIVER,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },

  /**
   * Submit vehicle information with file uploads (Step 3)
   * @param formData FormData object containing vehicle details and photos
   */
  async submitVehicleInfo(
    formData: FormData
  ): Promise<VehicleInfoResponse["data"]> {
    const response = await apiClient.post<VehicleInfoResponse>(
      API_ENDPOINTS.ONBOARDING_VEHICLE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },

  async getManufacturers(): Promise<ManufacturersResponse["data"]> {
    const response = await apiClient.get<ManufacturersResponse>(
      API_ENDPOINTS.MANUFACTURERS
    );
    return response.data.data;
  },

  async getModels(manufacturerId: string): Promise<ModelsResponse["data"]> {
    const response = await apiClient.get<ModelsResponse>(
      API_ENDPOINTS.MODELS(manufacturerId)
    );
    return response.data.data;
  },
};
