import { SelectItem } from "./ui/select";
import type { ReactNode } from "react";
import type { TStaff } from "../types/staffTypes";
import { useStaffAPI } from "../hooks/api/useAdminStaffApi";

export function StaffSelectItems({
  render,
}: {
  render: (staff: TStaff) => ReactNode;
}) {
  const { data } = useStaffAPI({ all: true });

  return data.map((staff) => (
    <SelectItem key={staff.id} value={staff.id}>
      {render(staff)}
    </SelectItem>
  ));
}
