import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return useMutation({
    mutationFn: () => {
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }
      return logout({ refreshToken });
    },
    onSuccess: () => {
      // Clear local state after server confirms
      clearAuth();
      router.push("/login");
    },
    onError: () => {
      // Even if API fails, clear local state
      // (User wants to logout anyway)
      clearAuth();
      router.push("/login");
    },
  });
}