import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { lazy, useState } from "react";

const AcademicQualifications = lazy(() => import('./EmployeeQualification'));
const EmployeeAppointments = lazy(() => import('./EmployeeAppointment'));
const EmployeePersonality = lazy(() => import('./EmployeePersonal'));
const EmploymentHistory = lazy(() => import('./EmploymentHistory'));

export default function EmployeeProfileTabs() {
  const [section, setSection] = useState("personal");

  return (
    <div className="space-y-6">

      {/* Toggle Buttons */}
      <ToggleGroup
        type="single"
        value={section}
        onValueChange={(val) => val && setSection(val)}
        className="bg-muted p-1 rounded-lg w-fit"
      >
        <ToggleGroupItem value="personal">
          Personal Info
        </ToggleGroupItem>

        <ToggleGroupItem value="qualification">
          Qualification
        </ToggleGroupItem>

        <ToggleGroupItem value="appointment">
          Appointment
        </ToggleGroupItem>

        <ToggleGroupItem value="history">
          Employment History
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Section Content */}
      {section === "qualification" && <AcademicQualifications />}
      {section === "appointment" && <EmployeeAppointments />}
      {section === "personal" && <EmployeePersonality />}
      {section === "history" && <EmploymentHistory />}
    </div>
  );
}
