import { clsx } from "clsx";
export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  className,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  actionLabel?: string;
  className?: string;
  onAction?: () => void;
}) {
  return (
    <div className={clsx(className, "text-center py-12")}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-9 px-4 text-sm font-medium hover:bg-primary/90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
