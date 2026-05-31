import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import { AppShell } from './components/app-shell';
import { AdminDashboardPage } from './pages/admin-dashboard-page';
import { LoginPage } from './pages/login-page';
import { TodosPage } from './pages/todos-page';
import { UserDashboardPage } from './pages/user-dashboard-page';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/todos',
    element: <TodosPage />,
  },
  {
    path: '/dashboard',
    element: <UserDashboardPage />,
  },
  {
    path: '/admin',
    element: <AdminDashboardPage />,
  },
  {
    path: '/',
    element: (
      <AppShell>
        <section className="hero-panel">
          <p className="eyebrow">Todo App</p>
          <h1>Plan your day with focused, neon-dark clarity.</h1>
          <p>Calendar todos, personal dashboards, admin controls, and email reminders are ready.</p>
          <div className="hero-actions">
            <Link className="login-link" to="/login">
              Sign in
            </Link>
          </div>
        </section>
      </AppShell>
    ),
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
