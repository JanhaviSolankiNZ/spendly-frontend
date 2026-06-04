import {Outlet} from "react-router-dom";
import Navbar from "@/features/auth/Navbar";



const AuthLayout = () => {
    return(
        <div className="min-h-screen">
            <Navbar />
            <Outlet />
        </div>
    )
}

export default AuthLayout;