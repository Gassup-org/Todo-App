import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <main className="auth-layout">
      <section className="glass-panel wide">
        <p className="muted">Personal productivity platform</p>
        <h1>Neon Todo Command Center</h1>
        <p>
          Track daily tasks by calendar, switch between list and card views, and monitor your progress with a
          modern dark-tech experience.
        </p>
        <div className="auth-actions">
          <Link to="/login" className="button">
            Login
          </Link>
          <Link to="/register" className="button secondary">
            Register
          </Link>
        </div>
      </section>
    </main>
  );
}