import type { FieldErrors, Control, UseFormRegister } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FieldError, FieldLabel } from "@/components/ui/field";
import type { TStaffFormData } from "@/types/staffTypes";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

export const AdminAddStaffLocationDetails = ({
  errors,
  control,
  register,
}: {
  control: Control<TStaffFormData>;
  errors: FieldErrors<TStaffFormData>;
  register: UseFormRegister<TStaffFormData>;
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

        {/* Nationality */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Nationality</span>
          <Controller
            name="locationNationality"
            control={control}
            rules={{ required: "Nationality is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select Nationality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nigeria">Nigeria</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.locationNationality && (
            <FieldError className="text-xs">
              {errors.locationNationality.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* State */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">State</span>
          <Controller
            name="locationState"
            control={control}
            rules={{ required: "State is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="akwa-ibom">Akwa Ibom</SelectItem>
                  <SelectItem value="abia">Abia</SelectItem>
                  <SelectItem value="adamawa">Adamawa</SelectItem>
                  <SelectItem value="abuja">FCT Abuja</SelectItem>
                  <SelectItem value="bauchi">Bauchi</SelectItem>
                  <SelectItem value="bayelsa">Bayelsa</SelectItem>
                  <SelectItem value="benue">Benue</SelectItem>
                  <SelectItem value="borno">Borno</SelectItem>
                  <SelectItem value="crossriver">Cross River</SelectItem>
                  <SelectItem value="delta">Delta</SelectItem>
                  <SelectItem value="ebonyi">Ebonyi</SelectItem>
                  <SelectItem value="edo">Edo</SelectItem>
                  <SelectItem value="ekiti">Ekiti</SelectItem>
                  <SelectItem value="enugu">Enugu</SelectItem>
                  <SelectItem value="gombe">Gombe</SelectItem>
                  <SelectItem value="imo">Imo</SelectItem>
                  <SelectItem value="jigawa">Jigawa</SelectItem>
                  <SelectItem value="kaduna">Kaduna</SelectItem>
                  <SelectItem value="kano">Kano</SelectItem>
                  <SelectItem value="katsina">Katsina</SelectItem>
                  <SelectItem value="kebbi">Kebbi</SelectItem>
                  <SelectItem value="kogi">Kogi</SelectItem>
                  <SelectItem value="kwara">Kwara</SelectItem>
                  <SelectItem value="lagos">Lagos</SelectItem>
                  <SelectItem value="nasarawa">Nasarawa</SelectItem>
                  <SelectItem value="niger">Niger</SelectItem>
                  <SelectItem value="ogun">Ogun</SelectItem>
                  <SelectItem value="ondo">Ondo</SelectItem>
                  <SelectItem value="osun">Osun</SelectItem>
                  <SelectItem value="oyo">Oyo</SelectItem>
                  <SelectItem value="plateau">Plateau</SelectItem>
                  <SelectItem value="rivers">Rivers</SelectItem>
                  <SelectItem value="sokoto">Sokoto</SelectItem>
                  <SelectItem value="taraba">Taraba</SelectItem>
                  <SelectItem value="yobe">Yobe</SelectItem>
                  <SelectItem value="zamfara">Zamfara</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.locationState && (
            <FieldError className="text-xs">
              {errors.locationState.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Local Government */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Local Government</span>
          <Controller
            name="locationLocalGovernment"
            control={control}
            rules={{ required: "Local government is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select Local Government" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="localGov1">Local Government 1</SelectItem>
                  <SelectItem value="localGov2">Local Government 2</SelectItem>
                  <SelectItem value="localGov3">Local Government 3</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.locationLocalGovernment && (
            <FieldError className="text-xs">
              {errors.locationLocalGovernment.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Staff City */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">City</span>
          <Input
            placeholder="Staff City"
            className="h-10 w-full"
            {...register("locationCity", {
              maxLength: {
                value: 200,
                message: "City name must be less than 200 characters",
              },
            })}
          />
          {errors.locationCity && (
            <FieldError className="text-xs">
              {errors.locationCity.message as string}
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
                  <SelectItem value="Employed">Active</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                  <SelectItem value="OnLeave">On Leave</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                  <SelectItem value="Resigned">Resigned</SelectItem>
                  <SelectItem value="Deceased">Deceased</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
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
