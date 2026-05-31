interface StateMessageProps {
  title: string;
  description?: string;
  variant?: 'info' | 'error';
}

export function StateMessage({ title, description, variant = 'info' }: StateMessageProps) {
  return (
    <div className={`state-message ${variant}`} role={variant === 'error' ? 'alert' : undefined}>
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
    </div>
  );
}