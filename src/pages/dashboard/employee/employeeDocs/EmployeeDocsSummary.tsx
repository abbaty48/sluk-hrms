
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStaffDocument } from "@/hooks/api/useDocumentEmployee"
import { QueryErrorBoundary } from "@/components/ErrorBoundary"
import { Suspense } from "react"

function SummaryShimmer() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 px-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border rounded-xl p-6 space-y-4">
          <div className="h-4 w-28 rounded shimmer" />
          <div className="h-6 w-12 rounded shimmer" />
        </div>
      ))}
    </div>
  )
}

function DocumentsSummary() {
  const data = useStaffDocument("staff_2")

  const docs = data?.data ?? []

  const cards = [
    { name: "Certificates",        count: docs.filter(d => d.category === "Certificates").length },
    { name: "Appointment Letters", count: docs.filter(d => d.category === "Appointment Letters").length },
    { name: "ID & Photos",         count: docs.filter(d => d.category === "ID & Photos").length },
    { name: "Other Documents",     count: docs.filter(d => d.category === "Other Documents").length },
  ]

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 px-2">
      {cards.map(card => (
        <Card key={card.name}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-muted-foreground">
              {card.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{card.count}</span>
            <p className="text-xs text-muted-foreground mt-1">files</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function EmployeeDocumentsSummary() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<SummaryShimmer />}>
        <DocumentsSummary />
      </Suspense>
    </QueryErrorBoundary>
  )
}