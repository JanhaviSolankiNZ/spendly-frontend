import { useAuthStore } from '@/store/authStore'

import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const user = useAuthStore((s) => s.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
