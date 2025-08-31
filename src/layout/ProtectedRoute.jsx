import { getAccessToken } from '../common/utils/token';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { loginRoutes, noLoginRoutes } from '../common/utils/routes';

const ProtectedRoute = () => {
  const location = useLocation();
  const token = getAccessToken();

  if (token == null && loginRoutes.has(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  if (token && noLoginRoutes.has(location.pathname)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
