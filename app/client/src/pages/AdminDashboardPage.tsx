import { useEffect, useState } from 'react';
import { StatCard } from '../components/common/StatCard';
import { StateMessage } from '../components/common/StateMessage';
import { getAdminOverview, getAdminUsers, toggleUserStatus, updateUserRole } from '../services/adminApi';
import type { AdminOverview, AdminUser } from '../types/admin';

export function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [overviewRes, usersRes] = await Promise.all([getAdminOverview(), getAdminUsers()]);
      setOverview(overviewRes.overview);
      setUsers(usersRes.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onRoleChange = async (user: AdminUser) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    await updateUserRole(user.id, nextRole);
    await load();
  };

  const onStatusChange = async (user: AdminUser) => {
    const nextStatus = user.status === 'active' ? 'blocked' : 'active';
    await toggleUserStatus(user.id, nextStatus);
    await load();
  };

  if (loading) {
    return <StateMessage title="Loading admin analytics" description="Gathering system metrics..." />;
  }

  if (error) {
    return <StateMessage variant="error" title="Cannot load admin dashboard" description={error} />;
  }

  return (
    <section className="page-stack">
      <h2>Admin Dashboard</h2>
      {overview ? (
        <div className="stat-grid">
          <StatCard title="Total Users" value={overview.totalUsers} />
          <StatCard title="Total Todos" value={overview.totalTodos} />
          <StatCard title="Active Users" value={overview.activeUsers} />
          <StatCard title="Completion Rate" value={`${Math.round(overview.completionRate)}%`} />
        </div>
      ) : null}

      <section className="table-section">
        <h3>User Management</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Todos</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>{user.todoCount}</td>
                  <td className="table-actions">
                    <button className="text-button" onClick={() => onRoleChange(user)}>
                      Toggle Role
                    </button>
                    <button className="text-button" onClick={() => onStatusChange(user)}>
                      {user.status === 'active' ? 'Block' : 'Unblock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}