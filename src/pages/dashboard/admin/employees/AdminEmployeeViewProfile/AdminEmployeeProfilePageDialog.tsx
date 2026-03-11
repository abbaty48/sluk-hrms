import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useStaffUpdateStaffStatus } from "@/hooks/api/useAdminStaffApi";
import type { TStaffStatus } from "@/types/staffTypes";
import { FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { toast } from "sonner";

export function AEPDialog({ employeeId, employeeName, employeeStatus,
    openChangeStatus, setOpenChangeStatus }: {
        employeeId: string;
        employeeName: string;
        employeeStatus: string;
        openChangeStatus: boolean;
        setOpenChangeStatus: React.Dispatch<React.SetStateAction<boolean>>;
    }) {


    const { mutateAsync: updateStatus, isPending, isError } = useStaffUpdateStaffStatus();

    const [statusChangeState, handleStatusChange] = useActionState(async (prevState: any, payload: any) => {
        const status = payload.get('status') as TStaffStatus;
        await updateStatus(
            {
                staffId: employeeId,
                status,
            },
            {
                onSuccess: () => {
                    toast.success(`Employee status updated to ${status}`);
                    setOpenChangeStatus(false);
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to update status");
                },
            }
        );
        return { ...prevState, success: true };
    }, { error: null, success: false });

    return (
        <Dialog open={openChangeStatus} onOpenChange={setOpenChangeStatus}>
            <DialogContent>
                <DialogTitle>
                    <p className="page-title">Change Employee Status</p>
                    <p className="page-subtitle">Update status for {employeeName} </p>
                </DialogTitle>
                <form className="space-y-5" action={handleStatusChange}>
                    <Select name="status" defaultValue={employeeStatus} disabled={isPending}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Employed">Active</SelectItem>
                            <SelectItem value="On Leave">On Leave</SelectItem>
                            <SelectItem value="Resigned">Resigned</SelectItem>
                            <SelectItem value="Retired">Retired</SelectItem>
                            <SelectItem value="Terminated">Terminated</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button disabled={isPending}>
                        Update Status
                    </Button>
                    {isError && (
                        <FieldError>
                            {statusChangeState.error && statusChangeState.error}
                        </FieldError>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}
