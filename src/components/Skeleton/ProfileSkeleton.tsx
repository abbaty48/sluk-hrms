export  function ProfileSkeleton() {
  return (
    <div className="space-y-6 m-6">

      {/* Header Card Skeleton */}
      <div className="bg-card rounded-xl shadow p-6 flex items-center gap-6 animate-pulse">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-muted shimmer"></div>

        {/* Name & Info */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-6 w-48 bg-muted shimmer rounded-md"></div>
          <div className="h-4 w-32 bg-muted shimmer rounded-md"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-4">
        <div className="h-8 w-24 bg-muted shimmer rounded-md"></div>
        <div className="h-8 w-24 bg-muted shimmer rounded-md"></div>
        <div className="h-8 w-24 bg-muted shimmer rounded-md"></div>
      </div>

      {/* Content area skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-full bg-muted shimmer rounded-md"></div>
        <div className="h-4 w-full bg-muted shimmer rounded-md"></div>
        <div className="h-4 w-3/4 bg-muted shimmer rounded-md"></div>
      </div>
    </div>
  );
}