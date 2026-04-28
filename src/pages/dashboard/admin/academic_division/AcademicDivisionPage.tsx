import { Motion } from "@sluk/src/components/Motion";
import { AcademicDivisionPageTabs } from "./AcademicDivisionPageTabs";
import { AcademicDivisionPageStats } from "./AcademicDivisionPageStats";
import { AcademicDivisionPageHeader } from "./AcademicDivisionPageHeader";

const Component = function AcademicDivision() {
  return (
    <Motion element="main" className="flex-1 p-4 lg:p-6 overflow-auto">
      <div className="animate-fade-in">
        {/* Header */}
        <AcademicDivisionPageHeader />
        {/* Stats Cards */}
        <AcademicDivisionPageStats />
        {/* Tabs */}
        <AcademicDivisionPageTabs />
      </div>
    </Motion>
  );
};

export default Component;
