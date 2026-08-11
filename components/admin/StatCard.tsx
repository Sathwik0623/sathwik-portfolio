export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card-surface rounded-2xl p-5">
      <p className="text-xs text-muted mb-2">{label}</p>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
