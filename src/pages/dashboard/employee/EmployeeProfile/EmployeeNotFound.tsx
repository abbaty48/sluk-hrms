import { Card } from "@sluk/src/components/ui/card";
import EmployeeProfileAvatar from "./EmployeeProfileAvatar";

export function EmployeeNotFound() {
  return (
    <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card rounded-xl shadow p-6 flex items-center gap-6 justify-center">
      <EmployeeProfileAvatar name={"Unknown User"} image={null} />

      <div>
        <h2 className="text-2xl font-bold">Unknown User</h2>
        <p className="text-muted-foreground">N/A · N/A</p>
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        We couldn't load the employee data. possibly due to a network issue or
        the employee record doesn't exist. Please try again later or contact
        support if the issue persists.data.name
      </p>
    </Card>
  );
}
