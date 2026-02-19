import type { FieldErrors, Control, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@sluk/src/components/ui/select";
import { User } from "lucide-react";
import { Input } from "@sluk/src/components/ui/input";
import type { StaffFormData } from "@sluk/src/types/types";
import { FieldError, FieldLabel } from "@sluk/src/components/ui/field";
import { Card, CardContent, CardHeader } from "@sluk/src/components/ui/card";

export function AdminAddStaffPersonalDetails({
  errors,
  register,
  control,
}: {
  errors: FieldErrors<StaffFormData>;
  register: UseFormRegister<StaffFormData>;
  control: Control<StaffFormData>;
}) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          Personal Details
        </h3>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Staff Number */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Staff Number</span>
          <Input
            placeholder="e.g. SLU/2025/001"
            className="h-10 w-full"
            {...register("personalStaffNumber", {
              required: "Staff number is required",
              pattern: {
                value: /^[A-Z]+\/\d{4}\/\d{3,}$/,
                message: "Invalid staff number format (e.g., SLU/2025/001)",
              },
            })}
          />
          {errors.personalStaffNumber && (
            <FieldError className="text-xs">
              {errors.personalStaffNumber.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Staff Name */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Staff Name</span>
          <Input
            placeholder="Full Name"
            className="h-10 w-full"
            {...register("personalStaffName", {
              required: "Staff name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters",
              },
            })}
          />
          {errors.personalStaffName && (
            <FieldError className="text-xs">
              {errors.personalStaffName.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Staff Category */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Staff Category</span>
          <Controller
            name="personalStaffCategory"
            control={control}
            rules={{ required: "Staff category is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select Staff Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic Staff</SelectItem>
                  <SelectItem value="admin">Administrative Staff</SelectItem>
                  <SelectItem value="non-academic">
                    Non-Academic Staff
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.personalStaffCategory && (
            <FieldError className="text-xs">
              {errors.personalStaffCategory.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Gender */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Gender</span>
          <Controller
            name="personalGender"
            control={control}
            rules={{ required: "Gender is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.personalGender && (
            <FieldError className="text-xs">
              {errors.personalGender.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Marital Status */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Marital Status</span>
          <Controller
            name="personalMaritalStatus"
            control={control}
            rules={{ required: "Marital status is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select Marital Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.personalMaritalStatus && (
            <FieldError className="text-xs">
              {errors.personalMaritalStatus.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Date of Birth */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Date of Birth</span>
          <Input
            type="date"
            className="h-10 w-full"
            {...register("personalDateOfBirth", {
              required: "Date of birth is required",
              validate: (value) => {
                const date = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - date.getFullYear();
                return age >= 18 || "Staff must be at least 18 years old";
              },
            })}
          />
          {errors.personalDateOfBirth && (
            <FieldError className="text-xs">
              {errors.personalDateOfBirth.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Phone Number */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Phone Number</span>
          <Input
            placeholder="e.g. +234XXXXXXXXXX"
            className="h-10 w-full"
            {...register("personalPhone", {
              required: "Phone number is required",
              pattern: {
                value: /^\+234\d{10}$/,
                message: "Invalid phone number format (use +234XXXXXXXXXX)",
              },
            })}
          />
          {errors.personalPhone && (
            <FieldError className="text-xs">
              {errors.personalPhone.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Email */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Email</span>
          <Input
            type="email"
            placeholder="example@gmail.com"
            className="h-10 w-full"
            {...register("personalEmail", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.personalEmail && (
            <FieldError className="text-xs">
              {errors.personalEmail.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Place of Birth */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Place of Birth</span>
          <Input
            type="text"
            placeholder="Place of birth"
            className="h-10 w-full"
            {...register("personalPlaceOfBirth", {
              required: "Place of birth is required",
              minLength: {
                value: 3,
                message: "Place of birth must be at least 3 characters",
              },
            })}
          />
          {errors.personalPlaceOfBirth && (
            <FieldError className="text-xs">
              {errors.personalPlaceOfBirth.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Nationality */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Nationality</span>
          <Controller
            name="personalNationality"
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
          {errors.personalNationality && (
            <FieldError className="text-xs">
              {errors.personalNationality.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* State */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">State</span>
          <Controller
            name="personalState"
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
          {errors.personalState && (
            <FieldError className="text-xs">
              {errors.personalState.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Local Government */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Local Government</span>
          <Controller
            name="personalLocalGovernment"
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
          {errors.personalLocalGovernment && (
            <FieldError className="text-xs">
              {errors.personalLocalGovernment.message as string}
            </FieldError>
          )}
        </FieldLabel>

        {/* Religion */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Religion</span>
          <Controller
            name="personalReligion"
            control={control}
            rules={{ required: "Religion is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select Religion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="islam">Islam</SelectItem>
                  <SelectItem value="christianity">Christianity</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.personalReligion && (
            <FieldError className="text-xs">
              {errors.personalReligion.message as string}
            </FieldError>
          )}
        </FieldLabel>
      </CardContent>
    </Card>
  );
}
