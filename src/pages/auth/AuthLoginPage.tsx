import {
  GraduationCap,
  EyeOff,
  Shield,
  User,
  Mail,
  Lock,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ROLE_CONFIGS } from "@/types/authTypes";
import { useLogin } from "@/hooks/api/useAuthAPI";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { ThemeButton } from "@/components/ThemeButton";
import type { ILoginCredentials } from "@/types/authTypes";
import type { TUserRole } from "@sluk/src/types/userTypes";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginCredentials>({
    defaultValues: { role: "admin", rememberMe: true },
  });

  const [selectedRole, setSelectedRole] = useState<TUserRole>("admin");
  const [showPassword, setShowPassword] = useState(false);

  const _handleSubmit = async ({
    email,
    password,
    rememberMe,
  }: ILoginCredentials) => {
    // Validation
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await login.mutateAsync({
        email,
        password,
        rememberMe,
        role: selectedRole,
      });

      toast.success("Login successful!");

      // Navigate based on role
      if (selectedRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
    }
  };

  const roleIcons = {
    staff: User,
    admin: Shield,
  };

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

          {/* Role Selection */}
          <div className="mb-5">
            <Label className="text-sm font-medium text-foreground mb-2 block">
              Sign in as
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(ROLE_CONFIGS) as TUserRole[]).map((role) => {
                const config = ROLE_CONFIGS[role];
                const Icon = roleIcons[role];
                const isSelected = selectedRole === role;

                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all text-center",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/30 hover:bg-muted/50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isSelected ? "text-primary" : "text-foreground",
                      )}
                    >
                      {config.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-tight">
                      {config.description}
                    </span>
                  </button>
                );
              })}
            </div>
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
                  disabled={login.isPending}
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
                  disabled={login.isPending}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="rememberMe"
                  render={({ formState }) => (
                    <Checkbox id="remember" disabled={formState.isLoading} />
                  )}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <Link
                to="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11"
              disabled={login.isPending}
            >
              {login.isPending ? "Signing in..." : "Sign In"}
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
