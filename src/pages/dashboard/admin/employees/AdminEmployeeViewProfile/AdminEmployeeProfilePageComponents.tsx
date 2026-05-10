import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DepartmentSelectItems } from "@/components/DepartmentSelectItems";
import type { TStaffProfileUpdateRequest } from "@/types/staffTypes";
import { RankSelectItems } from "@/components/RankSelectItems";
import { SelectFilter } from "@/components/SelectFilter";
import type { UseFormReturn } from "react-hook-form";
import { FieldError } from "@/components/ui/field";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  name: string;
  isEditing?: boolean;
  isRequired?: boolean;
  requiredMessage?: string;
  value: string;
  formHook?: Omit<
    UseFormReturn<TStaffProfileUpdateRequest, any, TStaffProfileUpdateRequest>,
    "handleSubmit"
  >;
}

export function AEVPLabelItem({
  icon: Icon,
  label,
  value,
}: Pick<InfoItemProps, "icon" | "label" | "value">) {
  //
  //
  return (
    <div className="flex items-center gap-3 py-3 w-full md:w-4/5">
      <div className="flex h-9 w-9 shrink-0 place-self-end items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="w-full space-y-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}

export function AEVPInfoItem({
  icon: Icon,
  name,
  label,
  value,
  isEditing,
  isRequired,
  formHook,
  requiredMessage,
}: InfoItemProps) {
  //
  const [val, setVal] = useState(value);
  const key = name as keyof TStaffProfileUpdateRequest;
  const errors = isRequired ? formHook?.formState.errors[key] : null;
  //
  return (
    <div className="flex items-center gap-3 py-3 w-full md:w-4/5">
      <div className="flex h-9 w-9 shrink-0 place-self-end items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="w-full space-y-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        {isEditing ? (
          <>
            {errors && (
              <FieldError className="text-xs">{errors.message}</FieldError>
            )}
            <Input
              {...formHook?.register(key, {
                value: val,
                required: {
                  value: !!isRequired,
                  message: requiredMessage ?? "",
                },
              })}
              onChange={(e) => setVal(e.target.value)}
            />
          </>
        ) : (
          <p className="text-sm font-medium text-card-foreground">{value}</p>
        )}
      </div>
    </div>
  );
}

// AEVTextInput
export function AEVPInputItem({
  icon: Icon,
  name,
  label,
  value,
  isEditing,
  isRequired,
  formHook,
  type,
  requiredMessage,
}: Omit<InfoItemProps, "value"> & { type: string; value: string | number }) {
  // }: Omit<InfoItemProps, "value"> & { type: string; value: string | number }) {
  //
  const [val, setVal] = useState(value);
  const key = name as keyof TStaffProfileUpdateRequest;
  const errors = isRequired ? formHook?.formState.errors[key] : null;
  //
  return (
    <div className="flex items-center gap-3 py-3 w-full md:w-4/5">
      <div className="flex h-9 w-9 shrink-0 place-self-end items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="w-full space-y-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        {isEditing ? (
          <>
            {errors && (
              <FieldError className="text-xs">{errors.message}</FieldError>
            )}
            <Input
              type={type}
              value={val}
              {...formHook?.register(key, {
                required: {
                  value: !!isRequired,
                  message: requiredMessage ?? "",
                },
              })}
              onChange={(e) => setVal(e.target.value)}
            />
          </>
        ) : (
          <p className="text-sm font-medium text-card-foreground">{value}</p>
        )}
      </div>
    </div>
  );
}

// ===========================================
// Admin Employee Select/Item
// ===========================================

export function AEVPSelectInfoItem({
  icon: Icon,
  name,
  label,
  value,
  children,
  isEditing,
  placeHolder,
  defaultValue,
}: InfoItemProps & {
  placeHolder?: string;
  defaultValue?: string;
  children: ReactNode;
}) {
  const [val, setVal] = useState(value);
  return (
    <div className="flex items-center gap-3 py-3 w-full md:w-4/5">
      <div className="flex h-9 w-9 shrink-0 place-self-end items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="w-full space-y-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        {isEditing ? (
          <>
            <SelectFilter
              name={name}
              value={val}
              triggerClassName="w-full"
              placeholder={placeHolder}
              defaultValue={defaultValue}
              onValueChange={(val) => setVal(val!)}
            >
              {children}
            </SelectFilter>
          </>
        ) : (
          <p className="text-sm font-medium text-card-foreground">{label}</p>
        )}
      </div>
    </div>
  );
}

// ===========================================
// Admin Employee Department Select/Item
// ===========================================

export function AEVPDepartmentInfoItem({
  icon: Icon,
  name,
  label,
  value,
  isEditing,
}: InfoItemProps) {
  const [val, setVal] = useState(value);
  return (
    <div className="flex items-center gap-3 py-3 w-full md:w-4/5">
      <div className="flex h-9 w-9 shrink-0 place-self-end items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="w-full space-y-2">
        <p className="text-xs text-muted-foreground">Department</p>
        {isEditing ? (
          <>
            <SelectFilter
              name={name}
              value={val}
              defaultValue={value}
              triggerClassName="w-full"
              onValueChange={(val) => setVal(val!)}
            >
              <DepartmentSelectItems />
            </SelectFilter>
          </>
        ) : (
          <p className="text-sm font-medium text-card-foreground">{label}</p>
        )}
      </div>
    </div>
  );
}

// ============================================
// Admin Employee Rank Select/Item
// ============================================
export function AEVPRankInfoItem({
  icon: Icon,
  name,
  label,
  value,
  isEditing,
}: InfoItemProps) {
  const [val, setVal] = useState(value);

  return (
    <div className="flex items-center gap-3 py-3 w-full md:w-4/5">
      <div className="flex h-9 w-9 shrink-0 place-self-end items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="w-full space-y-2">
        <p className="text-xs text-muted-foreground">Role / Position</p>
        {isEditing ? (
          <>
            <SelectFilter
              name={name}
              value={val}
              defaultValue={value}
              placeholder="Select Rank"
              triggerClassName="w-full"
              onValueChange={(val) => setVal(val!)}
            >
              <RankSelectItems />
            </SelectFilter>
          </>
        ) : (
          <p className="text-sm font-medium text-card-foreground">{label}</p>
        )}
      </div>
    </div>
  );
}

// ============================================
// Admin Employee
// ============================================
export function AEVPDateInfoItem({
  icon: Icon,
  name,
  label,
  value,
  isEditing,
}: InfoItemProps) {
  const [val, setVal] = useState(value);

  return (
    <div className="flex items-center gap-3 py-3 w-full md:w-4/5">
      <div className="flex h-9 w-9 shrink-0 place-self-end items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="w-full space-y-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        {isEditing ? (
          <>
            <Input
              type="date"
              name={name}
              value={val}
              className="h-10 w-full"
              onChange={(e) => setVal(e.target.value)}
            />
          </>
        ) : (
          <p className="text-sm font-medium text-card-foreground">{value}</p>
        )}
      </div>
    </div>
  );
}

type TPageProps = {
  handleEdit?: () => void;
  handleBack: () => void;
  staffId?: string;
};
// ========================================
// EMPTY EMPLOYEE
// ========================================
export function AEVPEmptyEmployee({
  handleBack,
}: {
  handleBack: TPageProps["handleBack"];
}) {
  return (
    <div className="p-4">
      <Button variant="ghost" size="icon" onClick={handleBack}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card rounded-xl shadow p-6 flex items-center gap-6 justify-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={""} alt={"N/A"} />
          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
            N/A
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-2xl font-bold">Unknown User</h2>
          <p className="text-muted-foreground">N/A · N/A</p>
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          We couldn't load the employee data. possibly due to a network issue or
          the employee record doesn't exist. Please try again later or contact
          support if the issue persists.
        </p>
      </Card>
    </div>
  );
}

// =========================================
// LOADING SHIMMER
// ========================================
export function AEVInfoShimmer({ n, title }: { n: number; title?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-5 p-2 w-full">
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} className="flex w-full gap-2">
            <div className="flex h-9 w-9 shrink-0 place-self-end items-center justify-center rounded-lg bg-muted">
              <div className="h-4 w-4 shimmer"></div>
            </div>
            <div className="w-full space-y-2">
              <div className="h-2 w-12 shimmer"></div>
              <div className="h-9 w-full shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
