import { useAuthStore } from '@/store/authStore'
import { Loader2 } from 'lucide-react';

import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = () => {
    const user = useAuthStore((s) => s.user);
    const isHydrating  = useAuthStore((s) => s.isHydrating );
    const location = useLocation();

    if (isHydrating) {
    return <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin" />
    </div>;
  }
    if(!user){
       return <Navigate to="/signin" state={{from: location}} />;
    }
    return <Outlet/>
}

export default PrivateRoute
