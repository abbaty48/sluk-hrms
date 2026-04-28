import {
  Sheet,
  SheetTitle,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { TStaffFormData } from "@/types/staffTypes";
import { useAddStaffAPI } from "@/hooks/api/useAdminStaffApi";
import { type ReactNode, type PropsWithChildren, useState } from "react";
import { User, Save, Briefcase, LucideMapPin, Loader2 } from "lucide-react";
import { AdminAddStaffPersonalDetails } from "./AdminAddStaffPersonalDetails";
import { AdminAddStaffLocationDetails } from "./AdminAddStaffLocationDetails";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { AdminAddStaffAppointmentDetails } from "./AdminAddStaffAppointmentDetails";

type Props = PropsWithChildren & {
  triggerButton: ReactNode;
};

export function AdminEmployeePageAddStaff({ triggerButton }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{triggerButton}</SheetTrigger>
      <SheetContent className="md:min-w-[80%] sm:min-w-full px-3">
        <SheetHeader>
          <SheetTitle>Add Staff</SheetTitle>
          <SheetDescription>Enter complete staff information.</SheetDescription>
        </SheetHeader>
        <AdminEmployeePageAddStaffContent onSuccess={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

// TODO: Mark all required field with a red asterik after the label name

function AdminEmployeePageAddStaffContent({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TStaffFormData>();
  const { mutate: submitMutate, isPending } = useAddStaffAPI();
  const onSubmit = (data: TStaffFormData) => {
    const payload = {
      // PEROSNAL
      staffNo: data.personalStaffNumber,
      title: data.personalTitle,
      email: data.personalEmail,
      phone: data.personalPhone,
      gender: data.personalGender,
      religion: data.personalReligion,
      lastName: data.personalLastName,
      firstName: data.personalFirstName,
      dateOfBirth: data.personalDateOfBirth,
      placeOfBirth: data.personalPlaceOfBirth,
      maritalStatus: data.personalMaritalStatus,
      // LOCATIONS
      city: data.locationCity,
      town: data.locationTown,
      state: data.locationState,
      status: data.locationStaffStatus,
      lga: data.locationLocalGovernment,
      nationality: data.locationNationality,
      address: data.locationPermanentAddress,
      statusComment: data.locationStaffStatusComment,
      // APPOINTMENT
      cadre: data.appointmentCadre,
      rankId: data.appointmentRank,
      staffCategory: data.appointmentLevel,
      natureOfAppointment: data.appointmentNature,
      departmentId: data.appointmentUnitDepartment,
      dateOfLastPromotion: data.appointmentDatePresent,
      dateOfFirstAppointment: data.appointmentDateFirst,
    }; // 19 datas

    submitMutate(payload, {
      onSuccess: () => {
        toast.success("Staff added.", {
          className: "bg-background text-foreground",
          description: "Staff member added successfully",
          position: "top-right",
        });
        reset(); // Reset form
        onSuccess(); // close the sheet
      },
      onError: (error) => {
        toast.error("Failed adding.", {
          className: "bg-background error-foreground",
          description: error.message || "Failed to add staff member",
          position: "top-right",
        });
      },
    });
  };

  return (
    <form
      className="flex flex-col overflow-y-auto h-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Tabs defaultValue="personal" className="overflow-y-auto flex-1">
        <TabsList className="sticky top-0 z-10">
          <TabsTrigger value="personal">
            <User className="h-4 w-4 mr-2" /> Personal Details
          </TabsTrigger>
          <TabsTrigger value="appointment">
            <Briefcase className="h-4 w-4 mr-2" /> Appointment Details
          </TabsTrigger>
          <TabsTrigger value="location">
            <LucideMapPin className="h-4 w-4 mr-2" /> Location & Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <AdminAddStaffPersonalDetails
            register={register}
            control={control}
            errors={errors}
          />
        </TabsContent>

        <TabsContent value="appointment">
          <AdminAddStaffAppointmentDetails
            register={register}
            control={control}
            errors={errors}
          />
        </TabsContent>

        <TabsContent value="location">
          <AdminAddStaffLocationDetails
            register={register}
            control={control}
            errors={errors}
          />
        </TabsContent>
      </Tabs>

      <SheetFooter className="flex flex-row items-center justify-between ml-auto border-t w-full py-3 mt-4">
        <p className="text-sm text-muted-foreground">
          {new Date().getFullYear()} @SLU
        </p>
        <div className="flex flex-row space-x-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Staff
              </>
            )}
          </Button>
          <SheetClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel & Close
            </Button>
          </SheetClose>
        </div>
      </SheetFooter>
    </form>
  );
}
