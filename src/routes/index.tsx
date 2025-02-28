import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "./dashboard-layout";
import { QRCodesPage } from "../features/qr-codes/components/page";
import { RegisterPage } from "../pages/register";
import { LoginPage } from "../pages/login";
import { AuthGuard } from "./auth-guard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: <div>Dashboard Page</div>,
      },
      {
        path: "qr-codes",
        element: <QRCodesPage />,
      },
      {
        path: "settings",
        element: <div>Settings Page</div>,
      },
    ],
  },
]);
