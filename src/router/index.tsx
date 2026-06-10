import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import SignInPage from "@/features/auth/pages/signin/SignInPage";
import SignUpPage from "@/features/auth/pages/signup/SignUpPage";
import LandingPage from "@/features/landing/pages/LandingPage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import MainLayout from "@/layouts/MainLayout";
import ExpensePage from "@/features/expense/pages/ExpensePage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import AddExpensePage from "@/features/expense/pages/AddExpensePage";

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
    element: <PrivateRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/expenses/:id",
            element: <AddExpensePage/>
          },
          {
            path: "/expenses/add",
            element: <AddExpensePage/>
          },
          {
            path: "/expenses",
            element: <ExpensePage />,
          }
        ],
      },
    ],
  },
]);

export default router;
