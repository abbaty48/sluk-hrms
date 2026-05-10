import { useResponsibilityAPI } from "@sluk/src/hooks/api/useAdminSettingsAPI";
import { AdminSettings } from "./shared/AdminSettings";

export function AdminSettingsResponsibilitiesTab() {
  const {
    useResponsibilities,
    useCreateResponsibility,
    useDeleteResponsibility,
    useUpdateResponsibility,
  } = useResponsibilityAPI;
  return (
    <AdminSettings
      fetchHook={useResponsibilities}
      createHook={useCreateResponsibility}
      deleteHook={useDeleteResponsibility}
      updateHook={useUpdateResponsibility}
    >
      {/**/}
      <AdminSettings.Header
        addLabel="Add Responsibility"
        header="Responsibilities"
        subTitle="Manage staff responsibilities and duties"
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
