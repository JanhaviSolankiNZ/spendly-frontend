import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import SignInPage from "@/pages/signin/SignInPage";
import SignUpPage from "@/pages/signup/SignUpPage";
import LandingPage from "@/pages/landing/LandingPage";

const router = createBrowserRouter([
    {
        element: <AuthLayout/>,
        children: [
            {
                path: "/signin",
                element: <SignInPage/>
            },
            {
                path: "/signup",
                element: <SignUpPage/>
            }
        ]
    },
    {
        path: "/",
        element: <LandingPage/>
    }
]);

export default router;