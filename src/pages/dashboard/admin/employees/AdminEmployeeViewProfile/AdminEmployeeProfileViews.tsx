import {
  Mail,
  Hash,
  Flag,
  User,
  Clock,
  Globe,
  Phone,
  Expand,
  Library,
  Building,
  Calendar,
  BookOpen,
  Briefcase,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import {
  AEVPInfoItem,
  AEVPLabelItem,
  AEVPInputItem,
  AEVPRankInfoItem,
  AEVPDateInfoItem,
  AEVPSelectInfoItem,
  AEVPDepartmentInfoItem,
  AEVInfoShimmer,
} from "./AdminEmployeeProfilePageComponents";
import type {
  TStaffDetails,
  TStaffProfileUpdateRequest,
} from "@/types/staffTypes";
import { Suspense, useRef } from "react";
import { useForm } from "react-hook-form";
import { Motion } from "@/components/Motion";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@sluk/src/components/EmptyState";
import { SelectItem } from "@sluk/src/components/ui/select";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useEmployeeStudyLeave } from "@sluk/src/hooks/api/useEmployeeAPI";
import { formatPhoneNumber, getStaffStatusLabel, name } from "@/lib/utils";
import type { TLeaveStudyDetails } from "@sluk/src/types/leave-managementTypes";
import { useEmployeeExtensionRequest } from "@sluk/src/hooks/api/useAcademicDivisionAPI";

type TabProps = {
  isUpdating: boolean;
  isEditing: boolean;
  employee: TStaffDetails;
  handleSaveEdit: () => void;
};

/**
 * EmployeeProfilePersonalViews
 */
export function EmployeeProfilePersonalView({
  employee,
  isEditing,
  isUpdating,
  handleSaveEdit,
}: TabProps) {
  const formRef = useRef<HTMLFormElement | null>(null);

  /*
   */
  const { handleSubmit, ...formHook } = useForm<TStaffProfileUpdateRequest>({
    defaultValues: {
      name: name(employee),
      email: employee.email,
      phone: employee.phone,
      rankId: employee.rankId,
      departmentId: employee.departmentId ?? "N/A",
      joinOn: employee.dateOfFirstAppointment
        ? new Date(employee.dateOfFirstAppointment).toISOString()
        : new Date().toDateString(),
    },
  });
  /**
   *
   */

  return (
    <form
      ref={formRef}
      className="space-y-6"
      onSubmit={handleSubmit(handleSaveEdit)}
    >
      {/* Personal Information */}
      <Motion variant="fadeUp" delay={0.2}>
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-card-foreground mb-2">
            Personal Information
          </h3>

          <fieldset
            disabled={isUpdating}
            className="grid grid-cols-1 sm:grid-cols-2 gap-1"
          >
            <AEVPInfoItem
              name=""
              icon={Hash}
              label="Employee ID"
              value={employee.id}
            />

            <AEVPInfoItem
              name="name"
              isRequired
              icon={Briefcase}
              label="Full Name"
              formHook={formHook}
              value={name(employee)}
              isEditing={isEditing}
              requiredMessage="Staff name must be provided, but omitted."
            />

            <AEVPInfoItem
              icon={Mail}
              isRequired
              name="email"
              label="Email Address"
              formHook={formHook}
              value={employee.email}
              isEditing={isEditing}
              requiredMessage="Staff email must be provided, but omitted."
            />

            <AEVPInfoItem
              icon={Phone}
              name="phone"
              isRequired
              label="Phone Number"
              formHook={formHook}
              isEditing={isEditing}
              value={formatPhoneNumber(employee.phone || "N/A")}
              requiredMessage="Staff phone number must be provided, but omitted."
            />
          </fieldset>
        </Card>
      </Motion>

      {/* Work Information */}
      <Motion variant="fadeUp" delay={0.3}>
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-card-foreground mb-2">
            Work Information
          </h3>

          <fieldset
            className="grid grid-cols-1 sm:grid-cols-2 gap-1"
            disabled={isUpdating}
          >
            <AEVPDepartmentInfoItem
              isRequired
              icon={Building}
              name="department"
              isEditing={isEditing}
              value={employee.department?.id || "N/A"}
              label={employee.department?.name || "N/A"}
            />

            <AEVPRankInfoItem
              name="rank"
              isRequired
              icon={Briefcase}
              isEditing={isEditing}
              label={employee.rank}
              value={employee.rankId}
            />

            <AEVPInfoItem
              icon={Flag}
              name="status"
              label="Status"
              value={getStaffStatusLabel(employee.status)}
            />

            <AEVPDateInfoItem
              name="joinOn"
              icon={Calendar}
              label="Join Date"
              isEditing={isEditing}
              value={
                employee.dateOfFirstAppointment
                  ? new Date(employee.dateOfFirstAppointment).toDateString()
                  : ""
              }
            />
          </fieldset>
        </Card>
      </Motion>
    </form>
  );
}

