/**
 * Authenticated shell — sidebar + navbar + scrollable main content.
 * All protected pages render inside this layout via React Router outlet pattern.
 */

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Tasks',
  '/tasks/new': 'Create Task',
  '/notifications': 'Notifications',
};

function getPageTitle(pathname) {
  if (pathname.includes('/edit')) return 'Edit Task';
  if (pathname.match(/\/tasks\/[^/]+$/)) return 'Task Details';
  return pageTitles[pathname] || 'TaskFlow';
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const title = getPageTitle(pathname);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
