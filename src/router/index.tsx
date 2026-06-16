import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import MainLayout from "@/layouts/MainLayout";
import {
  LandingPage,
  SignInPage,
  SignUpPage,
  GoogleSuccess,
  DashboardPage,
  ExpensePage,
  AddExpensePage,
  IncomesPage,
  AnalyticsPage,
  BudgetsPage,
  PaymentSuccess,
  PaymentCancel,
  Settings
} from "./LazyPages";

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
      { path: "/auth/google/success", element: <GoogleSuccess /> },
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
            element: <AddExpensePage />,
          },
          {
            path: "/expenses/add",
            element: <AddExpensePage />,
          },
          {
            path: "/expenses",
            element: <ExpensePage />,
          },
          {
            path: "/incomes",
            element: <IncomesPage />,
          },
          {
            path: "/analytics",
            element: <AnalyticsPage />,
          },
          {
            path: "/budgets",
            element: <BudgetsPage />,
          },
          { path: "/payment/success", element: <PaymentSuccess /> },
          { path: "/payment/cancel", element: <PaymentCancel /> },
          { path: "/settings", element: <Settings /> },
        ],
      },
    ],
  },
]);

export default router;
