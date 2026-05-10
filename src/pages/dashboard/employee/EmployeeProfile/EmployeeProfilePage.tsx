import { ProfileSkeleton } from "@/pages/dashboard/employee/skeletons/EmployeeProfileSkeleton";
import ProfileAvatar from "@/pages/dashboard/employee/EmployeeProfile/EmployeeProfileAvatar";
import ProfileTabs from "@/pages/dashboard/employee/EmployeeProfile/EmployeeProfileTabs";
import { useEmployee } from "@/hooks/api/useEmployeeAPI";
import { EmployeeNotFound } from "./EmployeeNotFound";
import { Motion } from "@/components/Motion";

export default function EmployeeProfilePage() {
  const { data: staff, isLoading } = useEmployee("current");

  if (isLoading) return <ProfileSkeleton />;
  if (!staff) return <EmployeeNotFound />;

  return (
    <Motion className="space-y-6 m-6">
      {/* Header Card */}
      <div className="bg-card rounded-xl shadow p-6 flex items-center gap-6 ">
        <ProfileAvatar
          name={[staff.firstName, staff.lastName].join()}
          image={staff.profilePhoto}
          onUpload={(file) => console.log(file)}
        />

        <div>
          <h2 className="text-2xl font-bold">
            {[staff.firstName, staff.lastName].join()}
          </h2>
          <p className="text-muted-foreground">
            {staff.rank} · {staff.staffNo}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <ProfileTabs />
    </Motion>
  );
}
