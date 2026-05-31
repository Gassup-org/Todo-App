import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { loginWithGoogle } from '../services/authApi';
import { setStoredToken } from '../services/apiClient';
import { useAuth } from '../providers/AuthProvider';

export function LoginPage() {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [oauthError, setOauthError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      setOauthError(error);
    }

    if (token) {
      setStoredToken(token);
      refreshUser()
        .then(() => navigate('/app/dashboard', { replace: true }))
        .catch(() => setOauthError('Could not load Google account after login.'));
    }
  }, [searchParams, refreshUser, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const target = user?.role === 'admin' ? '/admin' : '/app/dashboard';
      navigate((location.state as { from?: string } | null)?.from ?? target, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  return (
    <main className="auth-layout">
      <section className="glass-panel narrow">
        <h1>Login</h1>
        <p className="muted">Use Google OAuth to continue.</p>
        {oauthError ? <p className="error-text">{oauthError}</p> : null}
        <button className="button" onClick={loginWithGoogle}>
          Continue with Google
        </button>
        <p>
          New here? <Link to="/register">Create account</Link>
        </p>
      </section>
    </main>
  );
}
