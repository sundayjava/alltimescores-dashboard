import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/sign-up-form";

export default function SignupPage() {
    return (
        <AuthLayout>
            <AuthFormWrapper
                title="Sign up"
                description=""
            >
                <SignupForm />
            </AuthFormWrapper>
        </AuthLayout>
    );
}