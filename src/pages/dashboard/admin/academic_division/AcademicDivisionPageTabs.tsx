import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@sluk/src/components/ui/tabs";
import { AcademicDivisionExtensions } from "./extensions/AcademicDivisionExtensions";
import { AcademicDivisionPageOverviewTab } from "./overview/AcademicDivisionPageOverviewTab";

export function AcademicDivisionPageTabs() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="extensions">Extensions</TabsTrigger>
        <TabsTrigger value="alarts">Alarts</TabsTrigger>
      </TabsList>
      {/*  */}
      <TabsContent value="overview">
        <AcademicDivisionPageOverviewTab />
      </TabsContent>
      {/*  */}
      <TabsContent value="extensions">
        <AcademicDivisionExtensions />
      </TabsContent>
      {/*  */}
      <TabsContent value="alarts"></TabsContent>
    </Tabs>
  );
}
