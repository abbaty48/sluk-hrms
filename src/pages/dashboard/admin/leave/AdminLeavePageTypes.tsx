import { useLeaveTypesAPI, useLeaveTypeDeleteAPI } from "@/hooks/api/useAdminLeave";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import type { TLeaveType } from "@/types/leave-managementTypes";
import { LeaveTypeDialog } from "./AdminLeavePageTypeDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@sluk/src/components/ui/card";
import { Pencil, Plus, X } from "lucide-react";
import { Suspense, useState } from "react";
import { toast } from "sonner";

export function AdminLeavePageTypes() {
    return (
        <QueryErrorBoundary>
            <Suspense fallback={<LeaveTypesCardsSkeletonGrid />}>
                <LeaveTypes />
            </Suspense>
        </QueryErrorBoundary>
    )
}


function LeaveTypes() {
    const leaveTypes = useLeaveTypesAPI();
    const [isAddTypeDialogOpen, setIsAddTypeDialogOpen] = useState(false);
    const [editingLeaveType, setEditingLeaveType] = useState<TLeaveType | undefined>();
    const { isPending: isDeletingLeaveType, mutateAsync: deleteLeaveTypeAsync } = useLeaveTypeDeleteAPI()

    const handleEditLeaveType = (type: TLeaveType) => {
        setEditingLeaveType(type);
        setIsAddTypeDialogOpen(true);
    };

    const handleDeleteLeaveType = (id: string) => {
        if (confirm("Are you sure you want to delete this leave type?")) {
            deleteLeaveTypeAsync(id, {
                onSuccess: () => {
                    toast.success('Deleting Successful.', { description: 'Leave type has successfully been deleted.' })
                },
                onError: (error) => {
                    toast.success('Deleting Failed.', { description: 'Leave type has failed to be delete.' + error.message, duration: 10000 })
                }
            })
        }
    };


    return (
        <>
            <Card className="p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-card-foreground">Leave Types</h2>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setEditingLeaveType(undefined);
                            setIsAddTypeDialogOpen(true);
                        }}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Type
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {leaveTypes?.map((type: TLeaveType) => (
                        <div
                            key={type.id}
                            className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-sm"
                        >
                            <span className="font-medium text-card-foreground">{type.name}</span>
                            <span className="text-xs text-muted-foreground">({type.allowedDays}d)</span>
                            <button
                                className="ml-1 text-muted-foreground hover:text-primary transition-colors hover:border hover:scale-110"
                                onClick={() => handleEditLeaveType(type)}
                            >
                                <Pencil className="h-3 w-3" />
                            </button>
                            <button
                                className="ml-1 text-muted-foreground hover:text-destructive transition-colors hover:border hover:scale-110"
                                disabled={isDeletingLeaveType}
                                onClick={() => handleDeleteLeaveType(type.id)}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </Card>
            {/* DIALOG */}
            <LeaveTypeDialog
                open={isAddTypeDialogOpen}
                leaveType={editingLeaveType}
                onOpenChange={setIsAddTypeDialogOpen}
            />
        </>
    )
}

function LeaveTypesCardsSkeletonGrid() {

    function LeaveTypeCardSkeleton() {
        return (
            <Card className="p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="">Leave Types</div>
                    <div className="shimmer h-4 w-4"></div>
                </div>
                <div
                    className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-sm"
                >
                    <div className="shimmer bg-muted w-20 h-4"></div>
                    <div className="shimmer bg-muted w-4 h-4"></div>
                    <div className="shimmer bg-muted w-4 h-4"></div>
                    <div className="shimmer bg-muted w-4 h-4"></div>
                </div>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <LeaveTypeCardSkeleton />
            <LeaveTypeCardSkeleton />
            <LeaveTypeCardSkeleton />
            <LeaveTypeCardSkeleton />
        </div>
    );
}
