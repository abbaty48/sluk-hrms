import { useStaff } from "@/hooks/api/staff"
import { Briefcase, Building2, GraduationCap, Calendar } from "lucide-react"
import { AppointmentSkeleton } from '@sluk/src/pages/dashboard/employee/skeletons/EmployeeAppointmentSkeleton'

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
  )
}

export default function Appointment() {
  const { data: staff, isLoading } = useStaff("staff_2")

  if (isLoading) {
    return <AppointmentSkeleton />
  }

  if (!staff)
    return null

  return (
    <div className="m-4 grid md:grid-cols-2 gap-6">

      {/* CURRENT POSITION */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">Current Position</h2>

        <InfoItem icon={Briefcase} label="Staff Category" value={staff.staffCategory} />
        <InfoItem icon={GraduationCap} label="Cadre" value={staff.cadre} />
        <InfoItem icon={Building2} label="Rank" value={staff.rank} />
        <InfoItem icon={Briefcase} label="Nature of Appointment" value={staff.natureOfAppointment} />
      </div>


      {/* DEPARTMENT & DATES */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">Department & Dates</h2>

        <InfoItem icon={Building2} label="Department" value={staff.departmentId} />
        <InfoItem icon={Building2} label="Faculty" value="Faculty of Computing" />
        <InfoItem icon={Calendar} label="First Appointment" value={staff.dateOfFirstAppointment} />
        <InfoItem icon={Calendar} label="Present Appointment" value={staff.dateOfLastPromotion} />
      </div>

    </div>
  )
}
