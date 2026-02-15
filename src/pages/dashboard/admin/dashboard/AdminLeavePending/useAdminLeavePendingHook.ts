import {
  useRejectLeave,
  useApproveLeave,
  useInfinitePendingLeaves,
} from "@sluk/src/hooks/api/useAdminApi";
import { useOptimistic, useTransition } from "react";

export const useAdminLeavePendingHook = (departmentId?: string) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfinitePendingLeaves(departmentId, 5);

  const [optimisticData, setOptimisticData] = useOptimistic(
    data,
    (states, payload) => {
      if (typeof payload === "string") {
        return states.filter((state) => state.id !== payload);
      } else return [payload, ...states];
    },
  );
  const [isPending, startTransition] = useTransition();
  const { mutateAsync: rejectLeave } = useRejectLeave();
  const { mutateAsync: approveLeave } = useApproveLeave();

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
    optimisticData,
    isPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    handleReject,
    handleApprove,
  };
};
