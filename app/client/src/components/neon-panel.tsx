import type { ReactNode } from 'react';

export function NeonPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`hero-panel ${className}`.trim()}>{children}</section>;
}
