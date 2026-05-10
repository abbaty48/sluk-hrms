import type { UseMutationResult } from "@tanstack/react-query";
import type { TPagination } from "@sluk/src/types/types";
import { createContext, use } from "react";

export type ASSharedEntity = {
  id: string;
  name?: string;
  title?: string;
  status?: string;
  isActive?: string;
  description?: string;
};

export type ASSharedMutateHooks = {
  fetchHook: (
    term?: string | undefined,
    page?: number,
  ) => {
    data: ASSharedEntity[];
    isFetching: boolean;
    pagination: TPagination | null;
  };
  //
  createHook: () => UseMutationResult<unknown, Error, any, unknown>;
  //
  deleteHook: () => UseMutationResult<any, Error, string, unknown>;
  //
  updateHook: () => UseMutationResult<
    unknown,
    Error,
    {
      id: string;
      data: Partial<any>;
    },
    unknown
  >;
};

export type ASSharedStates = {
  editEntity?: ASSharedEntity | null;
  searchTerm: string | undefined;
  action: "edit" | "create";
  openDialog: boolean;
  page: number;
  limit: string;
};

type ASSharedContext = ASSharedStates &
  ASSharedMutateHooks & {
    changeStates: (state: Partial<ASSharedStates>) => void;
    resetStates: () => void;
  };

export const initialASSharedStates: ASSharedStates = {
  searchTerm: "",
  openDialog: false,
  action: "create",
  editEntity: null,
  page: 1,
  limit: "5",
};

export const ASSharedContext = createContext<ASSharedContext | null>(null);

export function useASSharedContext(): ASSharedContext {
  const ctx = use(ASSharedContext);

  if (ctx === null) {
    throw new Error(
      "useASSharedContext must be used within an ASSharedContext.Provider. " +
        "Make sure the component is wrapped with the appropriate provider.",
    );
  }
  return ctx;
}
