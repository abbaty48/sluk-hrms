import ProfileAvatar from "@/components/Profile/ProfileAvatar"
import ProfileTabs from "@/components/Profile/ProfileTabs"
import { useStaff } from "@/hooks/api/staff"
import { ProfileSkeleton} from '@/components/Skeleton/ProfileSkeleton'
import { DashboardError } from "@sluk/src/components/ErrorMessage/EmployeeErrorRetry"


export default function Profile() {
  const { data, isLoading } = useStaff("staff_1");

  if (isLoading) 
    return <ProfileSkeleton/>
  if (!data) 
    return <DashboardError />

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
  )
}
