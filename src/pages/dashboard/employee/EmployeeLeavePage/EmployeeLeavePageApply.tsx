import { useApplyLeaveAPI, useLeaveBalancesAPI } from "@/hooks/api/useEmployeeLeaveAPI";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TLeaveApplication } from "@/types/leave-managementTypes";
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { SelectFilter } from "@/components/SelectFilter"
import { useForm, Controller } from "react-hook-form";
import { SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner";

function EmployeeLeaveBalanceFilter() {
    const data = useLeaveBalancesAPI("staff_2");
    return data.map(type => (
        <SelectItem key={type.leaveTypeId} value={type.leaveTypeId}>
            {type.name}
        </SelectItem>
    ))
}


export function EmployeeLeavePageApply({ isDialog, setDialog }: {
    isDialog: boolean,
    setDialog: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const {
        reset,
        control,
        register,
        clearErrors,
        handleSubmit,
        formState: { errors }
    } = useForm<TLeaveApplication>()
    const { mutateAsync: applyLeave, isPending: isApplyingLeave } = useApplyLeaveAPI();

    const onSubmit = async (data: TLeaveApplication) => {
        clearErrors();
        await applyLeave(
            {
                ...data,
                staffId: "staff_2"
            },
            {
                onSuccess: () => {
                    reset();
                    setDialog(false);
                    toast.success('Applied Leave.', { description: "We've successful send your leave request, please stay tune for approval." })
                },
                onError: () => {
                    toast.error('Failed to applied.', { description: "Sorry, we could not be able to apply your leave request at the money, might be a network issue. please try again." })
                }
            }
        )
    }

    return (
        <Dialog open={isDialog}>
            <DialogContent>
                {/* CLOSE */}
                <CardHeader className="border-b">
                    <CardTitle>Apply for Leave</CardTitle>
                </CardHeader>

                <CardContent>
                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        {/* TYPE */}
                        <Field className="space-y-1 flex items-center gap-2">
                            <FieldLabel className="flex flex-col items-start w-full text-sm font-medium text-muted-foreground">
                                Leave Type
                                <Controller
                                    name="leaveTypeId"
                                    control={control}
                                    rules={{ required: "Leave type is required." }}
                                    render={({ field }) => (
                                        <SelectFilter
                                            triggerClassName="w-full"
                                            placeholder={'Select Leave Type.'}
                                            onValueChange={field.onChange}>
                                            <EmployeeLeaveBalanceFilter />
                                        </SelectFilter>
                                    )}
                                />
                                {errors.leaveTypeId && (
                                    <FieldError className="text-xs">
                                        {errors.leaveTypeId.message as string}
                                    </FieldError>
                                )}
                            </FieldLabel>
                        </Field>

                        {/* DATES */}
                        <Field className="grid grid-cols-2 gap-4">
                            <FieldLabel className="flex flex-col items-start space-y-1 text-sm font-medium text-muted-foreground">
                                Start Date
                                <Input
                                    type="date"
                                    {...register("startDate", { required: "Select the start date." })}
                                    className="w-full border border-border bg-background rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                                />
                                {errors.startDate && (
                                    <FieldError className="text-xs">
                                        {errors.startDate.message as string}
                                    </FieldError>
                                )}
                            </FieldLabel>

                            <FieldLabel className="flex flex-col items-start space-y-1 text-sm font-medium text-muted-foreground">
                                End Date
                                <Input
                                    type="date"
                                    {...register("endDate", { required: "Select the end date." })}
                                    className="w-full border border-border bg-background rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                                />
                                {errors.startDate && (
                                    <FieldError className="text-xs">
                                        {errors.endDate?.message as string}
                                    </FieldError>
                                )}
                            </FieldLabel>
                        </Field>

                        {/* REASON */}
                        <FieldLabel className="flex flex-col items-start w-full text-sm font-medium text-muted-foreground">
                            Reason
                            <Textarea
                                placeholder="Briefly describe reason for leave..."
                                {...register("reason", { required: "Provide reason for leaving." })}
                                className="w-full border border-border bg-background rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.reason && (
                                <FieldError className="text-xs">
                                    {errors.reason?.message as string}
                                </FieldError>
                            )}
                        </FieldLabel>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant={'destructive'}
                                disabled={isApplyingLeave}
                                onClick={() => setDialog(false)}
                                className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={isApplyingLeave}
                            >
                                {isApplyingLeave ? "Submitting..." : "Submit Request"}
                            </Button>
                        </DialogFooter>
                    </form>
                </CardContent>
            </DialogContent>
        </Dialog>
    )
}
