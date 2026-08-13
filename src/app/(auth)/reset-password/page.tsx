"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordSchema } from "@/schemas/reset-password.schema";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-handler";
import { useResetPassword } from "@/hooks/auth/use-reset-password";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const resetPasswordMutation = useResetPassword();

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Validate token exists
  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      router.push("/forgot-password");
    }
  }, [token, router]);

  // Countdown after success
  useEffect(() => {
    if (resetSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    if (resetSuccess && countdown === 0) {
      router.push("/login");
    }
  }, [resetSuccess, countdown, router]);

  const onSubmit = async (values: ResetPasswordSchema) => {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    try {
      const response = await resetPasswordMutation.mutateAsync({
        token,
        password: values.password,
      });
      
      setResetSuccess(true);
      toast.success(response.message || "Password reset successfully!");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  // Success state
  if (resetSuccess) {
    return (
      <AuthLayout>
        <AuthFormWrapper
          title="Password Reset Successful"
          description="Your password has been changed successfully."
        >
          <div className="w-full space-y-6">
            <div className="flex flex-col items-center space-y-4 rounded-lg border border-green-500/20 bg-green-500/10 p-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 animate-bounce">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>

              <div className="space-y-2 text-center">
                <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">
                  All set! 🎉
                </h3>
                <p className="text-sm text-muted-foreground">
                  You can now sign in with your new password.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Redirecting to login in {countdown} seconds...
              </p>

              <Button onClick={() => router.push("/login")} className="w-full">
                Go to Login Now
              </Button>
            </div>
          </div>
        </AuthFormWrapper>
      </AuthLayout>
    );
  }

  // Form state
  return (
    <AuthLayout>
      <AuthFormWrapper
        title="Reset your password"
        description="Enter your new password below."
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                {...form.register("password")}
                className="pl-10 pr-10 h-12 bg-muted/30 border-border"
                autoComplete="new-password"
              />
              {showPassword ? (
                <EyeOff
                  className="absolute right-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  className="absolute right-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            {form.formState.errors.password && (
              <p className="text-xs text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                {...form.register("confirmPassword")}
                className="pl-10 pr-10 h-12 bg-muted/30 border-border"
                autoComplete="new-password"
              />
              {showConfirmPassword ? (
                <EyeOff
                  className="absolute right-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground cursor-pointer"
                  onClick={() => setShowConfirmPassword(false)}
                />
              ) : (
                <Eye
                  className="absolute right-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground cursor-pointer"
                  onClick={() => setShowConfirmPassword(true)}
                />
              )}
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs font-medium text-foreground mb-2">
              Password must contain:
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• At least 8 characters</li>
              <li>• One uppercase letter</li>
              <li>• One lowercase letter</li>
              <li>• One number</li>
              <li>• One special character</li>
            </ul>
          </div>

          {/* Reset Password Button */}
          <Button
            type="submit"
            className="w-full h-12"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-foreground hover:underline"
            >
              Back to login
            </Link>
          </div>
        </form>
      </AuthFormWrapper>
    </AuthLayout>
  );
}