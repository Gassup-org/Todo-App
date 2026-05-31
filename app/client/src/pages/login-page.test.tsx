import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoginPage } from './login-page';

describe('LoginPage', () => {
  it('links to Google OAuth endpoint', () => {
    render(<LoginPage />);

    expect(screen.getByRole('link', { name: /continue with google/i })).toHaveAttribute(
      'href',
      'http://localhost:4000/api/v1/auth/google',
    );
  });
});
