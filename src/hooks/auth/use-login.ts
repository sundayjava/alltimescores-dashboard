import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login as loginUser } from "@/services/auth.service";
import { LoginRequest } from "@/types/auth";
import { useAuthStore } from "@/stores/auth-store";

export function useLogin() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: (data: LoginRequest) => loginUser(data),
        onSuccess: (response) => {
            // Store tokens and user data in Zustand store
            setAuth(
                response.data.user,
                response.data.accessToken,
                response.data.refreshToken
            );

            // Redirect to dashboard
            router.push("/console");
        },
    });
}
