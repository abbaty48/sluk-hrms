import { useState } from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import Personal from "./Personal";
import Appointment from "./Appointment";
import AcademicQualifications from "./Qualification";
import EmploymentHistory from "./EmployementHistory";


export default function ProfileTabs() {
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
      {section === "personal" && <Personal />}
      {section === "qualification" && <AcademicQualifications />}
      {section === "appointment" && <Appointment />}
      {section === "history" && <EmploymentHistory />}
    </div>
  );
}
