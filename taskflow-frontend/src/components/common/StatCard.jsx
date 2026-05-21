const accentMap = {
  indigo: 'from-indigo-500 to-indigo-600',
  emerald: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600',
  violet: 'from-violet-500 to-violet-600',
};

export default function StatCard({ title, value, icon, accent = 'indigo', loading }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>
          {loading ? (
            <div className="mt-2 h-8 w-16 animate-pulse rounded bg-slate-200" />
          ) : (
            <p className="mt-1 text-3xl font-bold text-slate-900">{value ?? '—'}</p>
          )}
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br text-white ${accentMap[accent]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
