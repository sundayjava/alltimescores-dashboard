"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupSchema } from "@/schemas/signup.schema";
import { useSignup } from "@/hooks/auth/use-signup";
import { useGoogleAuth } from "@/hooks/auth/use-google-auth";
import { useGoogleIdentity } from "@/hooks/auth/use-google-identity";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-handler";

export function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const registerMutation = useSignup();
    const googleAuthMutation = useGoogleAuth();

    const handleGoogleCredential = async (idToken: string) => {
        try {
            await googleAuthMutation.mutateAsync({ idToken });
            toast.success("Welcome! Account created successfully.");
        } catch (error) {
            console.error(error);
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
        }
    };

    const { onScriptLoad, buttonRef } = useGoogleIdentity({
        onCredential: handleGoogleCredential,
    });

    const form = useForm<SignupSchema>({
        resolver: zodResolver(signupSchema),

        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: SignupSchema) => {
        try {
            const response = await registerMutation.mutateAsync(values);

            // Show success message from API or default
            toast.success(response.data.message || "Account created successfully! Please check your email to verify your account.");

        } catch (error) {
            console.error(error);

            // Extract error message from API response or use default
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
        }
    };

    const isSubmitting = registerMutation.isPending;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">

            <div className="grid gap-2 grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                        First Name
                    </Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            {...form.register("firstName")}
                            className="pl-10 h-12 bg-muted/30 border-border"
                            required
                            autoComplete="given-name"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                        Last Name
                    </Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            {...form.register("lastName")}
                            className="pl-10 h-12 bg-muted/30 border-border"
                            required
                            autoComplete="family-name"
                        />
                    </div>
                </div>
            </div>
            {
                form.formState.errors.firstName && (
                    <p className="text-xs text-red-500">
                        {form.formState.errors.firstName.message}
                    </p>
                )
            }
            {
                form.formState.errors.lastName && (
                    <p className="text-xs text-red-500">
                        {form.formState.errors.lastName.message}
                    </p>
                )
            }

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
                        placeholder="John@example.com"
                        {...form.register("email")}
                        className="pl-10 h-12 bg-muted/30 border-border"
                        required
                        autoComplete="email"
                    />
                </div>
                {
                    form.formState.errors.email && (
                        <p className="text-xs text-red-500">
                            {form.formState.errors.email.message}
                        </p>
                    )
                }
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                </Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••"
                        {...form.register("password")}
                        className="pl-10 h-12 bg-muted/30 border-border"
                        required
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
                {
                    form.formState.errors.password && (
                        <p className="text-xs text-red-500">
                            {form.formState.errors.password.message}
                        </p>
                    )
                }
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm Password
                </Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••"
                        {...form.register("confirmPassword")}
                        className="pl-10 h-12 bg-muted/30 border-border"
                        required
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
                {
                    form.formState.errors.confirmPassword && (
                        <p className="text-xs text-red-500">
                            {form.formState.errors.confirmPassword.message}
                        </p>
                    )
                }
            </div>

            {/* Sign In Button */}
            <Button disabled={isSubmitting} type="submit" className="w-full h-12 bg-black cursor-pointer hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90 font-medium">
                {isSubmitting ? "Creating account..." : "Sign up"}
            </Button>

            {/* Sign Up & Forgot Password Links */}
            <div className="flex flex-col items-center sm:justify-between gap-2 text-sm pt-1">
                <p className="text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium cursor-pointer text-foreground hover:underline">
                        Login
                    </Link>
                </p>
            </div> 

            {/* Social Logins */}
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                onLoad={onScriptLoad}
            />
            <div className="pt-2">
                <div className="flex items-center justify-center gap-4">
                    {/* Google */}
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors shadow-sm overflow-hidden">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 pointer-events-none">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        {/* Real Google button, invisible, layered on top so clicks are trusted by Google */}
                        <div
                            ref={buttonRef}
                            className="absolute inset-0 flex items-center justify-center opacity-0 scale-125 cursor-pointer [&>div]:cursor-pointer"
                            aria-label="Sign in with Google"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}