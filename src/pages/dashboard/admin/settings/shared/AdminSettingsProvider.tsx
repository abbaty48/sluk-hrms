import {
  ASSharedContext,
  type ASSharedStates,
  initialASSharedStates,
  type ASSharedMutateHooks,
} from "./AdminSettingsStates";
import { useState, type PropsWithChildren } from "react";

export function AdminSettingsProvider({
  children,
  fetchHook,
  createHook,
  deleteHook,
  updateHook,
}: PropsWithChildren & ASSharedMutateHooks) {
  /** */
  const [states, setStates] = useState<ASSharedStates>(initialASSharedStates);
  /** */

  /** */
  const changeStates = (state: Partial<ASSharedStates>) =>
    setStates((prevStates) => ({ ...prevStates, ...state }));
  /** */
  const resetStates = () => setStates(initialASSharedStates);
  /** */
  const values = {
    ...states,
    fetchHook,
    deleteHook,
    createHook,
    updateHook,
    changeStates,
    resetStates,
  };
  /** */
  return (
    <ASSharedContext.Provider value={values}>
      {children}
    </ASSharedContext.Provider>
  );
}
