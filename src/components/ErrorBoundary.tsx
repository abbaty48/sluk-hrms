import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { ErrorBoundary } from "react-error-boundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { AlertCircle, Home, RefreshCw, ChevronDownIcon, MessageSquareWarning } from "lucide-react";

function ErrorDetail({ error }: { error: any }) {
  return (
    <Collapsible className="data-[state=open]:bg-muted rounded-md">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="group w-full rounded-bl-0">
          Error details
          <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-3 pt-0 text-sm">
        <p className="p-3">
          Reason: {String(error)}, if the error persist, please
          contact the developers.
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function QueryErrorBoundary({
  message,
  children,
  fallbackError,
}: {
  message?: ReactNode;
  children: ReactNode;
  fallbackError?: ReactNode;
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) =>
            fallbackError ?? (
              <div className="flex flex-col items-center justify-center-safe gap-4 text-center text-destructive p-4 mx-auto">
                <header>
                  <h2>
                    {message ?? (
                      <>
                        <MessageSquareWarning /> Whoops, something went wrong
                        getting data's here.
                      </>
                    )}
                  </h2>
                  <Button
                    variant={"default"}
                    onClick={() => {
                      resetErrorBoundary();
                    }}
                    className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/50 cursor-pointer"
                  >
                    Try again.
                  </Button>
                </header>
                <ErrorDetail error={error} />
              </div>
            )}
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
          <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
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
