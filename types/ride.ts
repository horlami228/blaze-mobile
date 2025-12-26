export interface Ride {
  id: string;
  riderId: string;
  driverId?: string;
  pickupLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  dropoffLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  status:
    | "PENDING"
    | "ACCEPTED"
    | "ON_ROUTE"
    | "ARRIVED"
    | "COMPLETED"
    | "CANCELLED";
  fare: number;
  distance?: number;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RideRequest {
  pickupLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  dropoffLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  vehicleType?: string;
}
