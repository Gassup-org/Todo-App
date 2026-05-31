import { AppShell } from '../components/app-shell';
import { NeonPanel } from '../components/neon-panel';
import { StatCard } from '../components/stat-card';
import { UserManagementFormModal } from '../components/user-management-form-modal';
import { UserManagementTable } from '../components/user-management-table';
import { useAdminDashboard, useAdminUsers } from '../utils/dashboard-query-hooks';

export function AdminDashboardPage() {
  const dashboard = useAdminDashboard();
  const users = useAdminUsers();

  return (
    <AppShell>
      <NeonPanel className="todo-page-panel">
        <p className="eyebrow">Admin control</p>
        <h1>Admin dashboard</h1>
        {dashboard.error || users.error ? <p role="alert">Could not load admin data.</p> : null}
        <div className="stat-grid">
          <StatCard label="Users" value={dashboard.data?.userCount ?? 0} />
          <StatCard label="Active todos" value={dashboard.data?.activeTodoCount ?? 0} />
          <StatCard label="Completion" value={`${Math.round((dashboard.data?.completionRate ?? 0) * 100)}%`} />
          <StatCard label="Failed reminders" value={dashboard.data?.failedReminderCount ?? 0} />
        </div>
        <UserManagementFormModal />
        <UserManagementTable users={users.data?.items} />
      </NeonPanel>
    </AppShell>
  );
}
