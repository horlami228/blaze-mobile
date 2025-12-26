// Centralized query keys for cache management

export const queryKeys = {
  // Auth
  auth: {
    all: ["auth"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
    profile: () => [...queryKeys.auth.all, "profile"] as const,
    status: () => [...queryKeys.auth.all, "server-status"] as const,
  },

  // Rides
  rides: {
    all: ["rides"] as const,
    list: () => [...queryKeys.rides.all, "list"] as const,
    history: () => [...queryKeys.rides.all, "history"] as const,
    active: () => [...queryKeys.rides.all, "active"] as const,
    detail: (id: string) => [...queryKeys.rides.all, "detail", id] as const,
  },

  // Driver Onboarding
  onboarding: {
    all: ["onboarding"] as const,
    status: () => [...queryKeys.onboarding.all, "status"] as const,
  },

  // Drivers
  drivers: {
    all: ["drivers"] as const,
    nearby: (lat: number, lng: number) =>
      [...queryKeys.drivers.all, "nearby", lat, lng] as const,
    location: (id: string) =>
      [...queryKeys.drivers.all, "location", id] as const,
  },

  manufacturers: {
    all: ["manufacturers"] as const,
    list: () => [...queryKeys.manufacturers.all, "list"] as const,
  },

  models: {
    all: ["models"] as const,
    byManufacturer: (manufacturerId: string) =>
      [...queryKeys.models.all, manufacturerId] as const,
  },

  // Payments
  payments: {
    all: ["payments"] as const,
    methods: () => [...queryKeys.payments.all, "methods"] as const,
    method: (id: string) => [...queryKeys.payments.all, "method", id] as const,
  },

  // Promo codes
  promo: {
    all: ["promo"] as const,
    validate: (code: string) =>
      [...queryKeys.promo.all, "validate", code] as const,
  },
} as const;
