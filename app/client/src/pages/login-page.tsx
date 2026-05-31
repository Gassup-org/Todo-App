export function LoginPage() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Secure access</p>
        <h1>Sign in to your todo command center.</h1>
        <p>Use Google OAuth to unlock your personal tasks, dashboard, and reminders.</p>
        <a className="login-link" href={`${apiBaseUrl}/auth/google`}>
          Continue with Google
        </a>
      </section>
    </main>
  );
}
