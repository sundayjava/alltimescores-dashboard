import { resendVerificationEmail } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";

export function useResendVerification() {
    return useMutation({
        mutationFn: (email: string) => resendVerificationEmail({ email }),
    })
}