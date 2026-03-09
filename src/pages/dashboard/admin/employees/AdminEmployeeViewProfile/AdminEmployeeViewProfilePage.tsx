import { AdminEmployeeViewProfile } from "./AdminEmployeeViewProfile";
import { AEVPSkeleton } from "./AdminEmployeeViewProfilePageSkeleton";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { useNavigate, useParams } from "react-router-dom";
import { Suspense } from "react";

export default function AdminEmployeeViewProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/admin/employees/${id}/edit`);
  };

  return (
    <QueryErrorBoundary message="Failed to Load Employee Profile">
      <Suspense fallback={<AEVPSkeleton staffId={id} handleBack={handleBack} />}>
        <AdminEmployeeViewProfile staffId={id} handleBack={handleBack} handleEdit={handleEdit} />
      </Suspense>
    </QueryErrorBoundary>
  );
}
