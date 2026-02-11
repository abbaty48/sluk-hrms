import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashBoardPage } from "@/pages/dashboard/DashboardPage";
import { DashBoardMain } from "@/pages/dashboard/Dashboard";

function App() {
  const routers = createBrowserRouter([
    {
      path: "/",
      element: <DashBoardPage />,
      children: [
        { index: true, path: "/", element: <DashBoardMain /> },
        // { path: "/attendance", lazy: () => import("@/pages/dashboard/") },
        // { path: "/recruitment", lazy: () => import("@/pages/dashboard/") },
        // { path: "/employees", lazy: () => import("@/pages/dashboard/") },
        // { path: "/payroll", lazy: () => import("@/pages/dashboard/") },
        // { path: "/reports", lazy: () => import("@/pages/dashboard/") },
        // { path: "/settings", lazy: () => import("@/pages/dashboard/") },
      ],
    },
    // { path: '/auth', lazy: () => import('@/pages/auth/AuthPage') },
  ]);

  return <RouterProvider router={routers} />;
}

export default App;
