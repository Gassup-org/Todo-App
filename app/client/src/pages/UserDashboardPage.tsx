import { useEffect, useState } from 'react';
import { StatCard } from '../components/common/StatCard';
import { StateMessage } from '../components/common/StateMessage';
import { getTodoStats } from '../services/todoApi';
import type { TodoStats } from '../types/todo';

export function UserDashboardPage() {
  const [stats, setStats] = useState<TodoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getTodoStats()
      .then((res) => setStats(res.stats))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <StateMessage title="Loading dashboard" description="Crunching your productivity metrics..." />;
  }

  if (error) {
    return <StateMessage variant="error" title="Cannot load dashboard" description={error} />;
  }

  if (!stats) {
    return <StateMessage title="No data yet" description="Create your first todo to see stats." />;
  }

  return (
    <section className="page-stack">
      <h2>User Dashboard</h2>
      <div className="stat-grid">
        <StatCard title="Total Todos" value={stats.total} />
        <StatCard title="Completed" value={stats.completed} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Completion Rate" value={`${Math.round(stats.completionRate)}%`} />
        <StatCard title="High Priority" value={stats.byPriority.high} />
        <StatCard title="Upcoming Reminders" value={stats.upcomingReminders} />
      </div>
    </section>
  );
}