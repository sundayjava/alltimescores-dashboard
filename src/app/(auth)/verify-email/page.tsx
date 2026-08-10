"use client";

import { useEffect, useState } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import Link from "next/link";
import { Mail, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { maskEmail } from "@/lib/mask-email";
import { getErrorMessage } from "@/lib/error-handler";
import confetti from "canvas-confetti";
import { useResendVerification } from "@/hooks/auth/use-resend-verification";
import { useVerifyEmail } from "@/hooks/auth/use-verify-email";

type VerificationState = "pending" | "verifying" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams.get("token");
  const email = searchParams.get("email") || "";
  
  const [state, setState] = useState<VerificationState>("pending");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  
  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendVerification();

  // Auto-verify if token exists
  useEffect(() => {
    if (token) {
      handleAutoVerification(token);
    }
  }, [token]);

  // Countdown and redirect after success
  useEffect(() => {
    if (state === "success" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    if (state === "success" && countdown === 0) {
      router.push("/login");
    }
  }, [state, countdown, router]);

  // Confetti animation on success
  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const handleAutoVerification = async (verificationToken: string) => {
    setState("verifying");
    
    try {
      const response = await verifyMutation.mutateAsync(verificationToken);
      
      setState("success");
      triggerConfetti();
      toast.success(response.message || "Email verified successfully!");
      
    } catch (error) {
      setState("error");
      const message = getErrorMessage(error);
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      const response = await resendMutation.mutateAsync(email);
      toast.success(response.message || "Verification email sent!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleRetry = () => {
    if (token) {
      handleAutoVerification(token);
    }
  };

  // Render based on state
  if (state === "verifying") {
    return (
      <AuthLayout>
        <AuthFormWrapper
          title="Verifying your email"
          description="Please wait while we verify your email address..."
        >
          <div className="flex flex-col items-center space-y-6 py-8">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              This will only take a moment
            </p>
          </div>
        </AuthFormWrapper>
      </AuthLayout>
    );
  }

  if (state === "success") {
    return (
      <AuthLayout>
        <AuthFormWrapper
          title="Email Verified!"
          description="Your account has been successfully verified."
        >
          <div className="w-full space-y-6">
            <div className="flex flex-col items-center space-y-4 rounded-lg border border-green-500/20 bg-green-500/10 p-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 animate-bounce">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">
                  Congratulations! 🎉
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your email has been verified successfully. You can now access all features of your account.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Redirecting to login in {countdown} seconds...
              </p>
              
              <Button
                onClick={() => router.push("/login")}
                className="w-full"
              >
                Go to Login Now
              </Button>
            </div>
          </div>
        </AuthFormWrapper>
      </AuthLayout>
    );
  }

  if (state === "error") {
    return (
      <AuthLayout>
        <AuthFormWrapper
          title="Verification Failed"
          description="We couldn't verify your email address."
        >
          <div className="w-full space-y-6">
            <div className="flex flex-col items-center space-y-4 rounded-lg border border-red-500/20 bg-red-500/10 p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              
              <div className="space-y-2 text-center">
                <h3 className="font-semibold text-red-600 dark:text-red-400">
                  Verification Failed
                </h3>
                <p className="text-sm text-muted-foreground">
                  {errorMessage || "The verification link is invalid or has expired."}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="default"
                className="w-full"
                onClick={handleRetry}
                disabled={verifyMutation.isPending}
              >
                {verifyMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  "Try Again"
                )}
              </Button>

              {email && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResend}
                  disabled={resendMutation.isPending}
                >
                  {resendMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
              )}
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm font-medium text-foreground hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </AuthFormWrapper>
      </AuthLayout>
    );
  }

  // Default: Pending state (came from signup, no token)
  return (
    <AuthLayout>
      <AuthFormWrapper
        title="Check your email"
        description="We've sent a verification link to your email address."
      >
        <div className="w-full space-y-6">
          <div className="flex flex-col items-center space-y-4 rounded-lg border border-border bg-muted/30 p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            
            <div className="space-y-2 text-center">
              <h3 className="font-semibold">
                Verification email sent{email && ` to ${maskEmail(email)}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                Please check your inbox and click the verification link to activate your account.
              </p>
            </div>
          </div>

          {email && (
            <div className="space-y-3">
              <p className="text-center text-sm text-muted-foreground">
                Didn't receive the email?
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResend}
                disabled={resendMutation.isPending}
              >
                {resendMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Verification Email"
                )}
              </Button>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-foreground hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </AuthFormWrapper>
    </AuthLayout>
  );
}