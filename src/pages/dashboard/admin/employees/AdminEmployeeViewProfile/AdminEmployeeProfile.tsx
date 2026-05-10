import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@sluk/src/components/ui/tabs";
import {
  name,
  nameTitle,
  getStaffStatusLabel,
  getStaffStatusVariant,
} from "@/lib/utils";
import {
  useStaffProfile,
  useUpdateStaffProfileAPI,
} from "@/hooks/api/useAdminStaffApi";
import {
  EmployeeProfilePersonalView,
  EmployeeProfileStudyLeaveView,
} from "./AdminEmployeeProfileViews";
import { Activity, useState } from "react";
import { Card } from "@/components/ui/card";
import { Motion } from "@/components/Motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { TStaffDetails } from "@/types/staffTypes";
import { AEPDialog } from "./AdminEmployeeProfilePageDialog";
import { AEVPEmptyEmployee } from "./AdminEmployeeProfilePageComponents";
import { Mail, Flag, Save, Phone, Pencil, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type TPageProps = {
  handleEdit?: () => void;
  handleBack: () => void;
  staffId?: string;
};

/**
 *
 */
function EmployeeProfile({
  employee,
  handleBack,
}: {
  employee: TStaffDetails;
  handleBack: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [openChangeStatus, setOpenChangeStatus] = useState(false);
  const { mutateAsync: updateProfile, isPending: isUpdating } =
    useUpdateStaffProfileAPI();

  const handleSaveEdit = async () => {
    // if (await formHook.trigger()) {
    //   try {
    //     await updateProfile({
    //       staffId: employee.id,
    //       ...formHook.getValues(),
    //     });
    //     toast.success("Update successful", {
    //       description: "Employee detail successful updated.",
    //     });
    //     setIsEditing(false);
    //   } catch (error: any) {
    //     toast.error("Update Failed ", {
    //       description: error.message || "Failed to update employee profile.",
    //     });
    //   }
    // }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          disabled={isUpdating}
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <h1 className="page-title">Employee Profile</h1>
          <p className="page-subtitle">{employee.id}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* FOR VIEW MODE ONLY */}
          <Activity mode={!isEditing ? "visible" : "hidden"}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOpenChangeStatus(true)}
            >
              <Flag className="h-4 w-4 mr-1" />
              Status
            </Button>

            <Button size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Activity>
          {/* FOR EDIT NODE */}
          <Activity mode={isEditing ? "visible" : "hidden"}>
            <Button
              size="sm"
              variant="outline"
              disabled={isUpdating}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>

            <Button size="sm" disabled={isUpdating} onClick={handleSaveEdit}>
              <Save className="h-4 w-4 mr-1" />
              Save Edit
            </Button>
          </Activity>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-wrap flex-row gap-4">
        {/* Profile Card */}
        <Motion variant="scale" delay={0.1} className="min-w-96">
          <Card className="flex flex-col items-center text-center py-8 gap-4">
            {/* Avatar */}
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={employee.profilePhoto || ""}
                alt={name(employee)}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {nameTitle(name(employee))}
              </AvatarFallback>
            </Avatar>

            {/* Name & Position */}
            <>
              <h2 className="text-xl font-semibold text-card-foreground">
                {name(employee)}
              </h2>
              <p className="text-sm text-muted-foreground">{employee.rank}</p>
            </>

            {/* Status Badge */}
            <Badge
              className="status-badge"
              variant={getStaffStatusVariant(employee.status) as any}
            >
              {getStaffStatusLabel(employee.status)}
            </Badge>

            <Separator />

            {/* Contact Buttons */}
            <Activity mode={isEditing ? "hidden" : "visible"}>
              <div className="flex gap-3 w-full justify-center">
                <a href={`mailto:${employee.email}`}>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                </a>

                <a href={`tel:${employee.phone}`}>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                </a>
              </div>
            </Activity>
          </Card>
        </Motion>
        <Tabs defaultValue={"personal_work"} className="flex-auto">
          <TabsList>
            <TabsTrigger value="personal_work">Personal & Work</TabsTrigger>
            <TabsTrigger value="study_leave">Study Leave</TabsTrigger>
          </TabsList>
          <TabsContent value="personal_work">
            <EmployeeProfilePersonalView
              employee={employee}
              isEditing={isEditing}
              isUpdating={isUpdating}
              handleSaveEdit={handleSaveEdit}
            />
          </TabsContent>
          <TabsContent value="study_leave">
            <EmployeeProfileStudyLeaveView
              isEditing={isEditing}
              isUpdating={isUpdating}
              employeeID={employee.id}
              handleSaveEdit={handleSaveEdit}
            />
          </TabsContent>
        </Tabs>
        {/* Information Cards */}
      </div>

      {/* Change Status Dialog */}
      <AEPDialog
        employeeId={employee.id}
        employeeName={name(employee)}
        employeeStatus={employee.status}
        openChangeStatus={openChangeStatus}
        setOpenChangeStatus={setOpenChangeStatus}
      />
    </>
  );
}
/**
 *
 */
export function AdminEmployeeProfile({ staffId, handleBack }: TPageProps) {
  const { data: employee } = useStaffProfile(staffId!);

  return (
    <Motion variant="fadeUp" className="space-y-6 p-4">
      {!employee ? (
        <AEVPEmptyEmployee handleBack={handleBack} />
      ) : (
        <EmployeeProfile employee={employee} handleBack={handleBack} />
      )}
    </Motion>
  );
}
