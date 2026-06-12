import { Outlet } from "react-router-dom";
import Navbar from "@/features/auth/components/Navbar";

const AuthLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex items-center justify-center overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;