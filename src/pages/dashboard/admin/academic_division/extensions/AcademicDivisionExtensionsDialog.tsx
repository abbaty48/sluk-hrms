import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@sluk/src/components/ui/select";
import type {
  TExtensionRequest,
  TExtensionRequestForm,
} from "@sluk/src/types/academicDivisionTypes";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@sluk/src/components/ui/textarea";
import { SelectFilter } from "@sluk/src/components/SelectFilter";
import type { ErrorResponseType } from "@/types/errorResponseType";
import { StaffSelectItems } from "@sluk/src/components/StaffSelectItems";
import { useExtensionRequestUPSERTAPI } from "@/hooks/api/useAcademicDivisionAPI";

type extensionRequestDialogProps = {
  open: boolean;
  extensionRequest?: TExtensionRequest;
  onOpenChange: (open: boolean) => void;
};

export function ExtensionDialog({
  open,
  extensionRequest,
  onOpenChange,
}: extensionRequestDialogProps) {
  const defaultValues = extensionRequest
    ? {
        status: extensionRequest.status,
        reason: extensionRequest.reason,
        staffId: extensionRequest.staff.id,
        extension: extensionRequest.extension,
        durationMonths: extensionRequest.durationMonths,
      }
    : ({
        extension: "First",
        durationMonths: 6,
        reason: null,
      } as TExtensionRequestForm);

  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TExtensionRequestForm>();

  /** */
  const { mutateAsync: upsertMutateAsync, isPending: isAdding } =
    useExtensionRequestUPSERTAPI();
  /**
   *
   */
  const onSubmit = async (data: TExtensionRequestForm) => {
    const { action, success, payload } = {
      payload: data,
      action: extensionRequest ? "UPDATE" : "CREATE",
      success: {
        title: "Successful Added",
        description: "Successful add the new extension request.",
      },
    };

    // we're posting a new type
    await upsertMutateAsync(
      {
        action: action as "CREATE" | "UPDATE",
        payload,
        id: extensionRequest?.id,
      },
      {
        onSuccess: () => {
          toast.success(success.title, { description: success.description });
          reset();
          onOpenChange(false);
        },
        onError: (err: any) => {
          const error = err as ErrorResponseType;
          toast.error(error.errorTitle, {
            description: error.errorMessage,
            duration: 10000,
          });
        },
      },
    );
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
            {extensionRequest ? "Edit Extension" : "Add New Extension"}
          </DialogTitle>
          <DialogDescription>
            {extensionRequest
              ? "Update the extension details."
              : "Add a new extension request."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* New Extension Request */}
            <Field className="">
              <FieldLabel>
                Staff Member <span className="text-red-500">*</span>
              </FieldLabel>
              <Controller
                name="staffId"
                control={control}
                rules={{ required: "Staff member is required." }}
                render={({ field }) => (
                  <SelectFilter
                    placeholder={"Select staff member"}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <StaffSelectItems
                      render={({ title, firstName, lastName, rank }) => (
                        <p className="py-2 border-b">
                          {title} {[firstName, lastName].join(" ")} - ({rank})
                        </p>
                      )}
                    ></StaffSelectItems>
                  </SelectFilter>
                )}
              />
              {errors.staffId && !isAdding && (
                <p className="text-xs text-destructive">
                  {errors.staffId.message as string}
                </p>
              )}
            </Field>

            <div className="grid grid-cols-2 gap-2">
              {/* Types */}
              <Field>
                <FieldLabel>
                  Extension Type <span className="text-red-500">*</span>
                </FieldLabel>
                <Controller
                  name="extension"
                  control={control}
                  rules={{ required: "Request extension is required." }}
                  render={({ field }) => (
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Extension Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="First">First Extension</SelectItem>
                        <SelectItem value="Second">Second Extension</SelectItem>
                        <SelectItem value="Final">Final Extension</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.extension && !isAdding && (
                  <p className="text-xs text-destructive">
                    {errors.extension.message as string}
                  </p>
                )}
              </Field>
              {/* Duration (Months) */}
              <Field>
                <FieldLabel>
                  Duration Months <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  type="number"
                  disabled={isAdding}
                  defaultValue={defaultValues.durationMonths}
                  {...register("durationMonths", {
                    min: {
                      value: 1,
                      message: "Months must be not less than 1.",
                    },
                    max: {
                      value: 24,
                      message: "Months must be less than or equal to 24.",
                    },
                    valueAsNumber: true,
                  })}
                />
                {errors.durationMonths && !isAdding && (
                  <p className="text-xs text-destructive">
                    {errors.durationMonths.message}
                  </p>
                )}
              </Field>
            </div>

            {/* Reason */}
            <Field>
              <FieldLabel>
                Reason <span className="text-red-500">*</span>
              </FieldLabel>
              <Textarea
                defaultValue={defaultValues.reason ?? ""}
                placeholder="Explain the reason for extension."
                {...register("reason", {
                  required: "Provide a Reason for extenssion request.",
                })}
              />
            </Field>
          </div>
          <input type="hidden" name="id" value={extensionRequest?.id} />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isAdding}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isAdding}>
              {extensionRequest ? "Update" : "Add"} Extension Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
