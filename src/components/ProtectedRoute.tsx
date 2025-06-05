
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // If user is authenticated and on the root path, check project selection
    if (user && location.pathname === '/') {
      const selectedProject = localStorage.getItem('selectedProject');
      if (!selectedProject) {
        // Redirect to project selection if no project is selected
        window.location.href = '/project-selection';
      }
    }
  }, [user, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">F</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Allow access to project selection and show-verse-tracker without project selection check
  if (location.pathname === '/project-selection' || location.pathname.startsWith('/show-verse-tracker')) {
    return <Outlet />;
  }

  // For FinTrackr routes, check if project is selected
  const selectedProject = localStorage.getItem('selectedProject');
  if (!selectedProject && location.pathname !== '/project-selection') {
    return <Navigate to="/project-selection" replace />;
  }

  return <Outlet />;
};
