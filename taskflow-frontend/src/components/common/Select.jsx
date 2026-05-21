export default function Select({ label, id, error, options = [], className = '', ...props }) {
  const selectId = id || props.name;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`rounded-lg border bg-white px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
          error ? 'border-danger' : 'border-border focus:border-primary-500'
        }`}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
