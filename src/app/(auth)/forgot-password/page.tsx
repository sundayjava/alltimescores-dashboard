import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <AuthFormWrapper
        title="Forgot password?"
        description="No worries, we'll send you reset instructions."
      >
        <ForgotPasswordForm />
      </AuthFormWrapper>
    </AuthLayout>
  );
}