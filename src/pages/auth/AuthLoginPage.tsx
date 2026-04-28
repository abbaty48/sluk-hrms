import {
  AuthProvider,
  useAuthContext,
} from "@sluk/src/states/contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiError } from "@sluk/src/lib/api.utils";
import { ThemeButton } from "@/components/ThemeButton";
import type { IAuthCredentials } from "@/types/authTypes";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Eye, Mail, Lock, EyeOff, GraduationCap } from "lucide-react";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, isSubmitting },
  } = useForm<IAuthCredentials>();
  const { login } = useAuthContext();
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const _handleSubmit = async ({ email, password }: IAuthCredentials) => {
    setIsError(false);
    // Validation
    if (!email || !password) {
      return void toast.error("Please enter email and password");
    }

    try {
      await login({ email, password });
      toast.success("Login successful!");
    } catch (error) {
      setIsError(true);
      toast.error((error as ApiError).errorMessage);
    }
  };

  const isLogging = isSubmitted && !isError;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12">
        {/* Logo */}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10">
              <GraduationCap className="h-7 w-7 dark:stroke-secondary-foreground!" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">
                SLU HRMS
              </h1>
              <p className="text-xs text-primary-foreground/60">
                Human Resource Management
              </p>
            </div>
          </div>
          <ThemeButton />
        </div>

        {/* Main Content */}
        <div>
          <h2 className="text-4xl font-bold text-primary-foreground leading-tight mb-4">
            Sule Lamido University
          </h2>
          <p className="text-lg text-primary-foreground/70 dark:text-secondary-foreground max-w-md">
            Centralized Human Resource Management System for efficient staff
            administration, leave tracking, payroll management, and
            institutional reporting.
          </p>
        </div>

        {/* Footer */}
        <p className="text-sm text-primary-foreground/40 dark:text-secondary-foreground">
          © 2026 Sule Lamido University. All rights reserved.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">SLU HRMS</h1>
              <p className="text-xs text-muted-foreground">
                Human Resource Management
              </p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit(_handleSubmit)}>
            {/* Email Field */}
            <Field>
              <FieldLabel
                htmlFor="email"
                className="text-sm font-medium text-foreground mb-1.5 block"
              >
                Email Address
              </FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  autoComplete="email"
                  disabled={isLogging}
                  placeholder="name@slu.edu.ng"
                  {...register("email", {
                    required: "Provide your login email address.",
                  })}
                />
              </div>
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            {/* Password Field */}
            <Field>
              <FieldLabel
                htmlFor="password"
                className="text-sm font-medium text-foreground mb-1.5 block"
              >
                Password
              </FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  className="pl-9 pr-10"
                  disabled={isLogging}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  title="Must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long."
                  {...register("password", {
                    required: "Provide your login password.",
                  })}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.email && (
                <FieldError>{errors.password?.message}</FieldError>
              )}
            </Field>

            {/* Submit Button */}
            <Button type="submit" className="w-full h-11" disabled={isLogging}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Support Link */}
          <p className="text-xs text-muted-foreground text-center mt-8">
            Need help? Contact IT Support at{" "}
            <a
              href="mailto:support@slu.edu.ng"
              className="text-primary hover:underline"
            >
              support@slu.edu.ng
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthenticatePage() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}
