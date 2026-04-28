import {
  useLeavePending,
  useLeaveApproval,
  useLeaveRejection,
} from "@sluk/src/hooks/api/useAdminLeave";
import { useOptimistic, useTransition } from "react";

export const useAdminLeavePendingHook = (departmentId?: string) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useLeavePending(departmentId, 5);

  const [optimisticData, setOptimisticData] = useOptimistic(
    data,
    (states, payload: any) => {
      if (typeof payload === "string") {
        return states.filter((state) => state.id !== payload);
      } else return [payload, ...states];
    },
  );
  const [isPending, startTransition] = useTransition();
  const { mutateAsync: rejectLeave } = useLeaveRejection();
  const { mutateAsync: approveLeave } = useLeaveApproval();

  const handleReject = (id: string) => {
    startTransition(async () => {
      setOptimisticData(id);
      await rejectLeave(id);
    });
  };

  const handleApprove = (id: string) => {
    startTransition(async () => {
      setOptimisticData(id);
      await approveLeave(id);
    });
  };

  return {
    isPending,
    hasNextPage,
    handleReject,
    fetchNextPage,
    handleApprove,
    optimisticData,
    isFetchingNextPage,
  };
};
