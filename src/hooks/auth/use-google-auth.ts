import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { googleAuth } from "@/services/auth.service";
import { GoogleAuthRequest } from "@/types/auth";
import { useAuthStore } from "@/stores/auth-store";

export function useGoogleAuth() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: (data: GoogleAuthRequest) => googleAuth(data),
        onSuccess: (response) => {
            setAuth(
                response.data.user,
                response.data.accessToken,
                response.data.refreshToken
            );

            router.push("/console");
        },
    });
}
