import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import type { TLeaveType } from "@/types/leave-managementTypes";
import { useLeaveTypeUPSERTAPI } from "@/hooks/api/useAdminLeave";


type LeaveTypeDialogProps = {
  open: boolean;
  leaveType?: TLeaveType
  onOpenChange: (open: boolean) => void;
};

export function LeaveTypeDialog({
  open,
  leaveType,
  onOpenChange,
}: LeaveTypeDialogProps) {

  const defaultValues = leaveType
    ? {
      name: leaveType.name,
      allowedDays: leaveType.allowedDays,
      carryForward: leaveType.carryForward,
      maxCarryForward: leaveType.maxCarryForward,
    }
    : { name: "", allowedDays: 1, carryForward: false, maxCarryForward: 0 };

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLeaveType>();

  /**
   *
   */
  const [allowCarryForward, setAllowCarryForward] = useState(false);
  /** */
  const { mutateAsync: upsertMutateAsync, isPending: isAdding } = useLeaveTypeUPSERTAPI()
  /**
   *
   */
  const onSubmit = async (data: TLeaveType) => {

    const { action, error, success, payload } = {
      payload: data,
      action: leaveType ? 'UPDATE' : 'CREATE',
      error: { title: 'Failed Adding/Update', description: 'Failed to add/update the leave type: ' },
      success: { title: 'Successful Added/Update', description: 'Successful added/updated the new leave type.' },
    }
    // we're posting a new type
    await upsertMutateAsync({ action: action as 'CREATE' | 'UPDATE', payload, id: payload.id }, {
      onSuccess: () => {
        toast.success(success.title, { description: success.description });
        reset();
        onOpenChange(false);
      },
      onError: (err) => {
        toast.error(error.title, {
          description: error.description + err.message,
          duration: 10000
        });
      }
    })

  };
  /**
   *
   */
  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {leaveType ? "Edit Leave Type" : "Add Leave Type"}
          </DialogTitle>
          <DialogDescription>
            {leaveType
              ? "Update the leave type details."
              : "Add a new leave type with allocated days."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Leave Type Name */}
            <Field>
              <FieldLabel className="grid gap-2">Leave Type Name
                <Input
                  disabled={isAdding}
                  defaultValue={defaultValues.name}
                  placeholder="e.g. Annual Leave"
                  {...register("name", {
                    required: "Leave type name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                />
              </FieldLabel>
              {errors.name && !isAdding && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </Field>

            {/* Allocated Days */}
            <Field>
              <FieldLabel className="grid gap-2">Allocated Days
                <Input
                  type="number"
                  placeholder="e.g. 30"
                  disabled={isAdding}
                  defaultValue={defaultValues.allowedDays}
                  {...register("allowedDays", {
                    required: "Days are required",
                    min: {
                      value: 1,
                      message: "Days must be at least 1",
                    },
                    max: {
                      value: 365,
                      message: "Days cannot exceed 365",
                    },
                    valueAsNumber: true,
                  })}
                />
              </FieldLabel>
              {errors.allowedDays && !isAdding && (
                <p className="text-xs text-destructive">{errors.allowedDays.message}</p>
              )}
            </Field>

            {/* Allow Carry Forward */}
            <Field>
              <FieldLabel className="flex flex-col items-start">
                <span className="flex items-center gap-2">
                  <Input type="checkbox" name="carryForward" disabled={isAdding}
                    defaultChecked={defaultValues.carryForward} className="w-5 h-5"
                    onChange={() => setAllowCarryForward(prev => !prev)} />
                  Allocated Days
                </span>
              </FieldLabel>
              {allowCarryForward &&
                <FieldLabel>
                  Maximum Carry Forward
                  <Input
                    type="number"
                    defaultValue={defaultValues.maxCarryForward}
                    className="flex-1"
                    placeholder="e.g. 30"
                    {...register("maxCarryForward", {
                      required: "Days are required",
                      min: {
                        value: 1,
                        message: "Days must be at least 1",
                      },
                      max: {
                        value: 30,
                        message: "Days cannot exceed 365",
                      },
                      valueAsNumber: true,
                    })}
                  />
                </FieldLabel>
              }
            </Field>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isAdding} onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isAdding}>
              {leaveType ? "Update" : "Add"} Leave Type
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