/***
 ** EmployeeProfileStudyLeaveViews
 */
export function EmployeeProfileStudyLeaveView(
  props: Omit<TabProps, "employee"> & { employeeID: string },
) {
  return (
    <QueryErrorResetBoundary>
      <Suspense fallback={<AEVInfoShimmer n={8} title="" />}>
        <StudyLeaveView {...props} />
      </Suspense>
    </QueryErrorResetBoundary>
  );
}

/***
 ***
 **/
function StudyLeaveView({
  employeeID,
  isEditing,
  isUpdating,
  handleSaveEdit,
}: Omit<TabProps, "employee"> & { employeeID: string }) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const studyLeaveDetails = useEmployeeStudyLeave(employeeID);
  const { handleSubmit, ...formHook } = useForm<TLeaveStudyDetails>({
    defaultValues: {
      country: studyLeaveDetails?.country || "",
      programme: studyLeaveDetails?.programme || "",
      payStatus: studyLeaveDetails?.payStatus || "WithPayment",
      studyMode: studyLeaveDetails?.studyMode || "FULL_TIME",
      degreeType: studyLeaveDetails?.degreeType || "BSC",
      institution: studyLeaveDetails?.institution || "",
      durationYear: studyLeaveDetails?.durationYear || 1,
      leaveCategory: studyLeaveDetails?.leaveCategory || "Study",
      sponsorshipType: studyLeaveDetails?.sponsorshipType || "Others",
      guarantor_NextOfKin: studyLeaveDetails?.guarantor_NextOfKin || "",
    },
  });

  if (!studyLeaveDetails) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="No Study Leave."
        className="bg-card rounded-md border"
        description={"Staff have no study leave applied."}
      />
    );
  }

  const {
    country,
    payStatus,
    programme,
    studyMode,
    degreeType,
    institution,
    durationYear,
    leaveCategory,
    sponsorshipType,
    guarantor_NextOfKin,
  } = studyLeaveDetails;
  /**
   */
  return (
    <form
      ref={formRef}
      className="space-y-6"
      onSubmit={handleSubmit(handleSaveEdit)}
    >
      {/* Study Leave Details */}
      <Motion variant="fadeUp" delay={0.2}>
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-card-foreground mb-2">
            Study Leave Details
          </h3>

          <fieldset
            disabled={isUpdating}
            className="grid grid-cols-1 sm:grid-cols-2 gap-1"
          >
            {/*Institution Attended*/}
            <AEVPInfoItem
              name="institution"
              isRequired
              formHook={formHook}
              value={institution}
              isEditing={isEditing}
              icon={GraduationCap}
              label="Institution Attended"
              requiredMessage="Institution is required"
            />

            {/*Degree Type*/}
            <AEVPSelectInfoItem
              isRequired
              name="degreeType"
              icon={GraduationCap}
              label="Degree Type"
              formHook={formHook}
              value={degreeType}
              isEditing={isEditing}
              requiredMessage="Degree type is required"
            >
              <SelectItem value="BSC">BSC</SelectItem>
              <SelectItem value="PGD">PGD</SelectItem>
              <SelectItem value="MSC">MSC</SelectItem>
            </AEVPSelectInfoItem>

            {/*Country*/}
            <AEVPInfoItem
              icon={Globe}
              isRequired
              name="country"
              label="Country"
              value={country!}
              formHook={formHook}
              isEditing={isEditing}
              requiredMessage="Staff email must be provided, but omitted."
            />
            <></>

            {/*Programme*/}
            <AEVPInputItem
              type="text"
              isRequired
              icon={Library}
              name="programme"
              label="Programme"
              value={programme}
              formHook={formHook}
              isEditing={isEditing}
              requiredMessage="Programme must be provided, but omitted."
            />

            {/*Mode*/}
            <AEVPSelectInfoItem
              isRequired
              icon={Clock}
              name="mode"
              label="Mode"
              value={studyMode}
              formHook={formHook}
              isEditing={isEditing}
            >
              <SelectItem value="FULL_TIME">Full-time</SelectItem>
              <SelectItem value="PART_TIME">Part-time</SelectItem>
            </AEVPSelectInfoItem>

            {/*Date of Approval*/}
            <AEVPDateInfoItem
              isRequired
              name="date"
              icon={Calendar}
              formHook={formHook}
              isEditing={isEditing}
              label="Date of Approval"
              value={"N/A"}
            />
          </fieldset>
        </Card>
      </Motion>

      {/* Duration & Sponshorship */}
      <Motion variant="fadeUp" delay={0.3}>
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-card-foreground mb-2">
            Duration & Sponsorship
          </h3>

          <fieldset
            className="grid grid-cols-1 sm:grid-cols-2 gap-1"
            disabled={isUpdating}
          >
            {/*Start Date*/}
            <AEVPDateInfoItem
              isRequired
              icon={Building}
              name="start_date"
              isEditing={isEditing}
              value={""}
              label={"Start Date"}
            />

            {/*Expected Completion*/}
            <AEVPDateInfoItem
              name="rank"
              isRequired
              icon={Calendar}
              isEditing={isEditing}
              label={"Expected Completion"}
              value={""}
            />

            {/*Duration*/}
            <AEVPInputItem
              icon={Clock}
              type="number"
              name="duration"
              label="Duration"
              value={durationYear}
              isEditing={isEditing}
            />

            {/*Sponsorship Type*/}
            <AEVPSelectInfoItem
              name="sponsorshipType"
              icon={DollarSign}
              label="Sponsorship Type"
              isEditing={isEditing}
              value={sponsorshipType}
            >
              <SelectItem value="Self">Self Sponsorship</SelectItem>
              <SelectItem value="StateGovernment">
                State Gov't Sponsorship
              </SelectItem>
              <SelectItem value="University">
                University Base Sponsorship
              </SelectItem>
              <SelectItem value="TedFund">TedFund Sponsorship</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </AEVPSelectInfoItem>

            {/*Leave Type */}
            <AEVPSelectInfoItem
              name="leaveType"
              icon={BookOpen}
              label="Leave Type"
              isEditing={isEditing}
              value={leaveCategory}
            >
              <SelectItem value="Study">Study Leave</SelectItem>
              <SelectItem value="Work">Work Leave</SelectItem>
            </AEVPSelectInfoItem>

            {/*Pay Status */}
            <AEVPSelectInfoItem
              name="payStatus"
              icon={DollarSign}
              label="Pay Status"
              isEditing={isEditing}
              value={payStatus || ""}
            >
              <SelectItem value="WithPay">With Pay</SelectItem>
              <SelectItem value="WithoutPay">Without Pay</SelectItem>
            </AEVPSelectInfoItem>

            {/*Guarantor / Next of Kin*/}
            <AEVPInputItem
              type="text"
              icon={User}
              isEditing={isEditing}
              // formHook={formHook}
              name={"guarantor_NextOfKin"}
              value={guarantor_NextOfKin || "N/A"}
              label={"Guarantor / Next of Kin"}
            />
          </fieldset>
        </Card>
      </Motion>

      {/* Extension & Remarks */}
      <EmployeeExtensionRequest staffID={employeeID} />
    </form>
  );
}

