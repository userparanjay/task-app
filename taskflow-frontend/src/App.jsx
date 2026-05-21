/**
 * Application router — public auth routes + protected app shell.
 * Lazy loading can be added per-route when bundle size grows.
 */

import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { ROUTES } from './constants';
import ProtectedRoute from './routes/ProtectedRoute';

import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Signup/SignupPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import TaskListPage from './pages/Tasks/TaskListPage';
import CreateTaskPage from './pages/Tasks/CreateTaskPage';
import TaskDetailPage from './pages/Tasks/TaskDetailPage';
import EditTaskPage from './pages/Tasks/EditTaskPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.TASKS} element={<TaskListPage />} />
          <Route path={ROUTES.TASK_CREATE} element={<CreateTaskPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}
