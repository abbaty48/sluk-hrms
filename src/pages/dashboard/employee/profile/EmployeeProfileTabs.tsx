import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { lazy, useState } from "react"

const AcademicQualifications = lazy(() => import('./EmployeeQualification'))
const EmployeeAppointments   = lazy(() => import('./EmployeeAppointment'))
const EmployeePersonality    = lazy(() => import('./EmployeePersonal'))
const EmploymentHistory      = lazy(() => import('./EmploymentHistory'))

export default function EmployeeProfileTabs() {
  const [section, setSection] = useState("personal")

  return (
    <div className="space-y-6">

      {/* Toggle Buttons */}
      <div className="overflow-x-auto pb-1">
        <ToggleGroup
          type="single"
          value={section}
          onValueChange={(val) => val && setSection(val)}
          className="bg-muted p-1 rounded-lg flex w-max min-w-full sm:w-fit"
        >
          <ToggleGroupItem
            value="personal"
            className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap px-3 sm:px-4"
          >
            Personal Info
          </ToggleGroupItem>

          <ToggleGroupItem
            value="qualification"
            className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap px-3 sm:px-4"
          >
            Qualification
          </ToggleGroupItem>

          <ToggleGroupItem
            value="appointment"
            className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap px-3 sm:px-4"
          >
            Appointment
          </ToggleGroupItem>

          <ToggleGroupItem
            value="history"
            className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap px-3 sm:px-4"
          >
            History
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Section Content */}
      {section === "personal"       && <EmployeePersonality />}
      {section === "qualification"  && <AcademicQualifications />}
      {section === "appointment"    && <EmployeeAppointments />}
      {section === "history"        && <EmploymentHistory />}

    </div>
  )
}