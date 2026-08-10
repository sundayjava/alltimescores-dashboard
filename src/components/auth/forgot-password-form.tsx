"use client";

import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordSchema } from "@/schemas/forgot-password.schema";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-handler";
import { maskEmail } from "@/lib/mask-email";
import { useForgotPassword } from "@/hooks/auth/use-forgot-password";

export function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const forgotPasswordMutation = useForgotPassword();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordSchema) => {
    try {
      const response = await forgotPasswordMutation.mutateAsync(values);
      setSubmittedEmail(values.email);
      setEmailSent(true);
      toast.success(response.message || "Reset link sent to your email!");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const handleResend = async () => {
    if (!submittedEmail) return;

    try {
      const response = await forgotPasswordMutation.mutateAsync({ email: submittedEmail });
      toast.success(response.message || "Reset link sent again!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // Success state - Email sent
  if (emailSent) {
    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col items-center space-y-4 rounded-lg border border-green-500/20 bg-green-500/10 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>

          <div className="space-y-2 text-center">
            <h3 className="font-semibold text-green-600 dark:text-green-400">
              Check your email
            </h3>
            <p className="text-sm text-muted-foreground">
              We've sent a password reset link to{" "}
              <span className="font-medium text-foreground">
                {maskEmail(submittedEmail)}
              </span>
            </p>
            <p className="text-xs text-muted-foreground pt-2">
              The link will expire in 1 hour for security reasons.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-center text-sm text-muted-foreground">
            Didn't receive the email?
          </p>
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            onClick={handleResend}
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending ? "Sending..." : "Resend Reset Link"}
          </Button>
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  // Form state - Enter email
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...form.register("email")}
            className="pl-10 h-12 bg-muted/30 border-border"
            autoComplete="email"
            autoFocus
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-xs text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Send Reset Link Button */}
      <Button
        type="submit"
        className="w-full h-12 cursor-pointer"
        disabled={forgotPasswordMutation.isPending}
      >
        {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
      </Button>

      {/* Back to Login Link */}
      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </div>
    </form>
  );
}