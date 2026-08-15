"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { getSafeRedirectUrl } from "@/lib/redirect";

export default function LoginPage() {
  const router = useRouter();
  const { isLoading, isSuccess } = useCurrentUser();

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
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Don't show login form if already authenticated (will redirect)
  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    );
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
