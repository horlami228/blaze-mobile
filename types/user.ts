export interface BaseUser {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  isVerified: boolean;
  gender: "MALE" | "FEMALE";
  dateOfBirth: string;
  role: "RIDER" | "DRIVER";
}

export interface Rider extends BaseUser {
  role: "RIDER";
  defaultPaymentMethodId?: string;
  rating: number;
}

export interface Driver extends BaseUser {
  role: "DRIVER";
  licenseNumber: string;
  vehicle: {
    model: string;
    color: string;
    plateNumber: string;
  };
  isOnline: boolean;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
}

// 4. The Master Type
export type User = Rider | Driver;
