import type { ASSharedMutateHooks } from "./AdminSettingsStates";
import { AdminSettingsProvider } from "./AdminSettingsProvider";
import { ASSharedDialog } from "./AdminSettingsDialog";
import { ASSharedHeader } from "./AdminSettingsHeader";
import { ASSharedSearch } from "./AdminSettingsSearch";
import { ASSharedList } from "./AdminSettingsList";
import type { PropsWithChildren } from "react";
/**
 *
 */
export function AdminSettings({
  children,
  ...hooks
}: PropsWithChildren & ASSharedMutateHooks) {
  return <AdminSettingsProvider {...hooks}>{children}</AdminSettingsProvider>;
}

AdminSettings.Header = ASSharedHeader;
AdminSettings.Search = ASSharedSearch;
AdminSettings.Dialog = ASSharedDialog;
AdminSettings.List = ASSharedList;
