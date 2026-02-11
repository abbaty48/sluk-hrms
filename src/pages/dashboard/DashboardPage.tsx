import { Outlet } from "react-router-dom";

export function DashBoardPage() {
  return (
    <body>
      {/*Header*/}
      {/*Sidebar Navigation*/}
      {/*Main content*/}
      <main>
        <Outlet />
      </main>
    </body>
  );
}
