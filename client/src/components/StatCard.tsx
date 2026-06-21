export default function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-dusk border border-mist/30 rounded-xl p-5">
      <p className="text-stone text-xs uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-cream font-display text-3xl">{value}</p>
      {sub && <p className="text-parchment text-xs mt-1">{sub}</p>}
    </div>
  );
}
