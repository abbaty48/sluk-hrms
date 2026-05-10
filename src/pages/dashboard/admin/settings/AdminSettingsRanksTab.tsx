import { useRankAPI } from "@sluk/src/hooks/api/useAdminSettingsAPI";
import { AdminSettings } from "./shared/AdminSettings";

export function AdminSettingsRanksTab() {
  const { useRanks, useCreateRank, useDeleteRank, useUpdateRank } = useRankAPI;
  return (
    <AdminSettings
      fetchHook={useRanks}
      createHook={useCreateRank}
      deleteHook={useDeleteRank}
      updateHook={useUpdateRank}
    >
      {/**/}
      <AdminSettings.Header
        addLabel="Add Rank"
        header="Ranks"
        subTitle="Manage staff ranks and duties"
      />
      {/**/}
      <AdminSettings.Search />
      {/**/}
      <AdminSettings.List
        theaders={["S/N", "NAME", "DESCRIPTION", "STATUS", "ACTION"]}
      />
      {/**/}
      <AdminSettings.Dialog />
    </AdminSettings>
  );
}
