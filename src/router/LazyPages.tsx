import { lazy } from "react";

export const LandingPage = lazy(() =>
  import("@/features/landing/pages/LandingPage")
);

export const SignInPage = lazy(() =>
  import("@/features/auth/pages/signin/SignInPage")
);

export const SignUpPage = lazy(() =>
  import("@/features/auth/pages/signup/SignUpPage")
);

export const GoogleSuccess = lazy(() =>
  import("@/features/auth/pages/googleSuccess/GoogleSuccess")
);

export const DashboardPage = lazy(() =>
  import("@/features/dashboard/pages/DashboardPage")
);

export const ExpensePage = lazy(() =>
  import("@/features/expense/pages/ExpensePage")
);

export const AddExpensePage = lazy(() =>
  import("@/features/expense/pages/AddExpensePage")
);

export const IncomesPage = lazy(() =>
  import("@/features/income/pages/IncomesPage")
);

export const AnalyticsPage = lazy(() =>
  import("@/features/analytics/pages/AnalyticsPage")
);