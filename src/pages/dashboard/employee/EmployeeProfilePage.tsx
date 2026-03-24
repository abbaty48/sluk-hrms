import { ProfileSkeleton } from "@/pages/dashboard/employee/skeletons/EmployeeProfileSkeleton";
import ProfileAvatar from "@/pages/dashboard/employee/profile/EmployeeProfileAvatar";
import ProfileTabs from "@/pages/dashboard/employee/profile/EmployeeProfileTabs";
import { useStaff } from "@/hooks/api/staff";
import { Motion } from "@/components/Motion";
import { Card } from "@/components/ui/card";

export default function EmployeeProfilePage() {
  const { data, isLoading } = useStaff("staff_1");

  if (isLoading) return <ProfileSkeleton />;

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <Card className="w-full max-w-md p-6 flex flex-col items-center gap-4 text-center">
          <ProfileAvatar
            name="Unknown User"
            image={null}
            onUpload={(file) => console.log(file)}
          />
          <div>
            <h2 className="text-xl font-bold">Unknown User</h2>
            <p className="text-muted-foreground text-sm">N/A · N/A</p>
          </div>
          <p className="text-sm text-muted-foreground">
            We couldn't load the employee data, possibly due to a network issue
            or the employee record doesn't exist. Please try again later or
            contact support if the issue persists.
          </p>
        </Card>
      </div>
    );

  return (
    <Motion className="space-y-6 m-4 sm:m-6">

      {/* Header Card */}
      <div className="bg-card rounded-xl shadow p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <ProfileAvatar
          name={data.name}
          image={null}
          onUpload={(file) => console.log(file)}
        />

        <div className="text-center sm:text-left min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold truncate">{data.name}</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {data.rank} · {data.staffNo}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto">
        <ProfileTabs />
      </div>

    </Motion>
  );
}