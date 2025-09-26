import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/settings" replace />;
  return <>{children}</>;
}


