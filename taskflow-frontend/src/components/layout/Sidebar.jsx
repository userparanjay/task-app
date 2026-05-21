import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants';

const navItems = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: '📊' },
  { to: ROUTES.TASKS, label: 'Tasks', icon: '✓' },
  { to: ROUTES.TASK_CREATE, label: 'Create Task', icon: '＋' },
  { to: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: '🔔' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
            TF
          </span>
          <div>
            <p className="font-semibold text-slate-900">TaskFlow</p>
            <p className="text-xs text-muted">Microservices Suite</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <p className="text-xs text-muted">API: {import.meta.env.VITE_API_BASE_URL || 'not set'}</p>
        </div>
      </aside>
    </>
  );
}
