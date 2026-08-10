import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/services/auth.service";
import { ForgotPasswordRequest } from "@/types/auth";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
  });
}