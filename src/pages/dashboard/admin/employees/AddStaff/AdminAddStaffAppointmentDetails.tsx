import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@sluk/src/components/ui/select";
import { Briefcase } from "lucide-react";
import { Controller } from "react-hook-form";
import { Input } from "@sluk/src/components/ui/input";
import type { StaffFormData } from "@sluk/src/types/types";
import { SelectFilter } from "@sluk/src/components/SelectFilter";
import { FieldError, FieldLabel } from "@sluk/src/components/ui/field";
import { RankSelectItems } from "@sluk/src/components/RankSelectItems";
import { Card, CardContent, CardHeader } from "@sluk/src/components/ui/card";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { DepartmentSelectItems } from "@sluk/src/components/DeparmentSelectItems";

export const AdminAddStaffAppointmentDetails = ({
  errors,
  control,
  register,
}: {
  control: Control<StaffFormData>;
  errors: FieldErrors<StaffFormData>;
  register: UseFormRegister<StaffFormData>;
}) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-primary" />
          Appointment Details
        </h3>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Cadre */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Cadre</span>
          <Controller
            name="appointmentCadre"
            control={control}
            rules={{ required: "Cadre is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select Cadre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="senior_non_academic">
                    Senior Non-Academic
                  </SelectItem>
                  <SelectItem value="junior_staff">Junior Staff</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.appointmentCadre && (
            <FieldError className="text-xs">
              {errors.appointmentCadre.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Rank */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Rank</span>
          <Controller
            name="appointmentRank"
            control={control}
            rules={{ required: "Rank is required" }}
            render={({ field }) => (
              <SelectFilter
                placeholder="Select Rank"
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <RankSelectItems />
              </SelectFilter>
            )}
          />
          {errors.appointmentRank && (
            <FieldError className="text-xs">
              {errors.appointmentRank.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Nature of Appointment */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Nature of Appointment</span>
          <Controller
            name="appointmentNature"
            control={control}
            rules={{ required: "Nature of appointment is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select Nature of Appointment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">Permanent</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                  <SelectItem value="contractual">Contractual</SelectItem>
                  <SelectItem value="sabbatical">Sabbatical</SelectItem>
                  <SelectItem value="visiting">Visiting</SelectItem>
                  <SelectItem value="adjunct">Adjunct</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.appointmentNature && (
            <FieldError className="text-xs">
              {errors.appointmentNature.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Date of First Appointment */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Date of First Appointment</span>
          <Input
            type="date"
            className="h-10 w-full"
            {...register("appointmentDateFirst", {
              required: "First appointment date is required",
              validate: (value) => {
                const date = new Date(value);
                const today = new Date();
                return date <= today || "Date cannot be in the future";
              },
            })}
          />
          {errors.appointmentDateFirst && (
            <FieldError className="text-xs">
              {errors.appointmentDateFirst.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Date of Present Appointment */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">
            Date of Present Appointment
          </span>
          <Input
            type="date"
            className="h-10 w-full"
            {...register("appointmentDatePresent", {
              required: "Present appointment date is required",
              validate: (value, formValues) => {
                const presentDate = new Date(value);
                const firstDate = new Date(formValues.appointmentDateFirst);
                const today = new Date();

                if (presentDate > today) {
                  return "Date cannot be in the future";
                }

                if (presentDate < firstDate) {
                  return "Present appointment must be after first appointment";
                }

                return true;
              },
            })}
          />
          {errors.appointmentDatePresent && (
            <FieldError className="text-xs">
              {errors.appointmentDatePresent.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Unit/Department */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Unit/Department</span>
          <Controller
            name="appointmentUnitDepartment"
            control={control}
            rules={{ required: "Unit/Department is required" }}
            render={({ field }) => (
              <SelectFilter
                placeholder="Select Unit/Department."
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <DepartmentSelectItems />
              </SelectFilter>
            )}
          />
          {errors.appointmentUnitDepartment && (
            <FieldError className="text-xs">
              {errors.appointmentUnitDepartment.message as string}
            </FieldError>
          )}
        </FieldLabel>
      </CardContent>
    </Card>
  );
};
