import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from './DashboardLayout';
import { UserLandingLayout } from './UserLandingLayout';

export function AuthenticatedLayout() {
  const { user } = useAuth();

  if (user?.role === 'user') {
    return <UserLandingLayout />;
  }
  return <DashboardLayout />;
}

