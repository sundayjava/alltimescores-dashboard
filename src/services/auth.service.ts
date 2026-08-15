import { api } from "@/lib/api";
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  VerifyEmailResponse,
  VerifyEmailRequest,
  LogoutResponse,
  ResetPasswordResponse,
  ResetPasswordRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GoogleAuthRequest,
  GoogleAuthResponse,
  MeResponse,
} from "@/types/auth";

export async function register(
  payload: RegisterRequest
): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>(
    "/platform/auth/register",
    payload
  );

  return data;
}

export async function login(
  payload: LoginRequest
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    "/platform/auth/login",
    payload
  );

  return data;
}

export async function googleAuth(
  payload: GoogleAuthRequest
): Promise<GoogleAuthResponse> {
  const { data } = await api.post<GoogleAuthResponse>(
    "/platform/auth/google",
    payload
  );

  return data;
}

export async function resendVerificationEmail(
  data: ResendVerificationRequest
): Promise<ResendVerificationResponse> {
  const response = await api.post<ResendVerificationResponse>(
    "/platform/auth/send-verification",
    data
  );

  return response.data;
}

export async function verifyEmail(
  data: VerifyEmailRequest
): Promise<VerifyEmailResponse> {
  const response = await api.post<VerifyEmailResponse>(
    "/platform/auth/verify-email",
    data
  );
  return response.data;
}

export async function logout(): Promise<LogoutResponse> {
  const response = await api.post<LogoutResponse>("/platform/auth/logout");
  return response.data;
}

export async function getMe(): Promise<MeResponse> {
  const response = await api.get<MeResponse>("/platform/users/me");
  return response.data;
}

export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> {
  const response = await api.post<ForgotPasswordResponse>(
    "/platform/auth/forgot-password",
    data
  );
  return response.data;
}

export async function resetPassword(
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> {
  const response = await api.post<ResetPasswordResponse>(
    "/platform/auth/reset-password",
    data
  );
  return response.data;
}