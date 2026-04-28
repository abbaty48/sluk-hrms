import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/api/useAuthAPI";
import { type ReactNode } from "react";

interface ProtectedRouteProps {
  children?: ReactNode;
  redirectTo?: string;
  requiredRole?: "staff" | "admin";
}

// Root redirect component - redirects to appropriate dashboard based on role
export function RootRedirect() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  // Admins default to /admin, but they can navigate to /employee too
  // Regular staff go to /employee only
  const defaultRoute = isAdmin ? "/admin" : "/employee";
  return <Navigate to={defaultRoute} replace />;
}

// Protected route component
export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, role, isAdmin } = useAuth();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirements if specified
  if (requiredRole === "admin") {
    // Only admins can access
    if (!isAdmin) {
      return <Navigate to="/employee" replace />;
    }
  } else if (requiredRole === "staff") {
    // Both admins and staff can access
    // (Admins are also employees, so they can see employee routes)
    if (!isAdmin && role !== "staff") {
      return <Navigate to="/auth/login" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
}

// Admin-only route guard
// Only users with "admin" role can access
export function AdminRoute({ children }: { children?: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin" redirectTo="/employee">
      {children}
    </ProtectedRoute>
  );
}

// Employee route guard
// Both "admin" and "staff" roles can access
// (Admins can view employee routes to see their own employee data)
export function EmployeeRoute({ children }: { children?: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="staff" redirectTo="/auth/login">
      {children}
    </ProtectedRoute>
  );
}

// Public route (redirect to dashboard if already authenticated)
export function PublicRoute({
  children,
  redirectTo,
}: {
  children?: ReactNode;
  redirectTo?: string;
}) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated) {
    const defaultRoute = redirectTo || (isAdmin ? "/admin" : "/employee");
    return <Navigate to={defaultRoute} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
