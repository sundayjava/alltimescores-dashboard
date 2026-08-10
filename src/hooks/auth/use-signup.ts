import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { register as registerUser } from "@/services/auth.service";
import { RegisterRequest } from "@/types/auth";

export function useSignup() {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: RegisterRequest) => registerUser(data),
        onSuccess: (_response, variables) => {
            // Pass email to verify-email page via URL
            const encodedEmail = encodeURIComponent(variables.email);
            router.push(`/verify-email?email=${encodedEmail}`);
        },
    });
}