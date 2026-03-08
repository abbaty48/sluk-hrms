import {
  Bug,
  Home,
  WifiOff,
  RefreshCw,
  ChevronUp,
  AlertCircle,
  ChevronDown,
  ShieldAlert,
  ServerCrash,
  FileQuestion,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

// Error type detection
function getErrorType(error: Error): {
  type: "network" | "server" | "not-found" | "auth" | "validation" | "unknown";
  status?: number;
} {
  const message = error.message.toLowerCase();

  // Network errors
  if (
    message.includes("network") ||
    message.includes("fetch") ||
    message.includes("cors") ||
    message.includes("timeout")
  ) {
    return { type: "network" };
  }

  // Status code errors
  if (message.includes("404")) {
    return { type: "not-found", status: 404 };
  }

  if (
    message.includes("401") ||
    message.includes("403") ||
    message.includes("unauthorized")
  ) {
    return { type: "auth", status: 401 };
  }

  if (
    message.includes("500") ||
    message.includes("502") ||
    message.includes("503")
  ) {
    return { type: "server", status: 500 };
  }

  if (
    message.includes("validation") ||
    message.includes("invalid") ||
    message.includes("bad request")
  ) {
    return { type: "validation", status: 400 };
  }

  return { type: "unknown" };
}

// Error configuration
const ERROR_CONFIG = {
  network: {
    icon: WifiOff,
    title: "Connection Problem",
    message:
      "Unable to connect to the server. Please check your internet connection.",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  server: {
    icon: ServerCrash,
    title: "Server Error",
    message: "Our servers are having trouble. We're working on fixing this.",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  "not-found": {
    icon: FileQuestion,
    title: "Not Found",
    message: "The data you're looking for doesn't exist or has been removed.",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  auth: {
    icon: ShieldAlert,
    title: "Authentication Required",
    message: "You need to be logged in to access this data.",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  validation: {
    icon: AlertCircle,
    title: "Invalid Request",
    message: "The request contains invalid data. Please try again.",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  unknown: {
    icon: Bug,
    title: "Something Went Wrong",
    message: "An unexpected error occurred while loading the data.",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
};

interface ErrorDetailProps {
  error: Error;
}

function ErrorDetail({ error }: ErrorDetailProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDetails(!showDetails)}
        className="text-muted-foreground hover:text-foreground"
      >
        {showDetails ? (
          <>
            <ChevronUp className="h-4 w-4 mr-2" />
            Hide Details
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4 mr-2" />
            Show Technical Details
          </>
        )}
      </Button>

      {showDetails && (
        <Card className="mt-4 p-4 bg-muted/50 border-destructive/20">
          <div className="space-y-2 text-left">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                Error Message:
              </p>
              <p className="text-sm font-mono text-destructive wrap-break-word">
                {error.message}
              </p>
            </div>

            {error.stack && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  Stack Trace:
                </p>
                <pre className="text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap wrap-break-word max-h-40 overflow-y-auto">
                  {error.stack}
                </pre>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

interface QueryErrorBoundaryProps {
  children: ReactNode;
  message?: ReactNode;
  showRetry?: boolean;
  showDetails?: boolean;
  fallbackError?: ReactNode;
  onError?: (error: Error) => void;
}

export function QueryErrorBoundary({
  onError,
  message,
  children,
  fallbackError,
  showRetry = true,
  showDetails = true,
}: QueryErrorBoundaryProps) {
  const [retryCount, setRetryCount] = useState(0);

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={() => {
            setRetryCount((prev) => prev + 1);
            reset();
          }}
          onError={onError?.call}
          fallbackRender={({ error, resetErrorBoundary }) => {
            if (fallbackError) {
              return <>{fallbackError}</>;
            }

            const errorInfo = getErrorType(error as Error);
            const config = ERROR_CONFIG[errorInfo.type];
            const Icon = config.icon;

            return (
              <div className="flex items-center justify-center min-h-100 p-4">
                <Card className="max-w-md w-full p-6 shadow-lg">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Error Icon */}
                    <div
                      className={cn(
                        "flex items-center justify-center w-16 h-16 rounded-full",
                        config.bgColor,
                      )}
                    >
                      <Icon className={cn("h-8 w-8", config.color)} />
                    </div>

                    {/* Error Title */}
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-foreground">
                        {message || config.title}
                      </h2>

                      {/* Status Badge */}
                      {errorInfo.status && (
                        <Badge variant="outline" className="text-xs">
                          Error {errorInfo.status}
                        </Badge>
                      )}
                    </div>

                    {/* Error Message */}
                    <p className="text-sm text-muted-foreground max-w-sm">
                      {config.message}
                    </p>

                    {/* Retry Count */}
                    {retryCount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Retry attempts: {retryCount}
                      </p>
                    )}

                    {/* Action Buttons */}
                    {showRetry && (
                      <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <Button
                          onClick={resetErrorBoundary}
                          className="flex-1"
                          size="lg"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Try Again
                        </Button>

                        {errorInfo.type === "auth" && (
                          <Button
                            onClick={() =>
                              (window.location.href = "/auth/login")
                            }
                            variant="outline"
                            className="flex-1"
                            size="lg"
                          >
                            <ShieldAlert className="h-4 w-4 mr-2" />
                            Login
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Technical Details (Dev only) */}
                    {showDetails && <ErrorDetail error={error as Error} />}
                  </div>
                </Card>
              </div>
            );
          }}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

// Compact variant for inline errors
export function InlineQueryErrorBoundary({
  children,
  message,
}: {
  children: ReactNode;
  message?: string;
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => {
            const errorInfo = getErrorType(error as Error);
            const config = ERROR_CONFIG[errorInfo.type];
            const Icon = config.icon;

            return (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <Icon className="h-5 w-5 text-destructive shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {message || config.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {config.message}
                  </p>
                </div>
                <Button
                  onClick={resetErrorBoundary}
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            );
          }}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

/**
 *
 */

// Global Error Boundary Component
export function RootErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    // React Router error (404, etc.)
    if (error.status === 404) {
      return <NotFoundPage />;
    }

    if (error.status === 401) {
      return <UnauthorizedPage />;
    }

    if (error.status === 503) {
      return <ServiceUnavailablePage />;
    }

    // Generic route error
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-muted-foreground mb-6">
            {error.statusText || "An unexpected error occurred"}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload Page
            </Button>
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // JavaScript Error
  let errorMessage = "Unknown error";
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-2">
          An unexpected error occurred. Please try again.
        </p>
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm font-medium mb-2">
              Error Details (Development Only)
            </summary>
            <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
              {errorMessage}
            </pre>
          </details>
        )}
        <div className="flex gap-3 justify-center mt-6">
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload Page
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

// 404 Not Found Page
export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full p-6 text-center">
        <div className="mb-6">
          <h1 className="text-8xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

// 401 Unauthorized Page
export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full p-6 text-center">
        <div className="mb-6">
          <h1 className="text-8xl font-bold text-warning mb-2">401</h1>
          <h2 className="text-2xl font-semibold mb-2">Unauthorized</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this page. Please log in or
            contact your administrator.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
          <Button asChild>
            <Link to="/auth/login">Login</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

// 503 Service Unavailable
export function ServiceUnavailablePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full p-6 text-center">
        <div className="mb-6">
          <h1 className="text-8xl font-bold text-destructive mb-2">503</h1>
          <h2 className="text-2xl font-semibold mb-2">Service Unavailable</h2>
          <p className="text-muted-foreground">
            The service is temporarily unavailable. Please try again later.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Loading fallback for lazy routes
export function RouteLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-100">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
