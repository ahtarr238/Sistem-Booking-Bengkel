import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthenticatedLayout } from './layouts/AppLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { UserLandingLayout } from './layouts/UserLandingLayout';
import { LoginPage } from './pages/LoginPage';
import { CatalogPage } from './pages/CatalogPage';
import { BookingPage } from './pages/BookingPage';
import { QueuePage } from './pages/QueuePage';
import { SalePage } from './pages/SalePage';
import { SalesListPage } from './pages/SalesListPage';
import { LowStockPage } from './pages/LowStockPage';
import { PartsAdminPage } from './pages/PartsAdminPage';
import { ReportsPage } from './pages/ReportsPage';

function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const loc = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }
  return <Outlet />;
}

function RoleGate({ roles, children }) {
  const { user } = useAuth();
  if (!roles.includes(user?.role)) {
    return <Navigate to="/catalog" replace />;
  }
  return children;
}

function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

function CatalogLayout() {
  const { user } = useAuth();
  if (user?.role === 'admin') {
    return <Navigate to="/admin/parts" replace />;
  }
  if (user?.role === 'kasir') {
    return <DashboardLayout />;
  }
  return <UserLandingLayout />;
}

const appChildRoutes = [
  { index: true, element: <Navigate to="/catalog" replace /> },
  {
    path: 'booking',
    element: (
      <RoleGate roles={['user']}>
        <BookingPage />
      </RoleGate>
    ),
  },
  {
    path: 'queue',
    element: (
      <RoleGate roles={['kasir', 'admin']}>
        <QueuePage />
      </RoleGate>
    ),
  },
  {
    path: 'sales/new',
    element: (
      <RoleGate roles={['kasir', 'admin']}>
        <SalePage />
      </RoleGate>
    ),
  },
  {
    path: 'sales',
    element: (
      <RoleGate roles={['kasir', 'admin']}>
        <SalesListPage />
      </RoleGate>
    ),
  },
  {
    path: 'admin/low-stock',
    element: (
      <RoleGate roles={['admin']}>
        <LowStockPage />
      </RoleGate>
    ),
  },
  {
    path: 'admin/parts',
    element: (
      <RoleGate roles={['admin']}>
        <PartsAdminPage />
      </RoleGate>
    ),
  },
  {
    path: 'admin/reports',
    element: (
      <RoleGate roles={['admin']}>
        <ReportsPage />
      </RoleGate>
    ),
  },
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/catalog" replace /> },
      { path: 'login', element: <LoginPage /> },
      {
        element: <CatalogLayout />,
        children: [{ path: 'catalog', element: <CatalogPage /> }],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AuthenticatedLayout />,
            children: appChildRoutes,
          },
        ],
      },
      { path: '*', element: <Navigate to="/catalog" replace /> },
    ],
  },
]);
