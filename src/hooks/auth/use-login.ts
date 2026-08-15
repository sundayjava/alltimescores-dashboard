import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginUser } from "@/services/auth.service";
import { LoginRequest } from "@/types/auth";
import { useAuthStore } from "@/stores/auth-store";
import { getSafeRedirectUrl } from "@/lib/redirect";

export function useLogin() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: (data: LoginRequest) => loginUser(data),
        onSuccess: (response) => {
            // Session lives in an httpOnly cookie now; just cache the user
            setAuth(response.data);

            // Seed the "me" query so pages relying on useCurrentUser() don't
            // briefly see the stale logged-out error before it refetches
            queryClient.setQueryData(["me"], response);

            // Send the user back to where they came from (e.g. a blog post), if valid
            const safeRedirect = getSafeRedirectUrl();
            if (safeRedirect) {
                window.location.href = safeRedirect;
            } else {
                router.push("/console");
            }
        },
    });
}
