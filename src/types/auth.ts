export type UserRole = "USER" | "AUTHOR" | "EDITOR" | "ADMIN" | "SUPER_ADMIN";
export type UserPlan = "FREE" | "STARTER" | "PRO" | "ENTERPRISE";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  role: UserRole;
  plan: UserPlan;
  emailVerified: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface GoogleAuthRequest {
  idToken: string;
}

export interface GoogleAuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiError extends Error {
  response?: {
    data: ApiErrorResponse;
    status: number;
    statusText: string;
  };
  request?: unknown;
  config?: unknown;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
  };
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}