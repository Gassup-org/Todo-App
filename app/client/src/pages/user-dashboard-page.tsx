import { AppShell } from '../components/app-shell';
import { NeonPanel } from '../components/neon-panel';
import { StatCard } from '../components/stat-card';
import { useUserDashboard } from '../utils/dashboard-query-hooks';

export function UserDashboardPage() {
  const dashboard = useUserDashboard();

  return (
    <AppShell>
      <NeonPanel className="todo-page-panel">
        <p className="eyebrow">Your stats</p>
        <h1>User dashboard</h1>
        {dashboard.error ? <p role="alert">Could not load dashboard.</p> : null}
        <div className="stat-grid">
          <StatCard label="Open" value={dashboard.data?.openTodos ?? 0} />
          <StatCard label="Completed" value={dashboard.data?.completedTodos ?? 0} />
          <StatCard label="Overdue" value={dashboard.data?.overdueTodos ?? 0} />
          <StatCard label="Reminders" value={dashboard.data?.upcomingReminders ?? 0} />
        </div>
      </NeonPanel>
    </AppShell>
  );
}
