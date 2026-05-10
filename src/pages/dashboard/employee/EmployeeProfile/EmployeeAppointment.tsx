import { EmployeeAppointmentSkeleton } from "@/pages/dashboard/employee/skeletons/EmployeeAppointmentSkeleton";
import { Briefcase, Building2, GraduationCap, Calendar } from "lucide-react";
import { useEmployee } from "@sluk/src/hooks/api/useEmployeeAPI";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { formatDate } from "@sluk/src/lib/utils";
import { Suspense } from "react";

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-muted">
        <Icon size={16} />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function EmployeeAppointment() {
  return (
    <QueryErrorResetBoundary>
      <Suspense fallback={<EmployeeAppointmentSkeleton />}>
        <AppointmentsDetails />
      </Suspense>
    </QueryErrorResetBoundary>
  );
}
function AppointmentsDetails() {
  const { data: staff } = useEmployee("current");

  return (
    <div className="m-4 grid md:grid-cols-2 gap-6">
      {/* CURRENT POSITION */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">Current Position</h2>

        <InfoItem
          icon={Briefcase}
          label="Staff Category"
          value={staff.staffCategory}
        />
        <InfoItem icon={GraduationCap} label="Cadre" value={staff.cadre} />
        <InfoItem icon={Building2} label="Rank" value={staff.rank} />
        <InfoItem
          icon={Briefcase}
          label="Nature of Appointment"
          value={staff.natureOfAppointment}
        />
      </div>

      {/* DEPARTMENT & DATES */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">Department & Dates</h2>

        <InfoItem
          icon={Building2}
          label="Department"
          value={staff.department?.name}
        />
        <InfoItem icon={Building2} label="Faculty" value="N/A" />
        <InfoItem
          icon={Calendar}
          label="First Appointment"
          value={formatDate(new Date(staff.dateOfFirstAppointment!))}
        />
        <InfoItem
          icon={Calendar}
          label="Present Appointment"
          value={formatDate(new Date(staff.dateOfLastPromotion!))}
        />
      </div>
    </div>
  );
}
