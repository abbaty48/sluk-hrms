import { useASSharedContext } from "./AdminSettingsStates";
import { Button } from "@sluk/src/components/ui/button";
import { Plus } from "lucide-react";

type Props = {
  header: string;
  subTitle: string;
  addLabel: string;
};

export function ASSharedHeader({ header, subTitle, addLabel }: Props) {
  const { changeStates } = useASSharedContext();
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{header}</h2>
        <p className="text-sm text-muted-foreground">{subTitle}</p>
      </div>
      <Button
        onClick={() => changeStates({ action: "create", openDialog: true })}
      >
        <Plus className="h-4 w-4 mr-1" />
        {addLabel}
      </Button>
    </div>
  );
}
