import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { register as registerUser } from "@/services/auth.service";
import { RegisterRequest } from "@/types/auth";
import { getRedirectParam } from "@/lib/redirect";

export function useSignup() {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: RegisterRequest) => registerUser(data),
        onSuccess: (_response, variables) => {
            // Pass email (and where to return to, if any) to verify-email page via URL
            const encodedEmail = encodeURIComponent(variables.email);
            const redirect = getRedirectParam();
            const redirectQuery = redirect
                ? `&redirect=${encodeURIComponent(redirect)}`
                : "";

            router.push(`/verify-email?email=${encodedEmail}${redirectQuery}`);
        },
    });
}