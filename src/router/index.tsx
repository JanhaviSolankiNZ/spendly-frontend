import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import SignInPage from "@/pages/signin/SignInPage";
import SignUpPage from "@/pages/signup/SignUpPage";
import LandingPage from "@/pages/landing/LandingPage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import MainLayout from "@/layouts/MainLayout";
import ExpensePage from "@/pages/expense/ExpensePage";
import DashboardPage from "@/pages/dashboard/DashboardPage";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: "/", element: <LandingPage /> },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/signin",
            element: <SignInPage />,
          },
          {
            path: "/signup",
            element: <SignUpPage />,
          },
        ],
      },
    ],
  },
  {
    element: <PrivateRoute/>,
    children: [
      {
        element: <MainLayout/>,
        children: [
           {
        path: "/dashboard",
        element: <DashboardPage/>
      },
       {
        path: "/expenses",
        element: <ExpensePage/>
      }
        ]
      },

    ]
  }
]);

export default router;
