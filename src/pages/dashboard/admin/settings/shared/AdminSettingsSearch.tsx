import { Card, CardContent } from "@sluk/src/components/ui/card";
import { useASSharedContext } from "./AdminSettingsStates";
import { Button } from "@sluk/src/components/ui/button";
import { Input } from "@sluk/src/components/ui/input";
import { SearchIcon } from "lucide-react";

export function ASSharedSearch() {
  const { changeStates, resetStates, searchTerm } = useASSharedContext();
  return (
    <Card>
      <CardContent>
        <div className="space-y-3.5">
          <div className="flex gap-2 items-center">
            <SearchIcon />
            <Input
              type="search"
              value={searchTerm}
              placeholder="Search entities."
              onChange={(e) =>
                changeStates({ searchTerm: e.currentTarget.value })
              }
            />
          </div>
          {searchTerm && (
            <Button type="button" variant={"ghost"} onClick={resetStates}>
              Clear search
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
