import { useStaff } from "@/hooks/api/staff"
import { User, MapPin, Phone, Mail, Calendar } from "lucide-react"
import { PersonalSkeleton } from '@sluk/src/pages/dashboard/employee/skeletons/EmployeePersonalSkeleton'

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any
  label: string
  value?: string | null
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-muted">
        <Icon size={16} />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function Personal() {
  const { data: staff, isLoading } = useStaff("staff_2")

  if (isLoading) {
    return <PersonalSkeleton />
  }

  if (!staff) return null

  return (
    <div className="m-4 grid md:grid-cols-2 gap-6">

      {/* LEFT CARD */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">Basic Information</h2>

        <InfoItem icon={User} label="Full Name" value={staff.name} />
        <InfoItem icon={User} label="Gender" value={staff.gender} />
        <InfoItem icon={Calendar} label="Date of Birth" value={staff.dateOfBirth} />
        <InfoItem icon={User} label="Marital Status" value={staff.maritalStatus} />
        <InfoItem icon={MapPin} label="Place of Birth" value={staff.city} />
        <InfoItem icon={User} label="Religion" value={staff.religion} />
      </div>


      {/* RIGHT CARD */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">Contact Details</h2>

        <InfoItem icon={Mail} label="Email" value={staff.email} />
        <InfoItem icon={Phone} label="Phone" value={staff.phone} />
        <InfoItem icon={MapPin} label="Permanent Address" value={staff.address} />
        <InfoItem icon={MapPin} label="Town" value={staff.city} />
        <InfoItem icon={MapPin} label="State" value={staff.state} />
        <InfoItem icon={MapPin} label="LGA" value={staff.lga} />
        <InfoItem icon={MapPin} label="Country" value="Nigeria" />
        <InfoItem icon={MapPin} label="Nationality" value="Nigerian" />
      </div>

    </div>
  )
}
