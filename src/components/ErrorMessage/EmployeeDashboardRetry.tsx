interface Props {
  message?: string;
  onRetry?: () => void;
}

export  function DashboardError({
  message = "Unable to load employee dashboard.",
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">

      <div className="h-16 w-16 rounded-full flex items-center justify-center bg-destructive/10 text-destructive text-2xl font-bold">
        !
      </div>

      <h2 className="text-lg font-semibold text-foreground">
        Something went wrong
      </h2>

      <p className="text-sm text-muted-foreground max-w-sm">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90 transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}