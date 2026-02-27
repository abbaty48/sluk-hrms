import { useAdminDepartment } from "@/hooks/api/useAdminDepartment";
import { SelectItem } from "./ui/select";

export function DepartmentSelectItems() {
  const { data } = useAdminDepartment();

  return data.map((department) => (
    <SelectItem key={department.id} value={department.id}>
      {department.name}
    </SelectItem>
  ));
}
