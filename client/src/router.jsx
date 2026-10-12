import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout.jsx';
import { AuthLayout } from './layouts/AuthLayout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { PageLoader } from './components/PageLoader.jsx';

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Habits = lazy(() => import('./pages/Habits.jsx'));
const Insights = lazy(() => import('./pages/Insights.jsx'));
const Tasks = lazy(() => import('./pages/Tasks.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));

const withSuspense = element => <Suspense fallback={<PageLoader />}>{element}</Suspense>;

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: 'login', element: withSuspense(<Login />) },
      { path: 'register', element: withSuspense(<Register />) }
    ]
  },
  {
    path: '/',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { index: true, element: withSuspense(<Dashboard />) },
      { path: 'habits', element: withSuspense(<Habits />) },
      { path: 'tasks', element: withSuspense(<Tasks />) },
      { path: 'insights', element: withSuspense(<Insights />) },
      { path: 'profile', element: withSuspense(<Profile />) }
    ]
  }
]);
