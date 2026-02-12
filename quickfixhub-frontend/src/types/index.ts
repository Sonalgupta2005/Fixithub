// User types for DynamoDB integration
export type UserRole = 'homeowner' | 'provider' | 'admin';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface ServiceProvider extends User {
  role: 'provider';
  specialties: ServiceType[];
  rating: number;
  completedJobs: number;
  available: boolean;
  bio?: string;
}

export type ServiceType = 'plumbing' | 'electrical' | 'carpentry' | 'painting' | 'cleaning' | 'hvac' | 'appliance' | 'general';

export type ServiceStatus = 'pending' |'offered'| 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'expired';

export interface ServiceRequest {
  _id: string;
  userId: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  service_type: ServiceType;
  description: string;
  address: string;
  preferred_date: string;
  preferred_time: string;
  status: ServiceStatus;
  assignedProviderId?: string;
  provider_name?: string;
  provider_phone?: string;
  provider_email?: string;
  created_at: string;
  updated_at: string;
  estimatedCost?: number;
  notes?: string;
}

// Auth context types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Response types (for Flask backend integration)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
