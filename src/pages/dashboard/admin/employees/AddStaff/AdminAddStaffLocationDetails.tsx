import type { FieldErrors, Control, UseFormRegister } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@sluk/src/components/ui/card";
import { FieldError, FieldLabel } from "@sluk/src/components/ui/field";
import type { StaffFormData } from "@sluk/src/types/types";
import { Input } from "@sluk/src/components/ui/input";
import { Controller } from "react-hook-form";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@sluk/src/components/ui/select";

export const AdminAddStaffLocationDetails = ({
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
          <MapPin className="h-4 w-4 text-primary" />
          Location & Status
        </h3>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Town (Place of Domicile) */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Town (Place of Domicile)</span>
          <Input
            placeholder="e.g. Kafin Hausa"
            className="h-10 w-full"
            {...register("locationTown", {
              required: "Town is required",
              minLength: {
                value: 2,
                message: "Town name must be at least 2 characters",
              },
            })}
          />
          {errors.locationTown && (
            <FieldError className="text-xs">
              {errors.locationTown.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Country */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Country</span>
          <Controller
            name="locationCountry"
            control={control}
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nigeria">Nigeria</SelectItem>
                  <SelectItem value="ghana">Ghana</SelectItem>
                  <SelectItem value="cameroon">Cameroon</SelectItem>
                  <SelectItem value="benin">Benin</SelectItem>
                  <SelectItem value="togo">Togo</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.locationCountry && (
            <FieldError className="text-xs">
              {errors.locationCountry.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Staff Status */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Staff Status</span>
          <Controller
            name="locationStaffStatus"
            control={control}
            rules={{ required: "Staff status is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="onleave">On Leave</SelectItem>
                  <SelectItem value="deceased">Deceased</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.locationStaffStatus && (
            <FieldError className="text-xs">
              {errors.locationStaffStatus.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Staff Status Comment */}
        <FieldLabel className="flex flex-col items-start space-y-2 md:col-span-2 lg:col-span-3 w-full">
          <span className="text-sm font-medium">
            Staff Status Comment (Optional)
          </span>
          <Input
            placeholder="Optional comment about status"
            className="h-10 w-full"
            {...register("locationStaffStatusComment", {
              maxLength: {
                value: 200,
                message: "Comment must be less than 200 characters",
              },
            })}
          />
          {errors.locationStaffStatusComment && (
            <FieldError className="text-xs">
              {errors.locationStaffStatusComment.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Permanent Home Address */}
        <FieldLabel className="flex flex-col items-start space-y-2 md:col-span-2 lg:col-span-3 w-full">
          <span className="text-sm font-medium">Permanent Home Address</span>
          <textarea
            placeholder="Full permanent home address"
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-20 resize-none"
            {...register("locationPermanentAddress", {
              required: "Permanent address is required",
              minLength: {
                value: 10,
                message: "Address must be at least 10 characters",
              },
              maxLength: {
                value: 500,
                message: "Address must be less than 500 characters",
              },
            })}
          />
          {errors.locationPermanentAddress && (
            <FieldError className="text-xs">
              {errors.locationPermanentAddress.message as string}
            </FieldError>
          )}
        </FieldLabel>
      </CardContent>
    </Card>
  );
};
