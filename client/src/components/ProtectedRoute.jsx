import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, role } = useAuthStore();
  const location = useLocation();

  if (!user || !role) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
