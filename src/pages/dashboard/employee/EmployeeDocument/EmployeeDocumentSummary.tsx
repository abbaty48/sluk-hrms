import {
  Image,
  FileText,
  AwardIcon,
  FileExclamationPoint,
  FileChartColumnIncreasing,
} from "lucide-react";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { useDocumentSummary } from "@sluk/src/hooks/api/useEmployeeDocumentAPI";

function SummaryShimmer() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-6 px-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="flex flex-wrap items-center text-sm gap-2">
            <div className="w-8 h-8 shimmer"></div>
            <dd className="flex-1 space-y-2 leading-none">
              <div className="w-8/12 h-4 shimmer"></div>
              <div className="w-1/4 h-2 shimmer"></div>
            </dd>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DocumentSummary() {
  const { data: summary } = useDocumentSummary();

  const summaryStats = [
    {
      key: "totalDocuments",
      name: "Total Documents",
      icon: <FileChartColumnIncreasing />,
      count: summary?.totalDocuments || 0,
    },
    {
      key: "totalPending",
      name: "Total Pending Documents",
      icon: <FileExclamationPoint />,
      count: summary?.totalPendingDocuments,
    },
    {
      key: "cerfiticates",
      name: "Certificates",
      icon: <AwardIcon />,
      count: summary?.categoryDistribution
        ? summary?.categoryDistribution["Certificates"]
        : 0,
    },
    {
      key: "appointmentLetters",
      name: "Appointment Letters",
      icon: <FileText />,
      count: summary?.categoryDistribution
        ? summary?.categoryDistribution["AppointmentLetters"]
        : 0,
    },
    {
      key: "id_photos",
      name: "ID & Photos",
      icon: <Image />,
      count: summary?.categoryDistribution
        ? summary?.categoryDistribution["ID&Photos"]
        : 0,
    },
  ];

  return (
    <>
      {/*DOCUMENT*/}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-6 px-2">
        {summaryStats.map((stat) => (
          <Card key={stat.key}>
            <CardContent className="flex flex-wrap items-center text-sm gap-2">
              {stat.icon}
              <dd className="flex-1 leading-tight">
                <dl>{stat.name}</dl>
                <dl className="text-muted-foreground">{stat.count} files</dl>
              </dd>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

export function EmployeeDocumentSummary() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<SummaryShimmer />}>
        <DocumentSummary />
      </Suspense>
    </QueryErrorBoundary>
  );
}
