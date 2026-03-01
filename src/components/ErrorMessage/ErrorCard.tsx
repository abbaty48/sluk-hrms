import { AlertCircle, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ErrorCardProps {
  message?: string
  onRetry?: () => void
}

export function ErrorCard({
  message = "Something went wrong. Please try again.",
  onRetry
}: ErrorCardProps) {
  return (
    <Card className="border-destructive/40 bg-destructive/5">
      <CardContent className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <div className="p-4 rounded-full bg-destructive/10">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Something went wrong</p>
          <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}