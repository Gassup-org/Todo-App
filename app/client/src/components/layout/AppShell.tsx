import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

export function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="sidebar-title">Neon Tasks</p>
          <p className="sidebar-subtitle">Plan. Focus. Deliver.</p>
        </div>
        <nav className="menu">
          <NavLink to="/app/dashboard">Dashboard</NavLink>
          <NavLink to="/app/todos">Calendar Todos</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="muted">Signed in as</p>
            <h1>{user?.name ?? 'Unknown User'}</h1>
          </div>
          <button className="button secondary" onClick={onLogout}>
            Logout
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}