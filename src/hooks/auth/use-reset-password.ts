import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/services/auth.service";

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { token: string; password: string }) => resetPassword(data),
    onSuccess: () => {
      // Auto-redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
  });
}