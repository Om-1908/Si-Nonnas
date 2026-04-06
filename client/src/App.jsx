import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import queryClient from './lib/queryClient';
import useAuthStore from './stores/authStore';
import api from './lib/axios';

import CartDrawer from './components/CartDrawer';
import ToastContainer from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import ManagerLayout from './components/ManagerLayout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import Reservations from './pages/Reservations';
import Menu from './pages/Menu';
import QRMenu from './pages/QRMenu';
import OrderReview from './pages/OrderReview';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import Payment from './pages/Payment';
import Receipt from './pages/Receipt';
import KitchenDashboard from './pages/KitchenDashboard';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import MenuManagement from './pages/manager/MenuManagement';
import OrderOverview from './pages/manager/OrderOverview';
import Analytics from './pages/manager/Analytics';
import ReservationManagement from './pages/manager/ReservationManagement';
import ReviewManagement from './pages/manager/ReviewManagement';
import PaymentAudit from './pages/manager/PaymentAudit';

// Root layout that provides CartDrawer + Toast inside the router context
function RootLayout() {
  return (
    <>
      <Outlet />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public routes
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/', element: <Homepage /> },
      { path: '/reservations', element: <Reservations /> },
      { path: '/menu', element: <Menu /> },
      { path: '/qr-menu/:tableId', element: <QRMenu /> },
      { path: '/order/review', element: <OrderReview /> },
      { path: '/order/tracking/:orderId', element: <OrderTracking /> },
      { path: '/payment/:orderId', element: <Payment /> },
      { path: '/receipt/:orderId', element: <Receipt /> },

      // Customer protected
      {
        element: <ProtectedRoute allowedRoles={['customer']} />,
        children: [
          { path: '/profile', element: <Profile /> },
        ],
      },

      // Kitchen protected
      {
        element: <ProtectedRoute allowedRoles={['kitchen_staff']} />,
        children: [
          { path: '/kitchen', element: <KitchenDashboard /> },
        ],
      },

      // Manager protected
      {
        element: <ProtectedRoute allowedRoles={['manager']} />,
        children: [
          {
            element: <ManagerLayout />,
            children: [
              { path: '/manager', element: <ManagerDashboard /> },
              { path: '/manager/menu', element: <MenuManagement /> },
              { path: '/manager/orders', element: <OrderOverview /> },
              { path: '/manager/analytics', element: <Analytics /> },
              { path: '/manager/reservations', element: <ReservationManagement /> },
              { path: '/manager/reviews', element: <ReviewManagement /> },
              { path: '/manager/payments', element: <PaymentAudit /> },
            ],
          },
        ],
      },
    ],
  },
]);

function AuthValidator() {
  const { token, setAuth, clear } = useAuthStore();
  useEffect(() => {
    if (token) {
      api.get('/auth/me').then(({ data }) => {
        setAuth(data.user, data.role, token);
      }).catch(() => clear());
    }
  }, []); // eslint-disable-line
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthValidator />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
