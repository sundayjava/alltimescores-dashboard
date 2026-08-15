"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { PageSpinner } from "@/components/ui/spinner";
import { getSafeRedirectUrl } from "@/lib/redirect";

export default function LoginPage() {
  const router = useRouter();
  const { isLoading, isSuccess } = useCurrentUser({ silent: true });

  useEffect(() => {
    // Already logged in (valid session cookie): send back to where they
    // came from, or the dashboard
    if (isSuccess) {
      const safeRedirect = getSafeRedirectUrl();
      if (safeRedirect) {
        window.location.href = safeRedirect;
      } else {
        router.push("/console");
      }
    }
  }, [isSuccess, router]);

  // Show loading while we check for an existing session
  if (isLoading) {
    return <PageSpinner />;
  }

  // Don't show login form if already authenticated (will redirect)
  if (isSuccess) {
    return <PageSpinner />;
  }

  return (
    <AuthLayout>
      <AuthFormWrapper
        title="Sign in"
        description=""
      >
        <LoginForm />
      </AuthFormWrapper>
    </AuthLayout>
  );
}
