import { useAdminRank } from "@/hooks/api/useAdminDepartment";
import { SelectItem } from "./ui/select";

export function RankSelectItems() {
  const { ranks } = useAdminRank();

  return ranks.map((rank) => (
    <SelectItem key={rank.id} value={rank.id}>
      {rank.title}
    </SelectItem>
  ));
}
