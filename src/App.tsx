import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashBoardPage } from "@/pages/dashboard/DashboardPage";
import { DashBoardMain } from "@/pages/dashboard/Dashboard";
import { ThemeProvider } from "./states/providers/ThemeProvider";

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

  return (
    <ThemeProvider>
      <RouterProvider router={routers} />
    </ThemeProvider>
  );
}

export default App;
