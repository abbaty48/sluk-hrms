import { EmployeePersonalSkeleton } from "@/pages/dashboard/employee/skeletons/EmployeePersonalSkeleton";
import { User, MapPin, Phone, Mail, Calendar } from "lucide-react";
import { useEmployee } from "@sluk/src/hooks/api/useEmployeeAPI";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { formatDate, name } from "@sluk/src/lib/utils";
import { EmployeeNotFound } from "./EmployeeNotFound";
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

export default function EmployeePersonal() {
  return (
    <QueryErrorResetBoundary>
      <Suspense fallback={<EmployeePersonalSkeleton />}>
        <PersonalDetails />
      </Suspense>
    </QueryErrorResetBoundary>
  );
}

function PersonalDetails() {
  const { data: staff } = useEmployee();

  if (!staff) return <EmployeeNotFound />;

  return (
    <div className="m-4 grid md:grid-cols-2 gap-6">
      {/* LEFT CARD */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">Basic Information</h2>

        <InfoItem icon={User} label="Full Name" value={name(staff)} />
        <InfoItem icon={User} label="Gender" value={staff.gender} />
        <InfoItem
          icon={Calendar}
          label="Date of Birth"
          value={formatDate(new Date(staff.dateOfBirth!))}
        />
        <InfoItem
          icon={User}
          label="Marital Status"
          value={staff.maritalStatus}
        />
        <InfoItem icon={MapPin} label="Place of Birth" value={staff.city} />
        <InfoItem icon={User} label="Religion" value={staff.religion} />
      </div>

      {/* RIGHT CARD */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">Contact Details</h2>

        <InfoItem icon={Mail} label="Email" value={staff.email} />
        <InfoItem icon={Phone} label="Phone" value={staff.phone} />
        <InfoItem
          icon={MapPin}
          label="Permanent Address"
          value={staff.address}
        />
        <InfoItem icon={MapPin} label="Town" value={staff.city} />
        <InfoItem icon={MapPin} label="State" value={staff.state} />
        <InfoItem icon={MapPin} label="LGA" value={staff.lga} />
        <InfoItem icon={MapPin} label="Country" value={staff.nationality} />
      </div>
    </div>
  );
}
