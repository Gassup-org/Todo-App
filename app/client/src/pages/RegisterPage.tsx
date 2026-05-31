import { Link } from 'react-router-dom';
import { loginWithGoogle } from '../services/authApi';

export function RegisterPage() {
  return (
    <main className="auth-layout">
      <section className="glass-panel narrow">
        <h1>Register</h1>
        <p className="muted">Account provisioning is handled by Google OAuth.</p>
        <button className="button" onClick={loginWithGoogle}>
          Sign up with Google
        </button>
        <p>
          Already have access? <Link to="/login">Go to login</Link>
        </p>
      </section>
    </main>
  );
}