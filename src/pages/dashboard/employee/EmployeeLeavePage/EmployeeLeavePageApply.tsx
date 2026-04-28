import {
  useApplyLeaveAPI,
  useLeaveBalancesAPI,
} from "@/hooks/api/useEmployeeLeaveAPI";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import type { ErrorResponseType } from "@sluk/src/types/errorResponseType";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TLeaveApplication } from "@/types/leave-managementTypes";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { SelectFilter } from "@/components/SelectFilter";
import { useForm, Controller } from "react-hook-form";
import { SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function EmployeeLeaveBalanceFilter() {
  const data = useLeaveBalancesAPI();
  return data.map((type) => (
    <SelectItem key={type.leaveTypeId} value={type.leaveTypeId}>
      {type.name}
    </SelectItem>
  ));
}

// UPDATE THE MODAL TO SHOW STUDY LEAVE DETAILS FORM WHEN A STUFY LEAVE TYPE IS SELECTED.

export function EmployeeLeavePageApply({
  isDialog,
  setDialog,
}: {
  isDialog: boolean;
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    reset,
    control,
    register,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<TLeaveApplication>();
  const { mutateAsync: applyLeave, isPending: isApplyingLeave } =
    useApplyLeaveAPI();

  const [onStudyLeave, setOnStudyLeave] = useState(false);

  const onSubmit = async (data: TLeaveApplication) => {
    clearErrors();
    try {
      await applyLeave(
        {
          ...data,
        },
        {
          onSuccess: () => {
            reset();
            setDialog(false);
            toast.success("Applied Leave.", {
              description:
                "We've successful send your leave request, please stay tune for approval.",
            });
          },
        },
      );
    } catch (err) {
      const error = err as ErrorResponseType;
      toast.error(error.errorTitle, { description: error.errorMessage });
    }
  };

  return (
    <Dialog open={isDialog}>
      <DialogContent>
        {/* CLOSE */}
        <CardHeader className="border-b">
          <CardTitle>Apply for Leave</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* TYPE */}
            <Field className="space-y-1 flex items-center gap-2 overflow-y-auto max-h-96">
              <FieldLabel className="flex flex-col items-start w-full text-sm font-medium text-muted-foreground">
                Leave Type
                <Controller
                  name="leaveTypeId"
                  control={control}
                  rules={{ required: "Leave type is required." }}
                  render={({ field }) => (
                    <SelectFilter
                      triggerClassName="w-full"
                      placeholder={"Select Leave Type."}
                      onValueChange={(e) => {
                        field.onChange(e);
                        setOnStudyLeave(e === "lt_5" ? true : false);
                      }}
                    >
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
            {/* STUDY LEAVE*/}

            {onStudyLeave && (
              <div className="border rounded-md p-2 overflow-y-auto max-h-64">
                <p className="flex text-xs gap-2 items-center ">
                  <GraduationCap size={16} />
                  Study Leave Details
                </p>
                <Field className="grid grid-cols-2 gap-4 py-4">
                  {/* STUDY INSTITUTION */}
                  <Field>
                    <FieldLabel>
                      Institute Attended
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      type="text"
                      placeholder="e.g ABU Zaria or University of Manchaster."
                      {...register("studyLeaveDetails.institution", {
                        required: "Study Institution is required",
                      })}
                    />
                    {errors.studyLeaveDetails?.institution && (
                      <FieldError className="text-xs">
                        {
                          errors.studyLeaveDetails.institution
                            ?.message as string
                        }
                      </FieldError>
                    )}
                  </Field>

                  {/* STUDY PROGRAMME */}
                  <Field>
                    <FieldLabel>
                      Programme
                      <span className="text-red-500">*</span>{" "}
                    </FieldLabel>
                    <Input
                      type="text"
                      placeholder="e.g Modecular Biology."
                      {...register("studyLeaveDetails.programme", {
                        required: "Study Programme is required.",
                      })}
                    />
                    {errors.studyLeaveDetails?.programme && (
                      <FieldError className="text-xs">
                        {errors.studyLeaveDetails.programme?.message as string}
                      </FieldError>
                    )}
                  </Field>

                  {/* STUDY DEGREE TYPE*/}
                  <Field>
                    <FieldLabel>
                      Degree Type <span className="text-red-500">*</span>
                    </FieldLabel>

                    <Controller
                      name="studyLeaveDetails.degreeType"
                      control={control}
                      rules={{ required: "Degree type is required." }}
                      render={({ field }) => (
                        <SelectFilter
                          triggerClassName="w-full"
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectItem value="BSC">BSC</SelectItem>
                          <SelectItem value="PGD">PGD</SelectItem>
                          <SelectItem value="MSC">MSC</SelectItem>
                        </SelectFilter>
                      )}
                    />
                    {errors.studyLeaveDetails?.degreeType && (
                      <FieldError className="text-xs">
                        {errors.studyLeaveDetails.degreeType.message as string}
                      </FieldError>
                    )}
                  </Field>

                  {/* STUDY MODE OF STUDY*/}
                  <Field>
                    <FieldLabel>
                      Study Mode <span className="text-red-500">*</span>
                    </FieldLabel>

                    <Controller
                      name="studyLeaveDetails.studyMode"
                      control={control}
                      rules={{ required: "Study mode is required." }}
                      render={({ field }) => (
                        <SelectFilter
                          triggerClassName="w-full"
                          placeholder={"Select study mode."}
                          onValueChange={field.onChange}
                        >
                          <SelectItem value="FULL_TIME">Full-time</SelectItem>
                          <SelectItem value="PART_TIME">Part-time</SelectItem>
                        </SelectFilter>
                      )}
                    />
                    {errors.studyLeaveDetails?.studyMode && (
                      <FieldError className="text-xs">
                        {errors.studyLeaveDetails.studyMode.message as string}
                      </FieldError>
                    )}
                  </Field>

                  {/*STUDY COUNTRY*/}
                  <Field>
                    <FieldLabel>
                      Study Country
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      type="text"
                      placeholder="e.g USA or Nigeria."
                      {...register("studyLeaveDetails.country", {
                        required: "Study country is required.",
                      })}
                    />
                    {errors.studyLeaveDetails?.country && (
                      <FieldError className="text-xs">
                        {errors.studyLeaveDetails.country?.message as string}
                      </FieldError>
                    )}
                  </Field>

                  {/*STUDY DURATION YEARS*/}
                  <Field>
                    <FieldLabel>
                      Study Duration Year('s)
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      type="number"
                      min={1}
                      max={6}
                      defaultValue={3}
                      {...register("studyLeaveDetails.durationYear", {
                        min: 1,
                        max: 6,
                        required: "Study year duration is required.",
                      })}
                    />
                    {errors.studyLeaveDetails?.durationYear && (
                      <FieldError className="text-xs">
                        {
                          errors.studyLeaveDetails.durationYear
                            ?.message as string
                        }
                      </FieldError>
                    )}
                  </Field>

                  {/* STUDY SPONSORSHIPTYPES*/}
                  <Field>
                    <FieldLabel>
                      Sponsorship Type <span className="text-red-500">*</span>
                    </FieldLabel>

                    <Controller
                      name="studyLeaveDetails.sponsorshipType"
                      control={control}
                      rules={{ required: "Sponsorship type is required." }}
                      render={({ field }) => (
                        <SelectFilter
                          triggerClassName="w-full"
                          placeholder={"Select sponsorship type."}
                          onValueChange={field.onChange}
                        >
                          <SelectItem value="Self">Self Sponsorship</SelectItem>
                          <SelectItem value="StateGovernment">
                            State Gov't Sponsorship
                          </SelectItem>
                          <SelectItem value="University">
                            University Base Sponsorship
                          </SelectItem>
                          <SelectItem value="TedFund">
                            TedFund Sponsorship
                          </SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectFilter>
                      )}
                    />
                    {errors.studyLeaveDetails?.sponsorshipType && (
                      <FieldError className="text-xs">
                        {
                          errors.studyLeaveDetails.sponsorshipType
                            .message as string
                        }
                      </FieldError>
                    )}
                  </Field>

                  {/* STUDY LEAVE CATEGORY */}
                  <Field>
                    <FieldLabel>
                      Leave Category <span className="text-red-500">*</span>
                    </FieldLabel>

                    <Controller
                      name="studyLeaveDetails.leaveCategory"
                      control={control}
                      rules={{ required: "Leave category type is required." }}
                      render={({ field }) => (
                        <SelectFilter
                          triggerClassName="w-full"
                          placeholder={"Select Leave category."}
                          onValueChange={field.onChange}
                        >
                          <SelectItem value="Study">Study Leave</SelectItem>
                          <SelectItem value="Work">Work Leave</SelectItem>
                        </SelectFilter>
                      )}
                    />
                    {errors.studyLeaveDetails?.leaveCategory && (
                      <FieldError className="text-xs">
                        {
                          errors.studyLeaveDetails.leaveCategory
                            .message as string
                        }
                      </FieldError>
                    )}
                  </Field>

                  {/* STUDY PAY STATUS */}
                  <Field>
                    <FieldLabel>Pay Status</FieldLabel>

                    <Controller
                      name="studyLeaveDetails.payStatus"
                      control={control}
                      render={({ field }) => (
                        <SelectFilter
                          triggerClassName="w-full"
                          placeholder={"Select pay status"}
                          onValueChange={field.onChange}
                        >
                          <SelectItem value="Null">None</SelectItem>
                          <SelectItem value="WithPay">With Pay</SelectItem>
                          <SelectItem value="WithoutPay">
                            Without Pay
                          </SelectItem>
                        </SelectFilter>
                      )}
                    />
                  </Field>

                  {/* GUARANTOR/KIN */}
                  <Field>
                    <FieldLabel>Guarantor / Next of Kin</FieldLabel>
                    <Input
                      type="text"
                      {...register("studyLeaveDetails.guarantor_NextOfKin")}
                    />
                  </Field>
                </Field>
              </div>
            )}

            {/* DATES */}
            <Field className="grid grid-cols-2 gap-4">
              <FieldLabel className="flex flex-col items-start space-y-1 text-sm font-medium text-muted-foreground">
                Start Date
                <Input
                  type="date"
                  {...register("startDate", {
                    required: "Select the start date.",
                  })}
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
                {...register("reason", {
                  required: "Provide reason for leaving.",
                })}
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
                variant={"destructive"}
                disabled={isApplyingLeave}
                onClick={() => setDialog(false)}
                className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition"
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isApplyingLeave}>
                {isApplyingLeave ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}
