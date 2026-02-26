import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense, useState, type PropsWithChildren, type ReactNode } from "react";

type Props<T> = PropsWithChildren & {
    title: string;
    chart: any
    fallback: ReactNode;
    onDownload: (data: T[]) => void;
}

export function ARAPChart<T>({ title, fallback, onDownload, chart }: Props<T>) {
    const [data, setData] = useState<T[]>([]);
    const Child = chart;

    return <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-card-foreground">
                {title}
            </h3>
            {data && data.length > 0 &&
                <Button variant="ghost" size="sm" onClick={() => onDownload(data)} className="text-xs gap-1">
                    <Download className="h-3.5 w-3.5" />
                    Download
                </Button>
            }
        </div>
        <QueryErrorBoundary>
            <Suspense fallback={fallback}>
                <Child setData={setData} />
            </Suspense>
        </QueryErrorBoundary>
    </Card>
}
