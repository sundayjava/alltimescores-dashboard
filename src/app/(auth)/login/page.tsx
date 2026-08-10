"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, selectIsAuthenticated, selectHasHydrated } from "@/stores/auth-store";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const hasHydrated = useAuthStore(selectHasHydrated);

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (hasHydrated && isAuthenticated) {
      router.push("/console");
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Show loading during hydration
  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Don't show login form if authenticated (will redirect)
  if (isAuthenticated) {
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