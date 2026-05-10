import { useAppointmentAPI } from "@sluk/src/hooks/api/useAdminSettingsAPI";
import { AdminSettings } from "./shared/AdminSettings";

export function AdminSettingsAppointmentsTab() {
  const {
    useAppointments,
    useCreateAppointment,
    useDeleteAppointment,
    useUpdateAppointment,
  } = useAppointmentAPI;
  return (
    <AdminSettings
      fetchHook={useAppointments}
      createHook={useCreateAppointment}
      deleteHook={useDeleteAppointment}
      updateHook={useUpdateAppointment}
    >
      {/**/}
      <AdminSettings.Header
        addLabel="Add Appointment Type"
        header="Nature of Appointments"
        subTitle="Manage employment appointment types and contracts."
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
