import { useAuthStore } from '@/store/authStore'

import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = () => {
    const user = useAuthStore((s) => s.user);
    const location = useLocation();
    if(!user){
       return <Navigate to="/signin" state={{from: location}} />;
    }
    return <Outlet/>
}

export default PrivateRoute
