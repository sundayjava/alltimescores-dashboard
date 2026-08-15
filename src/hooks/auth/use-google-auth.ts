import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { googleAuth } from "@/services/auth.service";
import { GoogleAuthRequest } from "@/types/auth";
import { useAuthStore } from "@/stores/auth-store";
import { getSafeRedirectUrl } from "@/lib/redirect";

export function useGoogleAuth() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: (data: GoogleAuthRequest) => googleAuth(data),
        onSuccess: (response) => {
            setAuth(response.data);

            // Seed the "me" query so pages relying on useCurrentUser() don't
            // briefly see the stale logged-out error before it refetches
            queryClient.setQueryData(["me"], response);

            const safeRedirect = getSafeRedirectUrl();
            if (safeRedirect) {
                window.location.href = safeRedirect;
            } else {
                router.push("/console");
            }
        },
    });
}
