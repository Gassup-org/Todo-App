import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './app';

describe('App', () => {
  it('renders the app shell', () => {
    render(<App />);

    expect(screen.getByText('Todo App')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /plan your day/i })).toBeInTheDocument();
  });
});
