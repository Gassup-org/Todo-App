import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="app-shell app-shell-with-nav">
      <nav className="top-nav" aria-label="Main navigation">
        <Link to="/">Home</Link>
        <Link to="/todos">Todos</Link>
        <Link to="/login">Login</Link>
      </nav>
      {children}
    </main>
  );
}
