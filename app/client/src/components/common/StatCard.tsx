interface StatCardProps {
  title: string;
  value: string | number;
  hint?: string;
}

export function StatCard({ title, value, hint }: StatCardProps) {
  return (
    <article className="stat-card">
      <p className="stat-title">{title}</p>
      <p className="stat-value">{value}</p>
      {hint ? <p className="stat-hint">{hint}</p> : null}
    </article>
  );
}