import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../providers/AuthProvider';

vi.mock('../providers/AuthProvider', () => ({ useAuth: vi.fn() }));

const mockedUseAuth = vi.mocked(useAuth);

test('redirects unauthenticated users to login', () => {
  mockedUseAuth.mockReturnValue({
    user: null,
    loading: false,
    isAuthenticated: false,
    hasRole: () => false,
    logout: vi.fn(),
    setUser: vi.fn(),
    refreshUser: vi.fn()
  });

  render(
    <MemoryRouter initialEntries={['/app/dashboard']}>
      <Routes>
        <Route
          path="/app/dashboard"
          element={
            <ProtectedRoute roles={['user']}>
              <div>Private</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Login page')).toBeInTheDocument();
});