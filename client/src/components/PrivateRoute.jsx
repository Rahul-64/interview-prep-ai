import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext.jsx";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to landing page if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated
  return children;
};

export default PrivateRoute;
