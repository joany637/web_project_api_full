import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, loggedIn }) {
  if (!loggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export default ProtectedRoute;