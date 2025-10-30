// TypeScript types matching backend models

// User Types
export interface User {
  userId: string;
  email: string;
  passwordHash?: string;
  userType: 'driver' | 'advertiser';
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Driver {
  driverId: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date | string;
  driversLicenseNumber?: string;
  city?: string;
  region?: string;
  averageRating: number;
  totalCampaignsCompleted: number;
  isVerified: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Advertiser {
  advertiserId: string;
  userId: string;
  companyName: string;
  contactPerson?: string;
  phoneNumber?: string;
  businessAddress?: string;
  city?: string;
  industry?: string;
  isVerified: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Vehicle {
  vehicleId: string;
  driverId: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  registrationNumber: string;
  vehicleType?: VehicleType;
  sizeCategory?: SizeCategory;
  photoUrl?: string;
  isVerified: boolean;
  createdAt: Date | string;
}

export interface Notification {
  notificationId: string;
  userId: string;
  title: string;
  message?: string;
  isRead: boolean;
  createdAt: Date | string;
}

export interface Campaign {
  campaignId: string;
  advertiserId: string;
  campaignName: string;
  description?: string;
  status: CampaignStatus;
  startDate: Date | string;
  endDate: Date | string;
  paymentPerDay?: number;
  requiredDrivers: number;
  wrapDesignUrl?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DriverCampaign {
  driverCampaignId: string;
  driverId: string;
  campaignId: string;
  status: DriverCampaignStatus;
  matchScore?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  appliedAt: Date | string;
  approvedAt?: Date | string;
  rejectionReason?: string;
  createdAt: Date | string;
}

export interface LocationTrack {
  trackId: string;
  driverId: string;
  driverCampaignId?: string;
  trackDate: Date | string;
  startTime?: Date | string;
  endTime?: Date | string;
  distanceKm?: number;
  durationHours?: number;
  estimatedImpressions: number;
  isSynced: boolean;
  syncedAt?: Date | string;
  createdAt: Date | string;
}

export interface LocationPoint {
  pointId: string;
  trackId: string;
  recordedAt: Date | string;
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  speedKmh?: number;
  isSynced: boolean;
  createdAt: Date | string;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  userType: 'driver' | 'advertiser';
  // Additional fields based on userType
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    userId: string;
    email: string;
    userType: 'driver' | 'advertiser';
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: unknown[];
}

// Campaign & Vehicle Types
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
export type DriverCampaignStatus = 'pending' | 'approved' | 'active' | 'completed' | 'rejected';
export type VehicleType = 'sedan' | 'suv' | 'van' | 'truck' | 'hatchback';
export type SizeCategory = 'small' | 'medium' | 'large';

// Utility Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
