import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import SignInPage from "@/pages/signin/SignInPage";
import SignUpPage from "@/pages/signup/SignUpPage";
import LandingPage from "@/pages/landing/LandingPage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import MainLayout from "@/layouts/MainLayout";

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
        path: "/dashboard",
        element: <MainLayout/>
      }
    ]
  }
]);

export default router;
