import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import type { TStaffFormData } from "@/types/staffTypes";
import { FieldError, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { FieldErrors, Control, UseFormRegister } from "react-hook-form";

export function AdminAddStaffPersonalDetails({
  errors,
  register,
  control,
}: {
  control: Control<TStaffFormData>;
  errors: FieldErrors<TStaffFormData>;
  register: UseFormRegister<TStaffFormData>;
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
        {/* Title */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Title</span>
          <Controller
            name="personalTitle"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select Title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr">Mr</SelectItem>
                  <SelectItem value="Mrs">Mrs</SelectItem>
                  <SelectItem value="Ms">Ms</SelectItem>
                  <SelectItem value="Dr">Dr</SelectItem>
                  <SelectItem value="Prof">Prof</SelectItem>
                  <SelectItem value="Miss">Miss</SelectItem>
                  <SelectItem value="Sir">Sir</SelectItem>
                  <SelectItem value="Madam">Madam</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.personalTitle && (
            <FieldError className="text-xs">
              {errors.personalTitle.message as string}
            </FieldError>
          )}
        </FieldLabel>
        {/* Staff First Name */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">First Name</span>
          <Input
            placeholder="Staff First Name"
            className="h-10 w-full"
            {...register("personalFirstName", {
              required: "Staff first name is required",
              minLength: {
                value: 3,
                message: "FirstName must be at least 3 characters",
              },
            })}
          />
          {errors.personalFirstName && (
            <FieldError className="text-xs">
              {errors.personalFirstName.message as string}
            </FieldError>
          )}
        </FieldLabel>
        {/* Staff Last Name */}
        <FieldLabel className="flex flex-col items-start space-y-2 w-full">
          <span className="text-sm font-medium">Last Name</span>
          <Input
            placeholder="Staff Last Name"
            className="h-10 w-full"
            {...register("personalLastName", {
              required: "Last name is required",
              minLength: {
                value: 3,
                message: "LastName must be at least 3 characters",
              },
            })}
          />
          {errors.personalLastName && (
            <FieldError className="text-xs">
              {errors.personalLastName.message as string}
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
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
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
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
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
