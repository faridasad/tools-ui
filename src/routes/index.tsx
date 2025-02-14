import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "../shared/layouts/dashboard-layout";
import { QRCodesPage } from "../features/qr-codes/components/page";

export const router = createBrowserRouter([
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
