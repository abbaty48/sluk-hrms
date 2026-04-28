import { useAdminRank } from "@/hooks/api/useAdminDepartment";
import { SelectItem } from "./ui/select";

export function RankSelectItems() {
  const { data: ranks } = useAdminRank();

  return ranks.data.map((rank) => (
    <SelectItem key={rank.id} value={rank.id}>
      {rank.title}
    </SelectItem>
  ));
}