/***
 * EXTENSION REQUEST
 */

function EmployeeExtensionRequest({ staffID }: { staffID: string }) {
  return (
    <QueryErrorResetBoundary>
      <Suspense fallback={<AEVInfoShimmer n={4} title="Extension Request" />}>
        <ExtensionRequest staffID={staffID} />
      </Suspense>
    </QueryErrorResetBoundary>
  );
}

function ExtensionRequest({ staffID }: { staffID: string }) {
  const XR = useEmployeeExtensionRequest(staffID);

  if (!XR) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="No Extension Request."
        className="bg-card rounded-md border"
        description={"Staff have no extension request added to."}
      />
    );
  }

  return (
    <Motion variant="fadeUp" delay={0.3}>
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-card-foreground mb-2">
          Extension & Remarks
        </h3>

        <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {/*Extension Approved*/}
          <AEVPLabelItem
            icon={Expand}
            label={"Extension Approved"}
            value={XR.status === "Approved" ? "Yes" : "No"}
          />
          {/*Extension Months*/}
          <AEVPLabelItem
            icon={Clock}
            label={"Extension Months"}
            value={`${XR.durationMonths} Months`}
          />
          {/*Extension Mode*/}
          <AEVPLabelItem
            icon={Clock}
            value={XR.extension}
            label={"Extension Mode"}
          />
        </fieldset>
      </Card>
    </Motion>
  );
}
