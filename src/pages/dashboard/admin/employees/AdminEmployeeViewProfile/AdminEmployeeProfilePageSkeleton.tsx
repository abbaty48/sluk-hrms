import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

type TPageProps = {
    handleEdit?: () => void;
    handleBack: () => void;
    staffId?: string;
}

export function AEVPSkeleton({ staffId, handleBack }: TPageProps) {

    return (
        <div className="p-4">
            {/* Header Skeleton */}
            <div className="flex items-center gap-3 mb-6">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="page-title">Employee Profile</h1>
                    <p className="page-subtitle">Retrieving -&gt; {staffId}</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="shimmer h-9 w-20 rounded-md" />
                    <div className="shimmer h-9 w-16 rounded-md" />
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card Skeleton */}
                <Card className="flex flex-col items-center text-center py-8 gap-4">
                    <div className="shimmer h-24 w-24 rounded-full" />
                    <div className="w-full flex flex-col items-center gap-2">
                        <div className="shimmer h-6 w-32" />
                        <div className="shimmer h-4 w-24" />
                    </div>
                    <div className="shimmer h-6 w-20 rounded-full" />
                    <Separator />
                    <div className="flex gap-3">
                        <div className="shimmer h-9 w-20 rounded-md" />
                        <div className="shimmer h-9 w-16 rounded-md" />
                    </div>
                </Card>

                {/* Info Cards Skeleton */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-4">
                        {/* <div className="shimmer h-5 w-40 mb-4" /> */}
                        <h3 className="text-sm font-semibold text-card-foreground mb-2">
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-start gap-3 py-3">
                                    <div className="shimmer h-9 w-9 rounded-lg" />
                                    <div className="flex-1">
                                        <div className="shimmer h-3 w-20 mb-1" />
                                        <div className="shimmer h-4 w-32" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-4">
                        <h3 className="text-sm font-semibold text-card-foreground mb-2">
                            Work Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-start gap-3 py-3">
                                    <div className="shimmer h-9 w-9 rounded-lg" />
                                    <div className="flex-1">
                                        <div className="shimmer h-3 w-20 mb-1" />
                                        <div className="shimmer h-4 w-32" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
