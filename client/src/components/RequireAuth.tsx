import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/auth.js';

export default function RequireAuth() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-night">
        <span className="text-parchment text-sm animate-pulse">Loading…</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
