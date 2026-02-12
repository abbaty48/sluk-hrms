import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./states/providers/ThemeProvider";
import { DashBoardPage } from "@/pages/dashboard/DashboardPage";
import { DashBoardMain } from "@/pages/dashboard/Dashboard";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/utils";

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={routers} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
