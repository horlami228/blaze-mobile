// ==================== REQUEST TYPES (What you SEND to API) ====================

export interface SubmitPersonalInfoRequest {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE";
}

// Note: DriverInfo and VehicleInfo use FormData, not typed objects

// ==================== RESPONSE TYPES (What you GET from API) ====================

export interface OnboardingStatusResponse {
  data: {
    currentStep: number;

    hasPersonalInfo: boolean;
    hasDriverInfo: boolean;
    hasVehicle: boolean;
    isComplete: boolean;

    user: {
      id: string;
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: "MALE" | "FEMALE";
    };
    driver: {
      id: string;
      licenseNumber: string;
      profilePhoto?: string;
      licensePhoto?: string;
      onboardingCompleted: boolean;
      onboardingStep: number;
    };
    vehicle: {
      id: string;
      year: number;
      manufacturer: string;
      model: {
        id: string;
        manufacturerId: string;
        name: string;
        type: string;
        seats: number;
        manufacturer: {
          id: string;
          name: string;
        };
      };
      plateNumber: string;
      isActive: boolean;
      color: string;
      exteriorPhoto?: string;
      interiorPhoto?: string;
      licenseCertificate?: string;
    };
  };
}

export interface PersonalInfoResponse {
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: "MALE" | "FEMALE";
    };
  };
}

export interface DriverInfoResponse {
  data: {
    driver: {
      id: string;
      licenseNumber: string;
      profilePhoto?: string;
      licensePhoto?: string;
      onboardingCompleted: boolean;
      onboardingStep: number;
    };
  };
}

export interface VehicleInfoResponse {
  data: {
    vehicle: {
      id: string;
      year: number;
      manufacturer: string;
      model: {
        id: string;
        manufacturerId: string;
        name: string;
        type: string;
        seats: number;
        manufacturer: {
          id: string;
          name: string;
        };
      };
      plateNumber: string;
      isActive: boolean;
      color: string;
      exteriorPhoto?: string;
      interiorPhoto?: string;
      licenseCertificate?: string;
    };
  };
}

// ==================== UTILITY TYPES ====================

export interface ManufacturersResponse {
  data: {
    name: string;
    id: string;
  }[];
}

export interface ModelsResponse {
  data: {
    id: string;
    manufacturerId: string;
    name: string;
    type: string;
    seats: number;
    manufacturer: {
      id: string;
      name: string;
    };
  }[];
}
