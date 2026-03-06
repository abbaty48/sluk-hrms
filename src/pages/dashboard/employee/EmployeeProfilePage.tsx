import { ProfileSkeleton } from "@/pages/dashboard/employee/skeletons/EmployeeProfileSkeleton";
import ProfileAvatar from "@/pages/dashboard/employee/profile/EmployeeProfileAvatar";
import ProfileTabs from "@/pages/dashboard/employee/profile/EmployeeProfileTabs";
import { useStaff } from "@/hooks/api/staff";
import { Card } from "@/components/ui/card";

export default function EmployeeProfilePage() {
  const { data, isLoading } = useStaff("staff_1");

  if (isLoading) return <ProfileSkeleton />;
  if (!data)
    return (
      <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card rounded-xl shadow p-6 flex items-center gap-6 justify-center">
        <ProfileAvatar
          name={"Unknown User"}
          image={null}
          onUpload={(file) => console.log(file)}
        />

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
    );

  return (
    <div className="space-y-6 m-6">
      {/* Header Card */}
      <div className="bg-card rounded-xl shadow p-6 flex items-center gap-6 ">
        <ProfileAvatar
          name={data.name}
          image={null}
          onUpload={(file) => console.log(file)}
        />

        <div>
          <h2 className="text-2xl font-bold">{data.name}</h2>
          <p className="text-muted-foreground">
            {data.rank} · {data.staffNo}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <ProfileTabs />
    </div>
  );
}
