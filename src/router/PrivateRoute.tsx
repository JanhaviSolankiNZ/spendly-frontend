import { useAuthStore } from '@/store/authStore'

import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
     const authStatus = useAuthStore((s) => s.authStatus);

    if (authStatus === "unauthenticated") {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet/>
}

export default PrivateRoute
