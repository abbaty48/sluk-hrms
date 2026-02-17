import type { PropsWithChildren } from "react";

export function AdminEmployeesPageHeader({ children }: PropsWithChildren) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="page-title">Employee Records</h1>
        <p className="page-subtitle">8 of 8 staff members</p>
      </div>
      {children}
    </header>
  );
}
